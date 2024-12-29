import { createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/integrations/supabase/types";

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);