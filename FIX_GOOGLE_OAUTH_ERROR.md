# Fix: Google OAuth "Provider is not enabled" Error

## Error Message
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

## Solution: Enable Google OAuth in Supabase Dashboard

This error means Google OAuth is configured in your code but **not enabled** in your Supabase project settings.

### Step-by-Step Fix

#### Step 1: Enable Google Provider in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers** (left sidebar)
4. Scroll down or search for **Google** in the providers list
5. Click on **Google** to open its configuration
6. **IMPORTANT:** Toggle the **"Enable Google provider"** switch to **ON** (green/enabled)
7. Fill in the required fields:
   - **Client ID (for OAuth)**: Your Google OAuth Client ID
   - **Client Secret (for OAuth)**: Your Google OAuth Client Secret
8. Click **Save** at the bottom

**Visual Guide:**
```
Supabase Dashboard
  └─ Authentication
      └─ Providers
          └─ Google
              ├─ [✓] Enable Google provider  ← TURN THIS ON!
              ├─ Client ID (for OAuth): [your-client-id]
              ├─ Client Secret (for OAuth): [your-client-secret]
              └─ [Save] button
```

#### Step 2: Verify Google Cloud Console Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (the one you're using with Supabase)
5. Click on it to edit
6. Under **Authorized redirect URIs**, verify you have:
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   ```
   - Replace `YOUR-PROJECT-ID` with your actual Supabase project ID
   - You can find your project ID in Supabase Dashboard → Settings → General → Reference ID
7. If the URI is missing, click **+ ADD URI** and add it
8. Click **Save**

**Example:**
If your Supabase project URL is `https://abcdefghijklmnop.supabase.co`, then your redirect URI should be:
```
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

#### Step 3: Verify Supabase Redirect URLs

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, verify you have:
   ```
   http://localhost:3000/auth/callback
   ```
3. If missing, click **Add URL** and add it
4. Click **Save**

#### Step 4: Test Again

1. Wait 10-15 seconds for changes to propagate
2. Refresh your browser (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
3. Navigate to `http://localhost:3000/auth/sign-in`
4. Click "Sign in with Google"
5. It should now work!

## Quick Checklist

Before testing, verify:

- [ ] Google provider is **enabled** in Supabase Dashboard (toggle is ON)
- [ ] Google Client ID is filled in Supabase
- [ ] Google Client Secret is filled in Supabase
- [ ] Google Cloud Console has redirect URI: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
- [ ] Supabase has redirect URL: `http://localhost:3000/auth/callback`
- [ ] All changes are saved
- [ ] Waited a few seconds after saving
- [ ] Browser page is refreshed

## Still Not Working?

### Check 1: Verify Your Google OAuth Credentials

1. In Supabase Dashboard → Authentication → Providers → Google
2. Verify the Client ID and Secret are correct:
   - No extra spaces before/after
   - No quotes around the values
   - Copy-paste directly from Google Cloud Console

### Check 2: Verify Project ID

1. In Supabase Dashboard → Settings → General
2. Find your **Reference ID** (this is your project ID)
3. Make sure the redirect URI in Google Cloud Console uses this exact ID

### Check 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try Google OAuth sign-in again
4. Look for any additional error messages
5. Share the error message if different from the original

### Check 4: Verify Environment Variables

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Common Mistakes

❌ **Mistake:** Only added Client ID/Secret but didn't toggle "Enable" switch
✅ **Fix:** Toggle the "Enable Google provider" switch to ON

❌ **Mistake:** Wrong redirect URI format in Google Cloud Console
✅ **Fix:** Must be exactly: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`

❌ **Mistake:** Using wrong project ID in redirect URI
✅ **Fix:** Use the Reference ID from Supabase Settings → General

❌ **Mistake:** Not waiting for changes to propagate
✅ **Fix:** Wait 10-15 seconds after saving, then refresh browser

## Need Help?

If you've followed all steps and it's still not working:

1. Double-check the **"Enable Google provider"** toggle is ON (green)
2. Verify you're using the correct Supabase project (not a different one)
3. Check that your Google OAuth credentials are active and not revoked
4. Try clearing browser cache and cookies
5. Check Supabase Dashboard → Authentication → Logs for any errors

---

**After fixing, test again using the steps in `TESTING_CHECKLIST.md` Test 2.1**

