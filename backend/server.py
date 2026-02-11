from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'apexforge-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Resend email setup
resend.api_key = os.environ.get('RESEND_API_KEY', '')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    image: str
    year: str
    location: str
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectCreate(BaseModel):
    title: str
    category: str
    image: str
    year: str
    location: str
    description: str

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    year: Optional[str] = None
    location: Optional[str] = None
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

# ============ AUTH HELPERS ============

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

# ============ EMAIL HELPER ============

async def send_email_notification(inquiry: ContactInquiry):
    """Send email notification for new contact inquiry"""
    if not resend.api_key:
        logging.warning("Resend API key not configured. Email not sent.")
        return
    
    try:
        resend.Emails.send({
            "from": os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev'),
            "to": os.environ.get('ADMIN_EMAIL', 'admin@apexforge.com'),
            "subject": f"New Contact Inquiry from {inquiry.name}",
            "html": f"""
            <html>
                <body style="font-family: 'Inter', sans-serif; background: #fff; color: #000; padding: 40px;">
                    <h1 style="font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 20px;">New Inquiry</h1>
                    <div style="border-left: 2px solid #000; padding-left: 20px; margin: 30px 0;">
                        <p><strong>Name:</strong> {inquiry.name}</p>
                        <p><strong>Email:</strong> {inquiry.email}</p>
                        <p><strong>Date:</strong> {inquiry.created_at.strftime('%B %d, %Y at %H:%M UTC')}</p>
                    </div>
                    <div style="margin-top: 30px; padding: 20px; background: #f5f5f5;">
                        <p style="font-size: 14px; line-height: 1.6;"><strong>Message:</strong></p>
                        <p style="font-size: 14px; line-height: 1.6;">{inquiry.message}</p>
                    </div>
                </body>
            </html>
            """
        })
        logging.info(f"Email sent for inquiry {inquiry.id}")
    except Exception as e:
        logging.error(f"Failed to send email: {str(e)}")

# ============ PUBLIC ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "ApexForge Studio API"}

@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    """Get all projects (public)"""
    projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    for project in projects:
        if isinstance(project.get('created_at'), str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
    return projects

@api_router.post("/contact", response_model=ContactInquiry)
async def submit_contact(inquiry: ContactInquiryCreate):
    """Submit contact inquiry (public)"""
    inquiry_obj = ContactInquiry(**inquiry.model_dump())
    doc = inquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.inquiries.insert_one(doc)
    
    # Send email notification in background
    await send_email_notification(inquiry_obj)
    
    return inquiry_obj

# ============ ADMIN AUTH ROUTES ============

@api_router.post("/admin/login", response_model=Token)
async def admin_login(credentials: AdminLogin):
    """Admin login"""
    # Check credentials from environment or default
    admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_password_hash = os.environ.get('ADMIN_PASSWORD_HASH', get_password_hash('admin123'))
    
    if credentials.username != admin_username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # For first-time setup, check plain password
    if not verify_password(credentials.password, admin_password_hash):
        # Try plain password for initial setup
        if credentials.password != os.environ.get('ADMIN_PASSWORD', 'admin123'):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
    
    access_token = create_access_token(data={"sub": credentials.username})
    return {"access_token": access_token, "token_type": "bearer"}

# ============ ADMIN PROJECT ROUTES ============

@api_router.post("/admin/projects", response_model=Project)
async def create_project(project: ProjectCreate, _: str = Depends(get_current_admin)):
    """Create new project (admin only)"""
    project_obj = Project(**project.model_dump())
    doc = project_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.projects.insert_one(doc)
    return project_obj

@api_router.put("/admin/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    _: str = Depends(get_current_admin)
):
    """Update project (admin only)"""
    existing = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = {k: v for k, v in project_update.model_dump().items() if v is not None}
    if update_data:
        await db.projects.update_one({"id": project_id}, {"$set": update_data})
    
    updated = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return Project(**updated)

@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, _: str = Depends(get_current_admin)):
    """Delete project (admin only)"""
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

# ============ ADMIN INQUIRY ROUTES ============

@api_router.get("/admin/inquiries", response_model=List[ContactInquiry])
async def get_inquiries(_: str = Depends(get_current_admin)):
    """Get all contact inquiries (admin only)"""
    inquiries = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for inquiry in inquiries:
        if isinstance(inquiry.get('created_at'), str):
            inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
    return inquiries

@api_router.delete("/admin/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, _: str = Depends(get_current_admin)):
    """Delete inquiry (admin only)"""
    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Inquiry deleted"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()



@app.get("/create-admin")
def create_admin():
    from passlib.context import CryptContext
    from database import SessionLocal
    from models import User

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    db = SessionLocal()

    admin = db.query(User).filter(User.username == "admin").first()
    if admin:
        return {"message": "Admin already exists"}

    new_admin = User(
        username="admin",
        password=pwd_context.hash("admin"),
        role="admin"
    )

    db.add(new_admin)
    db.commit()
    db.close()

    return {"message": "Admin created"}
