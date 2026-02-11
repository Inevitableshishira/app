# ApexForge Studio - Architecture Portfolio Website

A production-grade, full-stack architecture portfolio website with dynamic content management and contact inquiry system.

## 🎨 Features

### Public Website
- **Minimalist Design**: Beautiful monochrome aesthetic with Playfair Display and Inter fonts
- **Dynamic Portfolio**: Projects loaded from MongoDB database
- **Responsive Layout**: Fully responsive design for all devices
- **Contact Form**: Functional contact form with database storage and email notifications
- **Smooth Animations**: Fade-up animations, grayscale hover effects, and smooth scrolling
- **SEO Optimized**: Proper meta tags and semantic HTML

### Admin Panel
- **Secure Authentication**: JWT-based authentication system
- **Project Management**: Full CRUD operations for portfolio projects
- **Inquiry Management**: View and manage contact form submissions
- **Hidden Route**: Admin panel accessible at `/admin` (not visible to public)

## 🚀 Live Demo

- **Public Website**: https://design-to-launch.preview.emergentagent.com
- **Admin Panel**: https://design-to-launch.preview.emergentagent.com/admin

### Admin Credentials (Default)
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## 📋 Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- Tailwind CSS
- Custom CSS animations

### Backend
- FastAPI (Python)
- Motor (Async MongoDB driver)
- Resend (Email service)
- JWT Authentication
- Passlib + Bcrypt for password hashing

### Database
- MongoDB

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB
- Resend API key (for email notifications)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit .env file with your values:
# - MONGO_URL (MongoDB connection string)
# - RESEND_API_KEY (Get from https://resend.com)
# - ADMIN_EMAIL (Email to receive inquiries)
# - ADMIN_USERNAME and ADMIN_PASSWORD (Admin credentials)
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
yarn install

# Environment is already configured in .env
```

### 3. Seed Initial Projects

```bash
# From project root
python3 scripts/seed_projects.py
```

### 4. Start Development Servers

Backend and frontend are managed by Supervisor and run automatically with hot reload enabled.

## 📧 Email Configuration

To enable email notifications for contact inquiries:

1. Sign up for a free account at [Resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add your API key to `/app/backend/.env`:
   ```
   RESEND_API_KEY=re_your_api_key_here
   SENDER_EMAIL=onboarding@resend.dev
   ADMIN_EMAIL=your-email@domain.com
   ```
4. Restart backend: `sudo supervisorctl restart backend`

If you have a custom domain, verify it in Resend and update `SENDER_EMAIL`.

## 🔐 Security

### Change Admin Credentials

**Method 1: Environment Variables (Recommended)**
```bash
# Edit /app/backend/.env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
JWT_SECRET_KEY=your_random_secret_key
```

**Method 2: Generate Password Hash**
```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = pwd_context.hash("your_new_password")
print(hashed)
```

Then add to `.env`:
```
ADMIN_PASSWORD_HASH=hashed_password_here
```

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend configuration
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Navbar.js
│   │   │   ├── Hero.js
│   │   │   ├── Portfolio.js
│   │   │   ├── About.js
│   │   │   ├── Footer.js
│   │   │   └── Logo.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   └── AdminPage.js
│   │   ├── App.js
│   │   └── App.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env              # Frontend configuration
├── scripts/
│   └── seed_projects.py  # Database seeding script
└── README.md
```

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/` - API health check
- `GET /api/projects` - Get all projects
- `POST /api/contact` - Submit contact inquiry

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/{id}` - Update project
- `DELETE /api/admin/projects/{id}` - Delete project
- `GET /api/admin/inquiries` - Get all inquiries
- `DELETE /api/admin/inquiries/{id}` - Delete inquiry

## 📱 Usage

### Managing Portfolio Projects

1. Navigate to `/admin` and login
2. Click "+ ADD PROJECT"
3. Fill in project details:
   - Title
   - Category (Residential/Commercial/Urban/Interior)
   - Year
   - Location
   - Image URL (use Unsplash or your own CDN)
   - Description
4. Click "CREATE PROJECT"

### Viewing Contact Inquiries

1. Login to admin panel
2. Click "INQUIRIES" tab
3. View all submissions with name, email, message, and timestamp
4. Delete inquiries when processed

## 🌐 Domain Setup

When you buy a domain:

1. **Update Frontend .env**:
   ```
   REACT_APP_BACKEND_URL=https://your-domain.com
   ```

2. **Update Backend .env**:
   ```
   CORS_ORIGINS=https://your-domain.com
   ```

3. **Configure DNS**: Point your domain to the deployment server

4. **SSL Certificate**: Set up HTTPS (recommended: Let's Encrypt)

## 🚢 Production Deployment

### Environment Variables to Update

**Backend (.env)**:
- `MONGO_URL` - Production MongoDB connection string
- `JWT_SECRET_KEY` - Strong random secret (use `openssl rand -hex 32`)
- `ADMIN_USERNAME` - Secure admin username
- `ADMIN_PASSWORD` - Strong admin password
- `RESEND_API_KEY` - Production email API key
- `ADMIN_EMAIL` - Your business email
- `CORS_ORIGINS` - Your production domain

**Frontend (.env)**:
- `REACT_APP_BACKEND_URL` - Your production backend URL

## 📝 Database Schema

### Projects Collection
```javascript
{
  id: string,
  title: string,
  category: string,
  image: string,
  year: string,
  location: string,
  description: string,
  created_at: datetime
}
```

### Inquiries Collection
```javascript
{
  id: string,
  name: string,
  email: string,
  message: string,
  created_at: datetime
}
```

## 🎨 Design Features

- **Fonts**: Playfair Display (serif) + Inter (sans-serif)
- **Color Scheme**: Pure monochrome (black & white)
- **Typography**: Uppercase tracking for labels, large serif headings
- **Effects**: Grayscale images with hover color reveal
- **Layout**: Asymmetric grid with generous whitespace

## 🤝 Support

For questions or issues:
- Check backend logs: `tail -f /var/log/supervisor/backend.*.log`
- Check frontend logs: `tail -f /var/log/supervisor/frontend.*.log`

## 📄 License

This project is built for production use. Customize and deploy as needed.

---

**Built with precision. Deployed with confidence.**
