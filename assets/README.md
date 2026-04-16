# Assets Folder

This folder contains all media assets for the Emerald OAK website.

## 📁 Folder Structure

```
assets/
├── images/          # All image files
│   ├── hero/        # Hero section backgrounds
│   ├── properties/  # Property images
│   ├── team/        # Team member photos
│   └── logo/        # Logo files
├── videos/          # Video files
└── icons/           # Icon files and favicon
```

## 🖼️ Images Folder

### Current Placeholder Images (Replace with actual images)

**Hero Sections:**
- `hero-home.jpg` - Home page hero background
- `hero-about.jpg` - About page hero background
- `hero-contact.jpg` - Contact page hero background

**Properties:**
- `property-1.jpg` - Luxury Villa
- `property-2.jpg` - Modern Apartment
- `property-3.jpg` - Family House

**Team:**
- `team-ceo.jpg` - CEO photo
- `team-1.jpg` - Sarah Mitchell
- `team-2.jpg` - Michael Chen
- `team-3.jpg` - Emily Rodriguez
- `team-4.jpg` - David Thompson

**Logo:**
- `logo.png` - Main logo (transparent background)
- `logo-white.png` - White version for dark backgrounds
- `favicon.ico` - Browser favicon

## 🎥 Videos Folder

Place promotional videos, property tours, and testimonial videos here.

**Recommended formats:**
- MP4 (H.264 codec)
- WebM (for better web performance)

## 🎨 Icons Folder

Place custom icons and favicon files here.

**Files to include:**
- `favicon.ico` - 16x16, 32x32, 48x48
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` - 180x180 for iOS
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

## 📝 Image Guidelines

### Recommended Sizes:
- **Hero Images**: 1920x1080px (Full HD)
- **Property Cards**: 800x600px
- **Team Photos**: 500x500px (square)
- **Logo**: 500x500px (transparent PNG)

### Optimization:
- Compress images before uploading
- Use WebP format for better performance
- Keep file sizes under 500KB for web images

## 🔗 Usage in Code

```html
<!-- Hero Background -->
<div style="background-image: url('assets/images/hero/hero-home.jpg')">

<!-- Property Image -->
<img src="assets/images/properties/property-1.jpg" alt="Property">

<!-- Team Photo -->
<img src="assets/images/team/team-1.jpg" alt="Team Member">

<!-- Logo -->
<img src="assets/images/logo/logo.png" alt="Emerald OAK">
```

## 📦 Current Status

Currently using Unsplash placeholder images via CDN. Replace with actual images by:

1. Adding images to appropriate folders
2. Updating image paths in HTML/CSS files
3. Removing Unsplash URLs

---

**Note**: Remember to optimize all images before deployment for better website performance.
