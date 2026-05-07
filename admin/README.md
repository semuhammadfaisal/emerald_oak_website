# Emerald OAK Admin Panel

Complete property management system for Emerald OAK Real Estate & Builders.

## 🔐 Login Credentials

**Username:** `admin`  
**Password:** `emeraldoak2024`

## 📋 Features

### Dashboard
- Real-time statistics overview
- Total properties count
- Active projects tracking
- New inquiries monitoring
- Sold properties count
- Recent properties list

### Properties Management
- Add new properties
- Edit existing properties
- Delete properties
- Search and filter by status
- Property details:
  - Title, Location, Type
  - Size, Price, Status
  - Description, Features
  - Image upload

### Projects Management
- Add construction projects
- Track project completion
- Update project status
- Project details:
  - Title, Location
  - Status (Ongoing/Completed/Planned)
  - Completion percentage
  - Description, Images

### Inquiries Management
- View contact form submissions
- Track inquiry status
- Update inquiry status (New/Contacted/Closed)
- Delete inquiries
- Full inquiry details view

## 🚀 Access Admin Panel

1. Navigate to: `admin/login.html`
2. Enter credentials
3. Access dashboard

## 💾 Data Storage

All data is stored in browser's localStorage:
- `emeraldOakAuth` - Authentication status
- `emeraldOakProperties` - Properties data
- `emeraldOakProjects` - Projects data
- `emeraldOakInquiries` - Contact inquiries

## 📱 Responsive Design

- Desktop optimized
- Tablet friendly
- Mobile responsive sidebar

## 🎨 Admin Pages

1. **login.html** - Authentication page
2. **dashboard.html** - Main dashboard with stats
3. **properties.html** - Properties CRUD operations
4. **projects.html** - Projects management
5. **inquiries.html** - Contact inquiries

## 🔧 File Structure

```
admin/
├── css/
│   └── admin.css          # Admin panel styles
├── js/
│   ├── auth.js            # Authentication logic
│   ├── dashboard.js       # Dashboard functionality
│   ├── properties.js      # Properties management
│   ├── projects.js        # Projects management
│   └── inquiries.js       # Inquiries management
├── login.html             # Login page
├── dashboard.html         # Dashboard
├── properties.html        # Properties page
├── projects.html          # Projects page
├── inquiries.html         # Inquiries page
└── README.md             # This file
```

## 🔒 Security Notes

- Change default credentials in `js/auth.js`
- For production, implement server-side authentication
- Use secure backend API for data storage
- Add HTTPS for secure connections

## 💡 Usage Tips

### Adding Properties
1. Click "Add Property" button
2. Fill in all required fields
3. Add image URL or path
4. Save property

### Managing Inquiries
1. View new inquiries from dashboard
2. Click "View" to see full details
3. Update status as you contact customers
4. Delete resolved inquiries

### Tracking Projects
1. Add ongoing construction projects
2. Update completion percentage
3. Change status when completed

## 🔄 Future Enhancements

- Image upload functionality
- Export data to CSV/PDF
- Email notifications
- Advanced analytics
- Multi-user support
- Role-based access control

---

**Built for Emerald OAK Real Estate & Builders**
