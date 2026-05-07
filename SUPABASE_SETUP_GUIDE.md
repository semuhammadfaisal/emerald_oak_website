# 🚀 SUPABASE SETUP GUIDE - Emerald OAK

## Complete step-by-step guide to setup Supabase for your admin panel

---

## 📋 WHAT YOU'LL NEED

- Supabase account (free)
- 10-15 minutes
- Your Vercel deployed website URL

---

## STEP 1: CREATE SUPABASE PROJECT

### 1.1 Sign Up for Supabase
1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email

### 1.2 Create New Project
1. Click "New Project"
2. Fill in details:
   - **Name**: `emerald-oak-db` (or any name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (perfect for starting)
3. Click "Create new project"
4. Wait 2-3 minutes for setup

---

## STEP 2: GET YOUR CREDENTIALS

### 2.1 Find Your API Keys
1. In your Supabase project dashboard
2. Click "Settings" (gear icon) in left sidebar
3. Click "API" under Project Settings
4. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

### 2.2 Copy These Values
Keep these ready - you'll need them soon!

---

## STEP 3: CREATE DATABASE TABLES

### 3.1 Open SQL Editor
1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New query"

### 3.2 Run the Schema
1. Open the file: `database_schema.sql` (in your project root)
2. Copy ALL the SQL code
3. Paste into Supabase SQL Editor
4. Click "Run" (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

### 3.3 Verify Tables Created
1. Click "Table Editor" in left sidebar
2. You should see 3 tables:
   - ✅ properties
   - ✅ projects
   - ✅ inquiries

---

## STEP 4: CREATE STORAGE BUCKET (For Images)

### 4.1 Create Bucket
1. Click "Storage" in left sidebar
2. Click "New bucket"
3. Name: `property-images`
4. Set to **Public** (toggle on)
5. Click "Create bucket"

### 4.2 Set Bucket Policies
1. Click on `property-images` bucket
2. Click "Policies" tab
3. Click "New policy"
4. Select "Allow public read access"
5. Click "Review" then "Save policy"

---

## STEP 5: CREATE ADMIN USER

### 5.1 Enable Email Authentication
1. Click "Authentication" in left sidebar
2. Click "Providers"
3. Make sure "Email" is enabled (should be by default)

### 5.2 Create Admin User
1. Click "Users" under Authentication
2. Click "Add user" → "Create new user"
3. Fill in:
   - **Email**: `admin@emeraldoak.com` (or your email)
   - **Password**: Create a strong password (SAVE THIS!)
   - **Auto Confirm User**: Toggle ON
4. Click "Create user"

**IMPORTANT**: Save these credentials - you'll use them to login!

---

## STEP 6: CONFIGURE YOUR WEBSITE

### 6.1 Update Supabase Config
1. Open file: `config/supabase.js`
2. Replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://xxxxx.supabase.co', // Your Project URL from Step 2
  anonKey: 'eyJhbGc...' // Your anon public key from Step 2
};
```

### 6.2 Save and Deploy
1. Save the file
2. Commit changes to Git:
   ```bash
   git add .
   git commit -m "Add Supabase configuration"
   git push
   ```
3. Vercel will auto-deploy (takes 1-2 minutes)

---

## STEP 7: TEST YOUR ADMIN PANEL

### 7.1 Login to Admin
1. Go to: `https://your-site.vercel.app/admin/login.html`
2. Enter the admin credentials from Step 5:
   - **Email**: admin@emeraldoak.com
   - **Password**: (your password)
3. Click "Login"

### 7.2 Test Features
✅ **Dashboard**: Should load with 0 stats  
✅ **Add Property**: Try adding a test property  
✅ **Add Project**: Try adding a test project  
✅ **Contact Form**: Fill form on website, check inquiries in admin  

---

## STEP 8: TEST CONTACT FORM

### 8.1 Submit Test Inquiry
1. Go to your website contact page
2. Fill in the contact form
3. Submit

### 8.2 Verify in Admin
1. Login to admin panel
2. Go to "Inquiries"
3. You should see your test inquiry!

---

## 🎉 SETUP COMPLETE!

Your admin panel is now fully connected to Supabase!

---

## 📊 WHAT YOU NOW HAVE

✅ **Secure Authentication**: Real login system  
✅ **Cloud Database**: PostgreSQL database  
✅ **Image Storage**: Upload property images  
✅ **Real-time Data**: Instant updates  
✅ **Scalable**: Handles growth automatically  
✅ **Free Tier**: 500MB database, 1GB storage  

---

## 🔐 SECURITY BEST PRACTICES

### Row Level Security (RLS)
Already configured in the schema:
- ✅ Public can view available properties
- ✅ Public can submit contact forms
- ✅ Only authenticated users can manage data

### Environment Variables (Optional - Advanced)
For extra security, use Vercel environment variables:

1. In Vercel dashboard → Your project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
3. Update `config/supabase.js` to use these

---

## 📸 UPLOADING IMAGES

### Option 1: Direct Upload (Recommended)
1. In admin panel, when adding property
2. Upload image to Supabase Storage:
   - Go to Supabase → Storage → property-images
   - Click "Upload file"
   - Upload your image
   - Copy the public URL
   - Paste in "Image URL" field

### Option 2: External URLs
Just paste any image URL (from Unsplash, etc.)

### Option 3: Add Upload Widget (Future Enhancement)
We can add direct upload from admin panel later!

---

## 🔄 MANAGING DATA

### View Data in Supabase
1. Go to Supabase → Table Editor
2. Click on any table (properties, projects, inquiries)
3. View, edit, or delete records directly

### Export Data
1. In admin panel → Settings
2. Click "Export All Data"
3. Downloads JSON file with all data

### Backup Database
Supabase automatically backs up your data daily!

---

## 📈 MONITORING

### Check Usage
1. Supabase Dashboard → Home
2. View:
   - Database size
   - API requests
   - Storage used
   - Active users

### Free Tier Limits
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users
- Unlimited API requests

**More than enough for most real estate businesses!**

---

## 🆘 TROUBLESHOOTING

### "Invalid API key" Error
- Check `config/supabase.js` has correct URL and key
- Make sure you copied the **anon public** key, not service key

### "Row Level Security" Error
- Run the complete `database_schema.sql` again
- Make sure RLS policies were created

### Can't Login to Admin
- Verify user was created in Supabase → Authentication → Users
- Make sure "Auto Confirm User" was enabled
- Try resetting password in Supabase dashboard

### Contact Form Not Saving
- Check browser console for errors
- Verify Supabase config is correct
- Check inquiries table exists in Supabase

### Images Not Showing
- Make sure `property-images` bucket is set to **Public**
- Check bucket policies allow public read access
- Verify image URL is correct

---

## 🎯 NEXT STEPS

### 1. Add More Admin Users
1. Supabase → Authentication → Users
2. Click "Add user"
3. Create new user with email/password

### 2. Customize Email Templates
1. Supabase → Authentication → Email Templates
2. Customize confirmation, reset password emails

### 3. Add More Features
- Image upload widget in admin
- Email notifications for new inquiries
- Property search on website
- Featured properties section

### 4. Monitor Performance
- Check Supabase dashboard regularly
- Monitor database size
- Review API usage

---

## 📞 SUPPORT RESOURCES

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **SQL Reference**: https://supabase.com/docs/guides/database

---

## ✅ QUICK CHECKLIST

Before going live, verify:

- [ ] Supabase project created
- [ ] Database tables created (properties, projects, inquiries)
- [ ] Storage bucket created (property-images)
- [ ] Admin user created
- [ ] Config file updated with real credentials
- [ ] Changes pushed to Vercel
- [ ] Can login to admin panel
- [ ] Can add/edit/delete properties
- [ ] Can add/edit/delete projects
- [ ] Contact form saves to inquiries
- [ ] Can view inquiries in admin

---

## 🎊 CONGRATULATIONS!

Your Emerald OAK admin panel is now powered by Supabase!

You have a professional, scalable, cloud-based property management system.

**Admin Login**: `https://your-site.vercel.app/admin/login.html`

---

**Need Help?** Check the troubleshooting section or Supabase documentation.

**Ready to Launch?** Start adding your real properties and projects!

---

Built with ❤️ for Emerald OAK Real Estate & Builders
