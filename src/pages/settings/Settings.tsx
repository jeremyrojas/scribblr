import { useEffect, useState } from "react";
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
import { Profile } from "@/types/profile";

interface LoginHistory {
  id: string;
  login_at: string;
  user: {
    username: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

export default function Settings() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profilesResponse, loginHistoryResponse] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("login_history")
          .select(`
            id,
            login_at,
            user:profiles(username, first_name, last_name)
          `)
          .order("login_at", { ascending: false }),
      ]);

      if (profilesResponse.error) throw profilesResponse.error;
      if (loginHistoryResponse.error) throw loginHistoryResponse.error;

      setProfiles(profilesResponse.data || []);
      setLoginHistory(loginHistoryResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load settings data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getUserName = (profile: { first_name: string | null; last_name: string | null; username: string | null }) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile.username || "Unknown";
  };

  if (loading) {
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
              <TableHead>Name</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">
                  {profile.username || "N/A"}
                </TableCell>
                <TableCell>
                  {profile.first_name && profile.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : "N/A"}
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
            {loginHistory.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  {entry.user ? getUserName(entry.user) : "Unknown"}
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