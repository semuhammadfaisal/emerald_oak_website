# 🏗️ SYSTEM ARCHITECTURE - Emerald OAK

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    EMERALD OAK WEBSITE                       │
│                  (Deployed on Vercel)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   PUBLIC     │    │    ADMIN     │    │   CONTACT    │
│   WEBSITE    │    │    PANEL     │    │     FORM     │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   SUPABASE API   │
                    │  (Cloud Backend) │
                    └──────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │PostgreSQL│  │   Auth   │  │ Storage  │
        │ Database │  │  System  │  │ (Images) │
        └──────────┘  └──────────┘  └──────────┘
```

---

## Components Breakdown

### 1. PUBLIC WEBSITE
**Location**: `/index.html`, `/about.html`, `/contact.html`

**Features**:
- Property showcase
- Company information
- Contact form
- Responsive design

**Data Flow**:
- Reads available properties from Supabase
- Submits contact inquiries to Supabase

---

### 2. ADMIN PANEL
**Location**: `/admin/`

**Pages**:
- `login.html` - Authentication
- `dashboard.html` - Statistics overview
- `properties.html` - Property CRUD
- `projects.html` - Project CRUD
- `inquiries.html` - Contact management
- `settings.html` - System settings

**Authentication**:
- Supabase Auth (email/password)
- Session management
- Protected routes

**Data Operations**:
- Create, Read, Update, Delete (CRUD)
- Real-time data sync
- Image upload support

---

### 3. SUPABASE BACKEND

#### Database (PostgreSQL)
**Tables**:
1. **properties**
   - id, title, location, type, size, price
   - status, description, features, image_url
   - created_at, updated_at

2. **projects**
   - id, title, location, status, completion
   - description, image_url
   - created_at, updated_at

3. **inquiries**
   - id, name, email, phone, message
   - status, created_at, updated_at

#### Authentication
- Email/password authentication
- Session management
- Row Level Security (RLS)

#### Storage
- Bucket: `property-images`
- Public read access
- Authenticated write access

---

## Data Flow Diagrams

### Property Management Flow
```
Admin → Login → Dashboard → Properties Page
                                    │
                                    ▼
                            Add/Edit Property
                                    │
                                    ▼
                            Supabase API
                                    │
                                    ▼
                            PostgreSQL Database
                                    │
                                    ▼
                            Updated Data
                                    │
                                    ▼
                            Refresh UI
```

### Contact Form Flow
```
Visitor → Fill Contact Form → Submit
                                 │
                                 ▼
                         Supabase API
                                 │
                                 ▼
                    Insert into inquiries table
                                 │
                                 ▼
                         Success Message
                                 │
                                 ▼
                    Admin sees in Inquiries page
```

### Authentication Flow
```
Admin → Enter Email/Password → Submit
                                   │
                                   ▼
                           Supabase Auth
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
              Valid User?                    Invalid?
                    │                             │
                    ▼                             ▼
            Create Session                  Show Error
                    │
                    ▼
            Redirect to Dashboard
```

---

## Security Architecture

### Row Level Security (RLS)

#### Properties Table
```sql
-- Public can view available properties
SELECT: status = 'available'

-- Authenticated users can do everything
ALL: auth.role() = 'authenticated'
```

#### Projects Table
```sql
-- Public can view completed projects
SELECT: status = 'completed'

-- Authenticated users can do everything
ALL: auth.role() = 'authenticated'
```

#### Inquiries Table
```sql
-- Public can insert (contact form)
INSERT: true

-- Authenticated users can do everything
ALL: auth.role() = 'authenticated'
```

---

## File Structure

```
emerald_oak_website/
│
├── admin/                      # Admin Panel
│   ├── css/
│   │   └── admin.css          # Admin styles
│   ├── js/
│   │   ├── auth-supabase.js   # Authentication
│   │   ├── dashboard-supabase.js
│   │   ├── properties-supabase.js
│   │   ├── projects-supabase.js
│   │   └── inquiries-supabase.js
│   ├── login.html
│   ├── dashboard.html
│   ├── properties.html
│   ├── projects.html
│   ├── inquiries.html
│   └── settings.html
│
├── config/
│   └── supabase.js            # Supabase configuration
│
├── js/
│   ├── main.js                # Main website scripts
│   └── contact-form.js        # Contact form handler
│
├── css/
│   └── style.css              # Website styles
│
├── components/
│   ├── navbar.html            # Reusable navbar
│   └── footer.html            # Reusable footer
│
├── index.html                 # Home page
├── about.html                 # About page
├── contact.html               # Contact page
│
├── database_schema.sql        # Database setup
├── SUPABASE_SETUP_GUIDE.md   # Setup instructions
└── QUICK_START.md            # Quick reference

```

---

## Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript (ES6+)** - Functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Supabase Auth** - Authentication
- **Supabase Storage** - File storage

### Hosting
- **Vercel** - Website hosting
- **Supabase Cloud** - Database & API hosting

---

## API Endpoints (Supabase Auto-Generated)

### Properties
- `GET /rest/v1/properties` - List all properties
- `POST /rest/v1/properties` - Create property
- `PATCH /rest/v1/properties?id=eq.{id}` - Update property
- `DELETE /rest/v1/properties?id=eq.{id}` - Delete property

### Projects
- `GET /rest/v1/projects` - List all projects
- `POST /rest/v1/projects` - Create project
- `PATCH /rest/v1/projects?id=eq.{id}` - Update project
- `DELETE /rest/v1/projects?id=eq.{id}` - Delete project

### Inquiries
- `GET /rest/v1/inquiries` - List all inquiries
- `POST /rest/v1/inquiries` - Create inquiry
- `PATCH /rest/v1/inquiries?id=eq.{id}` - Update inquiry
- `DELETE /rest/v1/inquiries?id=eq.{id}` - Delete inquiry

### Authentication
- `POST /auth/v1/signup` - Register user
- `POST /auth/v1/token?grant_type=password` - Login
- `POST /auth/v1/logout` - Logout
- `GET /auth/v1/user` - Get current user

---

## Performance Optimization

### Frontend
- ✅ Lazy loading images
- ✅ Minified CSS/JS (in production)
- ✅ CDN for libraries
- ✅ Responsive images

### Backend
- ✅ Database indexes on frequently queried columns
- ✅ Connection pooling (Supabase handles)
- ✅ Caching (Supabase handles)
- ✅ CDN for static assets (Vercel)

---

## Scalability

### Current Capacity (Free Tier)
- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **Users**: 50,000 MAU
- **API Requests**: Unlimited

### Scaling Options
1. **Upgrade Supabase Plan**
   - Pro: $25/month (8GB database, 100GB storage)
   - Team: $599/month (Dedicated resources)

2. **Optimize Queries**
   - Add more indexes
   - Use pagination
   - Implement caching

3. **CDN for Images**
   - Use Cloudinary or similar
   - Reduce storage costs

---

## Monitoring & Analytics

### Supabase Dashboard
- Database size
- API requests
- Active users
- Error logs

### Vercel Analytics
- Page views
- Performance metrics
- Deployment status

---

## Backup & Recovery

### Automatic Backups
- Supabase: Daily automatic backups
- Retention: 7 days (free tier)

### Manual Backup
- Export data via admin settings
- Download as JSON
- Store securely

### Recovery
- Restore from Supabase dashboard
- Point-in-time recovery (paid plans)

---

## Future Enhancements

### Phase 1 (Immediate)
- [ ] Direct image upload in admin
- [ ] Email notifications for inquiries
- [ ] Property search on website
- [ ] Featured properties section

### Phase 2 (Short-term)
- [ ] Property comparison tool
- [ ] Virtual tour integration
- [ ] Advanced filtering
- [ ] Property favorites

### Phase 3 (Long-term)
- [ ] Mobile app
- [ ] Customer portal
- [ ] Payment integration
- [ ] Analytics dashboard

---

## Support & Maintenance

### Regular Tasks
- Monitor database size
- Review error logs
- Update dependencies
- Backup data regularly

### Security Updates
- Keep Supabase client updated
- Review RLS policies
- Audit user access
- Monitor API usage

---

**System Status**: ✅ Production Ready

**Last Updated**: 2024

**Version**: 2.0 (Supabase Integration)

---

Built with ❤️ for Emerald OAK Real Estate & Builders
