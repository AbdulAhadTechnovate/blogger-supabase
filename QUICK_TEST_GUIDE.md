# Quick Testing Guide - Authentication Setup Verification

This is a quick guide to test your Supabase and Makerkit authentication setup. Follow these steps in order.

## Step 1: Start the Development Server

**Run this command from the root directory (`nextjs-saas-starter-kit-lite`):**

```bash
pnpm run dev
```

Wait for the server to start. You should see:
- Server running on `http://localhost:3000`
- No critical errors in the terminal

**If you see errors:**
- Check that all dependencies are installed: `pnpm install`
- Verify `.env.local` exists in `apps/web/` directory
- Check that all required environment variables are set

## Step 2: Verify Environment Variables

Before testing, quickly verify your `.env.local` file in `apps/web/` has these variables set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_AUTH_PASSWORD=true
NEXT_PUBLIC_AUTH_MAGIC_LINK=true
```

**Note:** Make sure there are no quotes around the values and no trailing spaces.

## Step 3: Test Email/Password Authentication

### 3a. Test Sign Up

1. Open browser: `http://localhost:3000`
2. Click "Sign Up" or navigate to `http://localhost:3000/auth/sign-up`
3. Fill in:
   - Email: Use a real email you can access
   - Password: Create a strong password
4. Click "Sign Up"
5. **Expected:** Success message, check email for confirmation
6. Click confirmation link in email
7. **Expected:** Redirected to `/home` and logged in

### 3b. Test Sign In

1. Navigate to `http://localhost:3000/auth/sign-in`
2. Enter the email and password you just used
3. Click "Sign In"
4. **Expected:** Redirected to `/home` and logged in

**✅ Pass if:** You can sign up, confirm email, and sign in successfully.

## Step 4: Test Google OAuth

1. Navigate to `http://localhost:3000/auth/sign-in`
2. Look for "Sign in with Google" button
3. Click it
4. **Expected:** Redirected to Google OAuth consent screen
5. Select your Google account and grant permissions
6. **Expected:** Redirected back to app and logged in at `/home`

**✅ Pass if:** Google OAuth flow completes and you're logged in.

**❌ If it fails:**
- Check Supabase Dashboard → Authentication → Providers → Google is enabled
- Verify callback URL in Supabase: `http://localhost:3000/auth/callback`
- Check Google Cloud Console redirect URIs include: `https://your-project-id.supabase.co/auth/v1/callback`

## Step 5: Test Magic Link (Email OTP / Passwordless)

1. Navigate to `http://localhost:3000/auth/sign-in`
2. Look for "Magic Link" or "Email Link" section (usually below password form)
3. Enter your email address
4. Click "Send Email Link" or similar button
5. **Expected:** Success message saying email was sent
6. Check your email for a magic link
7. Click the magic link in the email
8. **Expected:** Automatically logged in and redirected to `/home`

**✅ Pass if:** You receive the email, click the link, and are logged in without entering a password.

**Note:** This is passwordless authentication. The "magic link" is a form of email OTP. If you need 6-digit codes instead, we can add that feature.

## Step 6: Test Protected Routes

1. **While logged out:**
   - Try to access `http://localhost:3000/home`
   - **Expected:** Redirected to `/auth/sign-in`

2. **While logged in:**
   - Navigate to `http://localhost:3000/home`
   - **Expected:** Can see the dashboard/home page

**✅ Pass if:** Protected routes redirect when logged out and are accessible when logged in.

## Step 7: Test Logout

1. While logged in, look for your profile/avatar in the header (top right)
2. Click on it to open the dropdown menu
3. Click "Sign Out" or "Logout"
4. **Expected:** Logged out and redirected to home or sign-in page
5. Try accessing `/home` again
6. **Expected:** Redirected to sign-in page

**✅ Pass if:** Logout works and you can't access protected routes after logging out.

## Step 8: Verify User in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. **Expected:** You should see the users you created during testing

**✅ Pass if:** Users appear in the Supabase Dashboard.

## Quick Checklist

After completing all tests, verify:

- [ ] Email/Password sign up works
- [ ] Email/Password sign in works
- [ ] Email confirmation works
- [ ] Google OAuth sign in works
- [ ] Magic Link (email OTP) works
- [ ] Protected routes redirect when logged out
- [ ] Protected routes accessible when logged in
- [ ] Logout works
- [ ] Users appear in Supabase Dashboard

## What to Report

After testing, let me know:

1. **Which tests passed?** ✅
2. **Which tests failed?** ❌ (and what error messages you saw)
3. **Any console errors?** (Open browser DevTools → Console tab)
4. **Any terminal errors?** (from the dev server)

## Common Issues

### "Invalid API key"
- Check `.env.local` values are correct
- Restart dev server after changing `.env.local`

### Google OAuth not working
- Verify Google OAuth enabled in Supabase
- Check callback URLs are set correctly

### Magic link email not received
- Check spam folder
- Verify email is configured in Supabase (for production)
- Check `NEXT_PUBLIC_AUTH_MAGIC_LINK=true` in `.env.local`

### "Module not found" errors
- Run `pnpm install` from root directory
- Make sure you're using Node.js 18+ 

## Next Steps

Once all authentication tests pass:
1. ✅ We'll know the setup is correct
2. ✅ We can proceed with building the blog features
3. ✅ We can add any missing features (like 6-digit OTP codes if needed)

---

**Ready to test?** Start with Step 1 and work through each step. Let me know the results!

