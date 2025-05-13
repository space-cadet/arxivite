# Supabase + Google OAuth Authentication Setup Guide
*Last Updated: 2025-05-13*

## Overview
This guide documents the setup process for implementing Supabase authentication with Google OAuth in Arxivite.

## Prerequisites
- Vercel account
- Google Cloud Console account
- Supabase account

## Step 1: Supabase Project Setup

1. Create new Supabase project
2. Note down credentials:
   ```
   Project URL: https://sjnljdguvxafjdfuvykw.supabase.co
   Anon Key: [your-anon-key]
   ```

3. Configure Authentication Settings in Supabase:
   - Go to Authentication > URL Configuration
   - Set Site URL: `https://arxivite.vercel.app`
   - Add Redirect URLs: `https://arxivite.vercel.app/auth-test`

## Step 2: Google OAuth Setup

1. Go to Google Cloud Console
2. Create new project or select existing
3. Enable Google+ API
4. Configure OAuth consent screen
5. Create OAuth credentials:
   - Type: Web application
   - Name: Arxivite
   
6. Add authorized origins:
   ```
   http://localhost:5173
   https://arxivite.vercel.app
   ```

7. Add authorized redirect URIs:
   ```
   https://sjnljdguvxafjdfuvykw.supabase.co/auth/v1/callback
   ```

8. Save credentials:
   ```
   Client ID: [your-client-id]
   Client Secret: [your-client-secret]
   ```

## Step 3: Supabase Provider Configuration

1. In Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add Client ID and Client Secret from Google
   - Save changes

## Step 4: Project Implementation

1. Install dependencies:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Environment Variables:
   ```env
   # .env.local
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Create Supabase Client (`src/lib/supabase.ts`):
   ```typescript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   if (!supabaseUrl || !supabaseAnonKey) {
     throw new Error('Missing Supabase environment variables');
   }

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

4. Create Auth Test Page (`src/pages/auth-test.tsx`):
   ```typescript
   // See complete implementation in source code
   // Key OAuth configuration:
   const handleSocialSignIn = async (provider: 'google' | 'github') => {
     const { error } = await supabase.auth.signInWithOAuth({
       provider,
       options: {
         redirectTo: 'https://arxivite.vercel.app/auth-test'
       }
     });
   };
   ```

## Step 5: Vercel Deployment

1. Add environment variables in Vercel:
   ```
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Deploy to Vercel:
   - Project is configured to deploy to: `arxivite.vercel.app`
   - Ensure build settings use Vite configuration

## Authentication Flow

1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. After consent, redirected to Supabase callback URL
4. Supabase handles token exchange
5. User redirected back to app with session
6. Session persisted in browser

## Security Considerations

1. Environment Variables:
   - Never commit `.env` files
   - Use appropriate environment variables per environment
   - Keep anon key restricted with RLS policies

2. Redirect URLs:
   - Strictly maintain allowed redirect URLs
   - Update URLs when domain changes
   - Keep localhost URLs for development only

3. Session Management:
   - Sessions handled by Supabase
   - Default expiry: 1 hour
   - Refresh tokens: 1 year

## Troubleshooting

1. Redirect Issues:
   - Verify redirect URLs in Google Console
   - Check Supabase Site URL configuration
   - Ensure all origins are authorized

2. Session Issues:
   - Check browser console for errors
   - Verify environment variables
   - Clear browser storage if testing

## Next Steps

1. Implement GitHub authentication
2. Add email verification
3. Enhance error handling
4. Add password reset functionality
5. Implement protected routes
6. Add user profile management

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
