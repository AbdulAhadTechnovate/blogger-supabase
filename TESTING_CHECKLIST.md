# Authentication Testing Checklist

This document will help you test all authentication methods to verify your Supabase and Makerkit setup is working correctly.

## Prerequisites

Before testing, ensure:
- ✅ Development server is running
- ✅ `.env.local` file is configured with all Supabase credentials
- ✅ Google OAuth is configured in Supabase Dashboard
- ✅ Callback URLs are set in Supabase Dashboard

## Test 1: Email/Password Authentication

### Test 1.1: Sign Up with Email/Password

**Steps:**
1. Navigate to `http://localhost:3000/auth/sign-up`
2. Fill in the form with:
   - Email: `test@example.com` (use a real email you can access)
   - Password: `TestPassword123!`
3. Click "Sign Up"
4. Check your email for a confirmation link
5. Click the confirmation link in the email
6. You should be redirected to the home page (`/home`)

**Expected Results:**
- ✅ Sign up form appears
- ✅ Form validation works (try submitting empty form)
- ✅ Success message appears after sign up
- ✅ Confirmation email is received
- ✅ Clicking confirmation link logs you in
- ✅ You are redirected to `/home` page
- ✅ You can see your profile/logged-in state

**If it fails:**
- Check browser console for errors
- Verify `NEXT_PUBLIC_AUTH_PASSWORD=true` in `.env.local`
- Check Supabase Dashboard → Authentication → Users to see if user was created
- Check Supabase Dashboard → Authentication → Email Templates

### Test 1.2: Sign In with Email/Password

**Steps:**
1. Navigate to `http://localhost:3000/auth/sign-in`
2. Fill in the form with:
   - Email: `test@example.com` (the email you used to sign up)
   - Password: `TestPassword123!`
3. Click "Sign In"
4. You should be redirected to `/home`

**Expected Results:**
- ✅ Sign in form appears
- ✅ Form validation works
- ✅ Successful login redirects to `/home`
- ✅ You remain logged in after page refresh
- ✅ You can access protected routes

**If it fails:**
- Check browser console for errors
- Verify credentials are correct
- Check Supabase Dashboard → Authentication → Users to verify user exists
- Try resetting password if needed

### Test 1.3: Sign Out

**Steps:**
1. While logged in, find the logout button (usually in profile dropdown or header)
2. Click "Sign Out" or "Logout"
3. You should be redirected to the home page or sign-in page

**Expected Results:**
- ✅ Logout button is visible when logged in
- ✅ Clicking logout signs you out
- ✅ You are redirected appropriately
- ✅ You cannot access protected routes after logout

## Test 2: Google OAuth Authentication

### Test 2.1: Sign In with Google

**Steps:**
1. Navigate to `http://localhost:3000/auth/sign-in`
2. Look for a "Sign in with Google" button
3. Click the Google button
4. You should be redirected to Google's OAuth consent screen
5. Select your Google account
6. Grant permissions
7. You should be redirected back to your app and logged in

**Expected Results:**
- ✅ "Sign in with Google" button appears on sign-in page
- ✅ Clicking it redirects to Google OAuth
- ✅ Google OAuth consent screen appears
- ✅ After granting permission, you're redirected back
- ✅ You are logged in and redirected to `/home`
- ✅ Your Google account info is associated with your account

**If it fails:**
- Check browser console for errors
- Verify Google OAuth is enabled in Supabase Dashboard
- Verify callback URL is set: `http://localhost:3000/auth/callback`
- Check Google Cloud Console → OAuth 2.0 Client IDs → Authorized redirect URIs includes: `https://your-project-id.supabase.co/auth/v1/callback`
- Verify Google Client ID and Secret are correct in Supabase Dashboard

### Test 2.2: Sign Up with Google (New User)

**Steps:**
1. Navigate to `http://localhost:3000/auth/sign-up`
2. Click "Sign in with Google"
3. Use a Google account that hasn't been used with this app before
4. Complete OAuth flow
5. You should be automatically signed up and logged in

**Expected Results:**
- ✅ New user is created automatically
- ✅ User is logged in immediately
- ✅ User is redirected to `/home`
- ✅ User appears in Supabase Dashboard → Authentication → Users

## Test 3: Email OTP / Magic Link (Passwordless)

### Test 3.1: Sign In with Magic Link

**Steps:**
1. Navigate to `http://localhost:3000/auth/sign-in`
2. Look for a "Magic Link" or "Email Link" section
3. Enter your email address: `test@example.com`
4. Click "Send Email Link" or similar button
5. Check your email for a magic link
6. Click the magic link in the email
7. You should be automatically signed in

**Expected Results:**
- ✅ Magic link form appears on sign-in page
- ✅ Email validation works
- ✅ Success message appears after clicking "Send Email Link"
- ✅ Email with magic link is received
- ✅ Clicking the magic link in email logs you in
- ✅ You are redirected to `/home`
- ✅ No password is required (passwordless)

**If it fails:**
- Check browser console for errors
- Verify `NEXT_PUBLIC_AUTH_MAGIC_LINK=true` in `.env.local`
- Check Supabase Dashboard → Authentication → Email Templates → Magic Link
- Check your email spam folder
- Verify email is configured in Supabase (for production, you need SMTP; for local dev, check Inbucket if using local Supabase)

### Test 3.2: Sign Up with Magic Link (New User)

**Steps:**
1. Navigate to `http://localhost:3000/auth/sign-up`
2. Look for the Magic Link section
3. Enter a new email address: `newuser@example.com`
4. Click "Send Email Link"
5. Check your email for the magic link
6. Click the magic link
7. New user should be created and logged in

**Expected Results:**
- ✅ New user is created automatically
- ✅ User is logged in immediately
- ✅ User is redirected to `/home`
- ✅ User appears in Supabase Dashboard → Authentication → Users

## Test 4: Protected Routes

### Test 4.1: Access Protected Routes While Logged Out

**Steps:**
1. Make sure you're logged out
2. Try to navigate to `http://localhost:3000/home`
3. You should be redirected to sign-in page

**Expected Results:**
- ✅ Redirected to `/auth/sign-in`
- ✅ Cannot access protected content
- ✅ After signing in, you're redirected back to `/home`

### Test 4.2: Access Protected Routes While Logged In

**Steps:**
1. Sign in using any method
2. Navigate to `http://localhost:3000/home`
3. You should see the protected content

**Expected Results:**
- ✅ Can access `/home` page
- ✅ Can see user-specific content
- ✅ Profile/settings are accessible

## Test 5: Session Management

### Test 5.1: Session Persistence

**Steps:**
1. Sign in using any method
2. Close the browser tab
3. Open a new tab and navigate to `http://localhost:3000`
4. Navigate to `/home`

**Expected Results:**
- ✅ You remain logged in
- ✅ Session persists across browser tabs
- ✅ Can access protected routes without re-authenticating

### Test 5.2: Session Expiration

**Steps:**
1. Sign in
2. Wait for session to expire (or manually clear cookies)
3. Try to access a protected route

**Expected Results:**
- ✅ After session expires, you're redirected to sign-in
- ✅ Error handling is graceful
- ✅ User can sign in again

## Common Issues and Solutions

### Issue: "Invalid API key" error
**Solution:**
- Double-check `.env.local` file
- Ensure no extra spaces or quotes
- Restart dev server after changing `.env.local`

### Issue: Google OAuth redirects to error page
**Solution:**
- Verify callback URL in Supabase: `http://localhost:3000/auth/callback`
- Check Google Cloud Console redirect URIs
- Ensure Google OAuth is enabled in Supabase Dashboard

### Issue: Magic link email not received
**Solution:**
- Check spam folder
- Verify email is configured in Supabase (SMTP settings for production)
- For local development, check if using local Supabase (Inbucket)
- Verify `NEXT_PUBLIC_AUTH_MAGIC_LINK=true` in `.env.local`

### Issue: "User already registered" error
**Solution:**
- User exists but email not confirmed - check Supabase Dashboard
- Try password reset if needed
- Or use a different email for testing

## Testing Commands

To start the development server, run from the root directory:
```bash
pnpm run dev
```

To check Supabase connection (if using Supabase CLI):
```bash
cd apps/web
pnpm supabase status
```

## Next Steps After Testing

Once all tests pass:
1. ✅ Document any issues found
2. ✅ Verify all three auth methods work (Email/Password, Google OAuth, Magic Link)
3. ✅ Confirm protected routes work correctly
4. ✅ Then proceed with building blog features

## Notes

- **Magic Link vs OTP Code**: The current implementation uses "magic link" (email link) which is a form of passwordless authentication. If you need 6-digit OTP codes instead, we'll need to add a code input component.
- **Email Configuration**: For production, you'll need to configure SMTP in Supabase. For local development, emails may be captured by Inbucket if using local Supabase.
- **Environment Variables**: Make sure all required env variables are set in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_AUTH_PASSWORD=true`
  - `NEXT_PUBLIC_AUTH_MAGIC_LINK=true`

