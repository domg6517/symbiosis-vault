"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    if (!userId) return;
    try {
      const res = await fetch("/api/profile/get?userId=" + userId + "&t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.profile) setProfile(data.profile);
    } catch (e) {
      console.error("Profile fetch error:", e);
    }
  }

  async function refreshProfile(userId) {
    const id = userId || user?.id;
    if (!id) return;
    await fetchProfile(id);
  }

  async function signUp(email, password, username, dateOfBirth) {
    if (!supabase) return { error: { message: "Supabase not configured" } };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username,
          date_of_birth: dateOfBirth,
        },
      },
    });

    // Create profile row with username
    if (!error && data?.user) {
      try {
        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            username: username,
            email: email,
          },
          { onConflict: "id" }
        );
      } catch (profileErr) {
        console.error("Profile creation error:", profileErr);
      }
    }

    return { data, error };
  }

  async function signIn(email, password) {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
        isSupabaseConfigured,
            refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
