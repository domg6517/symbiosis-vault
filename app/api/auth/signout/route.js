import { NextResponse } from "next/server";

export async function POST() {
  // Sign out is handled client-side via supabase.auth.signOut()
  // This route exists for completeness / server-side session clearing
  return NextResponse.json({ message: "Signed out" });
}
