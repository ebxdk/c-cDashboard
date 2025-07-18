# Email Verification Web App

This is the web component that handles email verification from Supabase for your mobile app.

## Flow

1. **User signs up** in mobile app
2. **Supabase sends confirmation email** with link to this web app
3. **User clicks email link** → goes to `/welcome` page
4. **Web app verifies email** with Supabase
5. **Web app redirects** to mobile app (`myapp://login`)
6. **User can now log in** in the mobile app

## Deployment to Vercel

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the root directory to `/web`

2. **Set Environment Variables in Vercel**
   - Go to your project settings in Vercel
   - Add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://wzmfprzmogvzgbdqlvyn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bWZwcnptb2d2emdiZHFsdnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDE1MjksImV4cCI6MjA2ODAxNzUyOX0.eNvKT5zEoxksFIiy2Y4iS03MEsArq74dVDfQT0W7MkA
   ```

3. **Update Mobile App Environment**
   - In your mobile app, set:
   ```
   EXPO_PUBLIC_EMAIL_REDIRECT_URL=https://your-app.vercel.app/welcome
   ```
   (Replace `your-app.vercel.app` with your actual Vercel domain)

4. **Update Supabase Settings**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Set Site URL to your Vercel domain (e.g., `https://your-app.vercel.app`)

## Pages

- `/` - Redirects to `/welcome`
- `/welcome` - Email verification page (handles Supabase auth)

## Development

```bash
cd web
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
``` 