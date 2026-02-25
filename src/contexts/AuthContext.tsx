import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/* =====================================================
   Types
===================================================== */

type AppRole = Database["public"]["Enums"]["app_role"];

type ProfileType = {
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: AppRole | null;
  isAdmin: boolean;
  profile: ProfileType | null;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ error: Error | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

/* =====================================================
   Create Context
===================================================== */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =====================================================
   Auth Provider
===================================================== */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /* -------------------- STATE -------------------- */

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  /* =====================================================
     Fetch Profile + Role
  ===================================================== */

  const fetchUserData = async (userId: string) => {
    setRoleLoading(true);

    /* ---- Fetch Profile ---- */
    const { data: profileData } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);
    } else {
      setProfile(null);
    }

    /* ---- Fetch Roles ---- */
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (rolesData && rolesData.length > 0) {
      const hasAdminRole = rolesData.some(
        (item) => item.role === "admin"
      );

      if (hasAdminRole) {
        setUserRole("admin");
      } else {
        setUserRole(rolesData[0].role as AppRole);
      }
    } else {
      setUserRole(null);
    }

    setRoleLoading(false);
  };

  /* =====================================================
     Handle Auth State Changes
  ===================================================== */

  useEffect(() => {
    /* 1️⃣ Listen for login/logout changes */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setProfile(null);
        setUserRole(null);
        setRoleLoading(false);
      }
    });

    /* 2️⃣ Check existing session (important on refresh) */
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setRoleLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* =====================================================
     Auth Functions
  ===================================================== */

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setSession(null);
    setProfile(null);
    setUserRole(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  /* =====================================================
     Provide Context
  ===================================================== */

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading: loading || roleLoading,
        userRole,
        isAdmin: userRole === "admin",
        profile,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =====================================================
   Custom Hook
===================================================== */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
