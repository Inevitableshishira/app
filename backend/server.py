from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import resend
import os
import uuid
import logging

# ================= ENV =================

MONGO_URL      = os.environ.get("MONGO_URL")
DB_NAME        = os.environ.get("DB_NAME", "apexforge")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")

resend.api_key = RESEND_API_KEY

# ================= APP =================

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

api_router = APIRouter(prefix="/api")

# ================= DATABASE =================

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ================= SECURITY =================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security    = HTTPBearer()

SECRET_KEY                  = os.environ.get("JWT_SECRET_KEY", "change-this-in-production")
ALGORITHM                   = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# ================= MODELS =================

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    image: str
    images: Optional[List[str]] = []
    year: str
    location: str
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectCreate(BaseModel):
    title: str
    category: str
    image: str
    images: Optional[List[str]] = []
    year: str
    location: str
    description: str

class ProjectUpdate(BaseModel):
    title: Optional[str]       = None
    category: Optional[str]    = None
    image: Optional[str]       = None
    images: Optional[List[str]] = None
    year: Optional[str]        = None
    location: Optional[str]    = None
    description: Optional[str] = None

class ContactInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactInquiryCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# ================= AUTH HELPERS =================

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire    = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload  = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ================= EMAIL =================

async def send_email_notification(inquiry: ContactInquiry):
    if not RESEND_API_KEY:
        logging.warning("Resend API key not set — email not sent.")
        return
    try:
        resend.Emails.send({
            "from": os.environ.get("SENDER_EMAIL", "noreply@apexforgestudio.in"),
            "to": [os.environ.get("ADMIN_EMAIL", "shreesha@apexforgestudio.in")],
            "subject": f"New Website Inquiry — {inquiry.name}",
            "html": f"""
                <div style="font-family: Arial; padding: 20px; max-width: 600px;">
                    <h2 style="border-bottom: 1px solid #eee; padding-bottom: 12px;">New Inquiry Received</h2>
                    <p><strong>Name:</strong> {inquiry.name}</p>
                    <p><strong>Email:</strong> {inquiry.email}</p>
                    <p><strong>Date:</strong> {inquiry.created_at.strftime('%Y-%m-%d %H:%M UTC')}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
                    <p><strong>Message:</strong></p>
                    <p style="background: #f9f9f9; padding: 16px; border-left: 3px solid #000;">
                        {inquiry.message}
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 24px;">
                        Reply directly to this email to respond to {inquiry.name}.
                    </p>
                </div>
            """
        })
        logging.info("Inquiry email sent successfully")
    except Exception as e:
        logging.error(f"Email send failed: {str(e)}")

# ================= PUBLIC ROUTES =================

@api_router.get("/")
async def root():
    return {"message": "ApexForge Studio API Running"}

@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    for p in projects:
        if isinstance(p.get("created_at"), str):
            p["created_at"] = datetime.fromisoformat(p["created_at"])
        if "images" not in p:
            p["images"] = []
    return projects

@api_router.post("/contact", response_model=ContactInquiry)
@limiter.limit("5/minute")
async def submit_contact(request: Request, inquiry: ContactInquiryCreate):
    inquiry_obj = ContactInquiry(**inquiry.model_dump())
    doc = inquiry_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.inquiries.insert_one(doc)
    await send_email_notification(inquiry_obj)
    return inquiry_obj

# ================= ADMIN ROUTES =================

@api_router.post("/admin/login", response_model=Token)
@limiter.limit("10/minute")
async def admin_login(request: Request, credentials: AdminLogin):
    admin_user       = os.environ.get("ADMIN_USERNAME", "admin")
    admin_pass_hash  = os.environ.get("ADMIN_PASSWORD_HASH", "")
    admin_pass_plain = os.environ.get("ADMIN_PASSWORD", "admin123")

    if credentials.username != admin_user:
        raise HTTPException(status_code=401, detail="Incorrect credentials")

    # Use bcrypt hash if set, fall back to plaintext (for backwards compat)
    if admin_pass_hash:
        if not verify_password(credentials.password, admin_pass_hash):
            raise HTTPException(status_code=401, detail="Incorrect credentials")
    else:
        if credentials.password != admin_pass_plain:
            raise HTTPException(status_code=401, detail="Incorrect credentials")

    token = create_access_token({"sub": credentials.username})
    return {"access_token": token, "token_type": "bearer"}

@api_router.post("/admin/projects", response_model=Project)
async def create_project(project: ProjectCreate, _: str = Depends(get_current_admin)):
    project_obj = Project(**project.model_dump())
    doc = project_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.projects.insert_one(doc)
    return project_obj

@api_router.put("/admin/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, update: ProjectUpdate, _: str = Depends(get_current_admin)):
    existing = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_data:
        await db.projects.update_one({"id": project_id}, {"$set": update_data})
    updated = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if isinstance(updated.get("created_at"), str):
        updated["created_at"] = datetime.fromisoformat(updated["created_at"])
    if "images" not in updated:
        updated["images"] = []
    return Project(**updated)

@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, _: str = Depends(get_current_admin)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

@api_router.get("/admin/inquiries", response_model=List[ContactInquiry])
async def get_inquiries(_: str = Depends(get_current_admin)):
    inquiries = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for i in inquiries:
        if isinstance(i.get("created_at"), str):
            i["created_at"] = datetime.fromisoformat(i["created_at"])
    return inquiries

@api_router.delete("/admin/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, _: str = Depends(get_current_admin)):
    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Inquiry deleted"}

# ================= CORS =================

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= REGISTER ROUTER =================

app.include_router(api_router)

# ================= SHUTDOWN =================

@app.on_event("shutdown")
async def shutdown():
    client.close()

logging.basicConfig(level=logging.INFO)
