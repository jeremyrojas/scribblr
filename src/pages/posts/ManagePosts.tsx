import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

interface Post {
  id: string;
  title: string;
  status: string;
  created_at: string;
  published_at: string | null;
  author: {
    username: string | null;
  } | null;
}

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      status,
      created_at,
      published_at,
      author:profiles(username)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export default function ManagePosts() {
  const navigate = useNavigate();
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60,
    retry: 2
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    }
  }, [error]);

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  const getAuthorName = (author: Post["author"]) => {
    return author?.username || "Unknown";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-semibold tracking-tight">Manage Posts</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.map((post) => (
            <TableRow
              key={post.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{formatDate(post.published_at || post.created_at)}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.status}
                </span>
              </TableCell>
              <TableCell>{getAuthorName(post.author)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}