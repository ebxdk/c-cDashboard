# ⚡ Quick Supabase Setup

## 🎯 Essential Steps (5 minutes)

### 1. **Create Account & Project**
- Go to [supabase.com](https://supabase.com)
- Sign up with your email
- Create new project named "Minara App"

### 2. **Get Credentials**
- Go to **Settings → API**
- Copy **Project URL** and **Anon Key**

### 3. **Update Environment**
```bash
cp env.template .env
```
Edit `.env` with your new credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. **Set Up Database**
- Go to **SQL Editor**
- Copy/paste entire `supabase-chat-setup.sql`
- Click **Run**

### 5. **Enable Real-time**
- Go to **Database → Replication**
- Enable real-time for: `chat_messages`, `chat_participants`, `chat_rooms`

### 6. **Test**
- Run your app
- Try signing up a user
- Check data appears in Supabase tables

## 🔑 Key URLs
- **Dashboard**: `https://supabase.com/dashboard`
- **SQL Editor**: Available in dashboard
- **Table Editor**: Available in dashboard

## 🆘 Need Help?
- Check `SUPABASE_SETUP_GUIDE.md` for detailed instructions
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Discord: [discord.gg/supabase](https://discord.gg/supabase) 