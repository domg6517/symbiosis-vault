import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') || 'signup';
  const origin = requestUrl.origin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(origin + '/');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    if (token_hash) {
      // Email confirmation via token hash (from our custom email template)
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type,
      });
      if (error) {
        console.error('Token verification error:', error.message);
      }
    } else if (code) {
      // PKCE flow - exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Code exchange error:', error.message);
      }
    }
  } catch (err) {
    console.error('Auth callback error:', err);
  }

  // Redirect to home - the app will detect the verified user on sign-in
  return NextResponse.redirect(origin + '/');
}
