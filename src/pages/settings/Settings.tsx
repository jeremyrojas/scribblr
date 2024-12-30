import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  id: string;
  username: string | null;
  created_at: string;
}

interface LoginHistory {
  id: string;
  login_at: string;
  user: {
    username: string | null;
  };
}

const fetchProfiles = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

const fetchLoginHistory = async () => {
  const { data, error } = await supabase
    .from("login_history")
    .select(`
      id,
      login_at,
      user:profiles(username)
    `)
    .order("login_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export default function Settings() {
  const { 
    data: profiles, 
    isLoading: isLoadingProfiles, 
    error: profilesError 
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    staleTime: 1000 * 60,
    retry: 2
  });

  const { 
    data: loginHistory, 
    isLoading: isLoadingHistory, 
    error: historyError 
  } = useQuery({
    queryKey: ["loginHistory"],
    queryFn: fetchLoginHistory,
    staleTime: 1000 * 60,
    retry: 2
  });

  useEffect(() => {
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      toast.error("Failed to load profiles");
    }
    if (historyError) {
      console.error("Error fetching login history:", historyError);
      toast.error("Failed to load login history");
    }
  }, [profilesError, historyError]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (isLoadingProfiles || isLoadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Admin Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile: Profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">
                  {profile.username || "N/A"}
                </TableCell>
                <TableCell>{formatDate(profile.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Login History</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Login Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loginHistory?.map((entry: LoginHistory) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  {entry.user?.username || "N/A"}
                </TableCell>
                <TableCell>{formatDate(entry.login_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}