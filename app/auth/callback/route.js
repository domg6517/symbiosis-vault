import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (code) {
    // PKCE flow - exchange code for session
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (token_hash && type) {
    // Token hash flow - verify OTP
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.verifyOtp({ token_hash, type });
  }

  // Redirect to home page
  const origin = requestUrl.origin;
  return NextResponse.redirect(origin + '/');
}
