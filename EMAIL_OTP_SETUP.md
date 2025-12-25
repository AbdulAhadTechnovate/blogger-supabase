# Email OTP (6-Digit Code) Authentication Setup

## Overview

Email OTP (One-Time Password) authentication has been added to your application. This allows users to sign in using a 6-digit code sent to their email instead of a password or magic link.

## What Was Added

1. **New Component**: `EmailOtpAuthContainer` - Handles the email OTP flow
2. **Configuration**: Added `emailOtp` option to auth config
3. **Translations**: Added all necessary translation keys
4. **Integration**: Added to both sign-in and sign-up pages

## How It Works

1. User enters their email address
2. System sends a 6-digit code to their email
3. User enters the code in the OTP input field
4. Code is verified and user is signed in

## Enabling Email OTP

To enable Email OTP authentication, add this to your `.env.local` file:

```env
NEXT_PUBLIC_AUTH_EMAIL_OTP=true
```

**Note**: You can have both Magic Link and Email OTP enabled at the same time. Users will see both options on the sign-in/sign-up pages.

## Configuration Options

In `apps/web/.env.local`:

```env
# Enable Email OTP (6-digit code)
NEXT_PUBLIC_AUTH_EMAIL_OTP=true

# Enable Magic Link (email link) - optional, can be used alongside OTP
NEXT_PUBLIC_AUTH_MAGIC_LINK=true

# Enable Password authentication - optional
NEXT_PUBLIC_AUTH_PASSWORD=true
```

## Supabase Configuration

### Email Template Setup

For Email OTP to work properly, you may want to customize the email template in Supabase:

1. Go to Supabase Dashboard → **Authentication** → **Email Templates**
2. Find the **Magic Link** template (this is also used for OTP codes)
3. You can customize it to show the OTP code clearly

**Default Template Variables:**
- `{{ .Token }}` - The 6-digit OTP code
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address

### Example Email Template

```html
<h2>Your One-Time Password</h2>
<p>Your verification code is: <strong>{{ .Token }}</strong></p>
<p>This code will expire in 1 hour.</p>
<p>If you didn't request this code, please ignore this email.</p>
```

## Testing Email OTP

1. **Enable the feature:**
   ```env
   NEXT_PUBLIC_AUTH_EMAIL_OTP=true
   ```

2. **Restart your dev server:**
   ```bash
   pnpm run dev
   ```

3. **Test the flow:**
   - Navigate to `/auth/sign-in`
   - Look for the Email OTP section
   - Enter your email
   - Click "Send Code to Email"
   - Check your email for the 6-digit code
   - Enter the code in the OTP input field
   - Click "Verify Code"
   - You should be signed in

## Differences: Magic Link vs Email OTP

| Feature | Magic Link | Email OTP |
|---------|-----------|----------|
| **User Experience** | Click link in email | Enter 6-digit code |
| **Security** | Link-based | Code-based |
| **Mobile Friendly** | Yes (opens app) | Yes (copy-paste code) |
| **Email Template** | Uses link | Uses code |
| **Configuration** | `NEXT_PUBLIC_AUTH_MAGIC_LINK=true` | `NEXT_PUBLIC_AUTH_EMAIL_OTP=true` |

## Troubleshooting

### Issue: OTP code not received

**Solutions:**
- Check spam folder
- Verify email is configured in Supabase (SMTP settings for production)
- Check Supabase Dashboard → Authentication → Email Templates
- Verify `NEXT_PUBLIC_AUTH_EMAIL_OTP=true` in `.env.local`
- Restart dev server after changing `.env.local`

### Issue: "Invalid code" error

**Solutions:**
- Make sure you're entering the code from the most recent email
- Codes expire after 1 hour (default Supabase setting)
- Check that you're using the correct email address
- Try requesting a new code

### Issue: Email OTP option not showing

**Solutions:**
- Verify `NEXT_PUBLIC_AUTH_EMAIL_OTP=true` in `.env.local`
- Restart dev server
- Clear browser cache
- Check browser console for errors

## Code Structure

### Component Location
```
packages/features/auth/src/components/email-otp-auth-container.tsx
```

### Key Files Modified
- `apps/web/config/auth.config.ts` - Added emailOtp config
- `packages/features/auth/src/components/sign-in-methods-container.tsx` - Added Email OTP option
- `packages/features/auth/src/components/sign-up-methods-container.tsx` - Added Email OTP option
- `apps/web/public/locales/en/auth.json` - Added translations

## Next Steps

1. ✅ Enable `NEXT_PUBLIC_AUTH_EMAIL_OTP=true` in `.env.local`
2. ✅ Restart your dev server
3. ✅ Test the email OTP flow
4. ✅ Customize email template in Supabase (optional)
5. ✅ Test on both sign-in and sign-up pages

## Notes

- Email OTP and Magic Link can be used together - users will see both options
- The OTP code expires after 1 hour (Supabase default)
- Users can request a new code by using a different email or refreshing the page
- The component automatically handles errors and shows appropriate messages

