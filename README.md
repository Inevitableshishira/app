# ApexForge Studio – Architecture Portfolio

A full-stack portfolio website with project management and contact system.

## Core Features
- Portfolio projects from MongoDB  
- Contact form (stores inquiries + email notifications)  
- Admin panel (/admin) with authentication  
- CRUD for projects + inquiry management  
- Responsive and SEO-friendly  

## Tech Stack
**Frontend:** React, Tailwind, Axios  
**Backend:** FastAPI, MongoDB (Motor), JWT Auth  
**Other:** Resend (emails), Bcrypt (security)  

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
```

Configure `.env`:
- MONGO_URL  
- RESEND_API_KEY  
- ADMIN_EMAIL  
- ADMIN_USERNAME  
- ADMIN_PASSWORD  

### Frontend
```bash
cd frontend
yarn install
```

### Run
- Backend and frontend run via supervisor  

## Important APIs
- GET /api/projects  
- POST /api/contact  
- POST /api/admin/login  
- POST /api/admin/projects  
- PUT /api/admin/projects/{id}  
- DELETE /api/admin/projects/{id}  
- GET /api/admin/inquiries  

## Admin Usage
- Navigate to `/admin`  
- Add / edit / delete projects  
- View and manage inquiries  

## Production Essentials
Update `.env`:
- MONGO_URL  
- JWT_SECRET_KEY  
- ADMIN credentials  
- RESEND_API_KEY  
- CORS_ORIGINS  
- REACT_APP_BACKEND_URL  

## Database (Minimal)

### Projects
- title  
- category  
- image  
- year  
- location  
- description  

### Inquiries
- name  
- email  
- message  
