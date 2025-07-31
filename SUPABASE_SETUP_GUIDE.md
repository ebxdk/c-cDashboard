# 🚀 Complete Supabase Setup Guide

## 📋 Step-by-Step Instructions

### **Step 1: Create Your Supabase Account**

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with your email** (the one you want to use for management)
4. **Create a new organization** (give it a name like "My App Organization")

### **Step 2: Create a New Project**

1. **Click "New Project"**
2. **Choose your organization**
3. **Fill in project details:**
   - **Name**: `Minara App` (or your app name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. **Click "Create new project"**

### **Step 3: Get Your Project Credentials**

Once your project is created:

1. **Go to Settings → API**
2. **Copy these values:**
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### **Step 4: Set Up Environment Variables**

1. **Copy the `env.template` file to `.env`:**
   ```bash
   cp env.template .env
   ```

2. **Edit `.env` and replace the placeholder values:**
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

### **Step 5: Set Up Database Schema**

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Copy the entire contents of `supabase-chat-setup.sql`**
4. **Paste it into the SQL Editor**
5. **Click "Run" to execute all commands**

### **Step 6: Enable Real-time Features**

1. **Go to Database → Replication**
2. **Enable real-time for these tables:**
   - ✅ `chat_messages`
   - ✅ `chat_participants`
   - ✅ `chat_rooms`
   - ✅ `message_reactions`
   - ✅ `chat_notifications`

### **Step 7: Configure Authentication**

1. **Go to Authentication → Settings**
2. **Enable Email Auth** (if not already enabled)
3. **Configure OAuth providers** (Google, Apple) if needed

### **Step 8: Set Up Row Level Security (RLS)**

The SQL setup automatically creates RLS policies, but verify they're enabled:

1. **Go to Authentication → Policies**
2. **Check that RLS is enabled** on all chat tables
3. **Verify policies exist** for:
   - User profile access
   - Room participation
   - Message sending/receiving
   - AI session privacy

### **Step 9: Test Your Setup**

1. **Run your app locally**
2. **Try to sign up a new user**
3. **Check that data appears in your Supabase tables**

## 🔧 Troubleshooting

### **Common Issues:**

1. **"Invalid API key" error:**
   - Double-check your anon key in `.env`
   - Make sure there are no extra spaces

2. **"Table doesn't exist" error:**
   - Make sure you ran the SQL setup script
   - Check that all tables were created in Table Editor

3. **Authentication not working:**
   - Verify email auth is enabled in Supabase
   - Check your redirect URLs are correct

### **Getting Help:**

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Supabase Discord**: [discord.gg/supabase](https://discord.gg/supabase)
- **Check your project logs** in Supabase Dashboard → Logs

## 📊 Monitoring Your App

### **Key Metrics to Watch:**

1. **Database Performance** (Dashboard → Database)
2. **Authentication Logs** (Dashboard → Authentication → Logs)
3. **API Usage** (Dashboard → Settings → Usage)
4. **Real-time Connections** (Dashboard → Database → Replication)

### **Important URLs:**

- **Dashboard**: `https://supabase.com/dashboard/project/[your-project-id]`
- **API Docs**: `https://supabase.com/docs/reference/javascript`
- **SQL Editor**: Available in your dashboard

## 🔐 Security Best Practices

1. **Never commit `.env` files** (already in `.gitignore`)
2. **Use Row Level Security (RLS)** for all tables
3. **Regularly rotate API keys** if needed
4. **Monitor for unusual activity** in logs
5. **Set up proper CORS policies** for web apps

## 💰 Cost Management

- **Free tier**: 500MB database, 2GB bandwidth, 50MB file storage
- **Monitor usage** in Dashboard → Settings → Usage
- **Upgrade when needed** for more resources

## 🚀 Next Steps

After setup is complete:

1. **Test all features** (chat, auth, file uploads)
2. **Set up monitoring** and alerts
3. **Configure backup strategies**
4. **Plan for scaling** as your app grows

---

**Need help?** Check the Supabase documentation or ask in their Discord community! 