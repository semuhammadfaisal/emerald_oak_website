# 🚀 QUICK START - Supabase Integration

## ⚡ 5-Minute Setup

### 1️⃣ Create Supabase Account
- Go to: https://supabase.com
- Sign up (free)
- Create new project

### 2️⃣ Get Credentials
- Settings → API
- Copy:
  - Project URL
  - anon public key

### 3️⃣ Run Database Schema
- SQL Editor → New query
- Copy/paste from `database_schema.sql`
- Click "Run"

### 4️⃣ Create Admin User
- Authentication → Users → Add user
- Email: `admin@emeraldoak.com`
- Password: (your choice)
- Toggle "Auto Confirm User" ON

### 5️⃣ Update Config
Edit `config/supabase.js`:
```javascript
const SUPABASE_CONFIG = {
  url: 'YOUR_PROJECT_URL_HERE',
  anonKey: 'YOUR_ANON_KEY_HERE'
};
```

### 6️⃣ Deploy
```bash
git add .
git commit -m "Add Supabase"
git push
```

### 7️⃣ Test
- Login: `your-site.vercel.app/admin/login.html`
- Use email/password from step 4

---

## 📁 Files Created

✅ `config/supabase.js` - Configuration  
✅ `database_schema.sql` - Database setup  
✅ `admin/js/*-supabase.js` - New admin scripts  
✅ `js/contact-form.js` - Contact form handler  

---

## 🔑 Login Credentials

**Admin Panel**: `/admin/login.html`

**Email**: The email you created in Supabase  
**Password**: The password you set

(NOT the old admin/emeraldoak2024)

---

## 📊 Database Tables

1. **properties** - Property listings
2. **projects** - Construction projects  
3. **inquiries** - Contact form submissions

---

## 🎯 What Changed?

### Before (LocalStorage):
- Data stored in browser
- Lost when cache cleared
- No real authentication
- No image storage

### After (Supabase):
- ✅ Cloud database
- ✅ Real authentication
- ✅ Image storage
- ✅ Secure & scalable
- ✅ Multi-device access

---

## 🔧 Troubleshooting

**Can't login?**
- Check you created user in Supabase
- Verify email/password
- Check browser console for errors

**"Invalid API key"?**
- Update `config/supabase.js` with real credentials
- Redeploy to Vercel

**Contact form not working?**
- Check Supabase config is correct
- Verify inquiries table exists
- Check browser console

---

## 📖 Full Documentation

See `SUPABASE_SETUP_GUIDE.md` for complete instructions

---

## ✅ Quick Test Checklist

- [ ] Can login to admin
- [ ] Can add property
- [ ] Can edit property
- [ ] Can delete property
- [ ] Contact form works
- [ ] Inquiry appears in admin

---

**Need detailed help?** → Read `SUPABASE_SETUP_GUIDE.md`

**Ready to go?** → Follow the 7 steps above! 🚀
