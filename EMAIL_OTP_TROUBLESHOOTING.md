# Email OTP Troubleshooting Guide

## Issue: "otp_expired" Error Even with Fresh Code

If you're getting `{"code": "otp_expired", "message": "Token has expired or is invalid"}` even immediately after receiving the code, try these solutions:

## Fixes Applied in Code

The following fixes have been applied to the Email OTP component:

1. ✅ **Email Normalization**: All emails are now converted to lowercase to avoid case sensitivity issues
2. ✅ **Code Formatting**: OTP codes are trimmed and spaces are removed
3. ✅ **Code Validation**: Only numeric codes are accepted (6 digits)
4. ✅ **Better Error Messages**: More detailed error information is now shown

## Additional Troubleshooting Steps

### 1. Check Supabase Email Template Configuration

The email template in Supabase must be configured to show the OTP code correctly.

**Steps:**
1. Go to Supabase Dashboard → **Authentication** → **Email Templates**
2. Find the **Magic Link** template (this is also used for OTP codes)
3. Make sure the template includes: `{{ .Token }}` to display the OTP code
4. The template should look something like:

```html
<h2>Your One-Time Password</h2>
<p>Your verification code is: <strong>{{ .Token }}</strong></p>
<p>This code will expire in 1 hour.</p>
```

**Important**: Make sure the template shows `{{ .Token }}` (the OTP code), not a link.

### 2. Verify OTP Expiration Settings

Check your Supabase OTP expiration settings:

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Look for **OTP Expiry** or **GOTRUE_MAILER_OTP_EXP** setting
3. Default is usually 3600 seconds (1 hour)
4. Make sure it's set to a reasonable value (at least 300 seconds / 5 minutes for testing)

### 3. Check Email Provider Issues

Some email providers (like Outlook) may pre-scan emails and invalidate OTP codes:

**Solution**: 
- Check your email spam folder
- Try with a different email provider (Gmail, etc.)
- Make sure you're copying the code exactly as shown (no extra spaces)

### 4. Verify Email Address Matches Exactly

The email used to send the OTP must match exactly when verifying:

- ✅ The code now normalizes emails to lowercase automatically
- ✅ Make sure you're using the same email address you entered
- ✅ Check for typos in the email address

### 5. Check System Time Synchronization

If your system clock is out of sync, OTP codes may appear expired:

- ✅ Ensure your computer's system time is correct
- ✅ Check timezone settings
- ✅ Sync with internet time if needed

### 6. Test with Fresh Code

1. Request a new OTP code
2. Copy the code immediately from the email
3. Paste it into the OTP input field
4. Verify immediately (within 1-2 minutes)

### 7. Check Supabase Logs

Check Supabase Dashboard → **Logs** → **Auth Logs** for any errors:

1. Look for failed OTP verification attempts
2. Check for any configuration errors
3. Verify that OTP emails are being sent successfully

### 8. Verify Supabase Configuration

Make sure OTP is enabled in Supabase:

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Verify that **Email OTP** or **Magic Link** is enabled
3. Check that email is properly configured (SMTP settings for production)

### 9. Test in Different Browser/Incognito Mode

Sometimes browser cache or extensions can cause issues:

- ✅ Try in incognito/private browsing mode
- ✅ Clear browser cache and cookies
- ✅ Try a different browser

### 10. Check Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_AUTH_EMAIL_OTP=true
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Common Error Patterns

### Error: "otp_expired" immediately
**Possible Causes:**
- Email template not configured correctly
- Code format mismatch
- Email case sensitivity (now fixed)
- System time out of sync

### Error: "Invalid code"
**Possible Causes:**
- Wrong code entered
- Code has extra spaces (now fixed)
- Code expired (wait too long)
- Email mismatch (now fixed)

### Error: "Token has expired or is invalid"
**Possible Causes:**
- OTP expiration time too short
- Email provider pre-scanning
- Code already used
- Email template issue

## Debugging Steps

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for any error messages
   - Check Network tab for API calls

2. **Check Supabase Dashboard:**
   - Go to Authentication → Logs
   - Look for OTP-related errors
   - Check email delivery status

3. **Test Email Delivery:**
   - Verify email is received
   - Check spam folder
   - Verify code format in email
   - Make sure code is 6 digits

4. **Test Code Entry:**
   - Copy code exactly (no spaces)
   - Paste into OTP field
   - Verify it's 6 digits
   - Submit immediately

## Still Not Working?

If none of these solutions work:

1. **Check Supabase Status**: Make sure Supabase services are operational
2. **Review Supabase Documentation**: Check latest OTP implementation guide
3. **Contact Support**: Reach out to Supabase support with:
   - Your project ID
   - Error messages
   - Steps to reproduce
   - Email template configuration

## Code Changes Made

The following improvements were made to fix common issues:

1. **Email Normalization**:
   ```typescript
   const normalizedEmail = emailValue.toLowerCase().trim();
   ```

2. **Code Formatting**:
   ```typescript
   const normalizedCode = code.trim().replace(/\s/g, '');
   ```

3. **Code Validation**:
   ```typescript
   code: z.string()
     .regex(/^\d+$/, 'Code must contain only numbers')
     .transform((val) => val.trim().replace(/\s/g, ''))
   ```

4. **Resend Functionality**: Added ability to resend OTP code

5. **Better Error Messages**: More detailed error information

## Next Steps

After applying these fixes:

1. ✅ Restart your dev server
2. ✅ Clear browser cache
3. ✅ Test with a fresh OTP code
4. ✅ Check Supabase email template configuration
5. ✅ Verify OTP expiration settings

If the issue persists, the problem is likely in Supabase configuration (email template or OTP settings) rather than the code.

