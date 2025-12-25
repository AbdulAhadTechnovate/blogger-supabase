# Setup Guide: Connecting Supabase with Makerkit

This guide will help you connect your existing Supabase project with the Makerkit starter kit and get it running locally.

## Prerequisites

✅ You have already:
- Created a Supabase project
- Connected Google OAuth Client ID to Supabase
- Cloned the Makerkit lite repo

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. You'll need the following values:
   - **Project URL** - This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** - This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** - This is your `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Step 2: Configure Environment Variables

A `.env.local` file has been created in `apps/web/`. You need to update it with your Supabase credentials:

1. Open `apps/web/.env.local`
2. Replace the placeholder values:
   - `your_supabase_project_url_here` → Your Supabase Project URL
   - `your_supabase_anon_key_here` → Your Supabase anon key
   - `your_supabase_service_role_key_here` → Your Supabase service role key

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Configure Supabase Callback URL

For OAuth (Google) to work, you need to set the callback URL in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add the following to **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - (For production, add your production URL: `https://yourdomain.com/auth/callback`)

## Step 4: Verify Google OAuth Setup

Since you mentioned you've already connected Google OAuth:

1. Go to **Authentication** → **Providers** → **Google**
2. Verify that:
   - Google provider is **Enabled**
   - Your **Client ID** and **Client Secret** are configured
   - The **Authorized redirect URIs** in your Google Cloud Console includes:
     - `https://your-project-id.supabase.co/auth/v1/callback`

## Step 5: Install Dependencies (if not already done)

From the root directory (`nextjs-saas-starter-kit-lite`):

```bash
pnpm install
```

## Step 6: Link Your Supabase Project (Optional but Recommended)

If you want to use Supabase CLI to manage your database:

```bash
cd apps/web
pnpm supabase link --project-ref your-project-ref
```

You can find your project ref in the Supabase Dashboard URL or in Settings → General.

**Note:** Since you're using a remote Supabase project (not local), you can skip the local Supabase setup commands.

## Step 7: Run the Development Server

From the root directory:

```bash
pnpm run dev
```

The application will be available at **http://localhost:3000**

## Step 8: Test Authentication

1. Navigate to `http://localhost:3000`
2. Click on **Sign In** or **Sign Up**
3. Try:
   - Email/Password authentication (if enabled)
   - Google OAuth (click the Google button)

## Troubleshooting

### Issue: "Invalid API key" or connection errors
- ✅ Double-check your `.env.local` file has the correct values
- ✅ Make sure there are no extra spaces or quotes around the values
- ✅ Restart the dev server after changing `.env.local`

### Issue: Google OAuth not working
- ✅ Verify Google OAuth is enabled in Supabase Dashboard
- ✅ Check that the callback URL is set correctly in Supabase
- ✅ Verify your Google OAuth credentials are correct in Supabase

### Issue: "Module not found" errors
- ✅ Run `pnpm install` from the root directory
- ✅ Make sure you're using Node.js 18.x or later

### Issue: Port already in use
- ✅ Make sure port 3000 is available
- ✅ Or change `NEXT_PUBLIC_SITE_URL` in `.env.local` to match a different port

## Next Steps

Once you have the app running successfully:

1. ✅ Verify authentication works (email/password and Google OAuth)
2. ✅ Check that you can access protected routes (like `/home`)
3. ✅ Then we can proceed with building the blog features

## Important Notes

- **Never commit `.env.local`** - It contains sensitive keys
- The `SUPABASE_SERVICE_ROLE_KEY` should **never** be exposed in client-side code
- For production, update `NEXT_PUBLIC_SITE_URL` to your production domain
- Make sure to add production callback URLs in Supabase before deploying

## Need Help?

If you encounter any issues:
1. Check the terminal output for error messages
2. Verify all environment variables are set correctly
3. Make sure your Supabase project is active and accessible

