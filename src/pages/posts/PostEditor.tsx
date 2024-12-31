import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { PostForm } from "@/components/posts/PostForm";
import { Post } from "@/types/post";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  // Fetch post data with proper error handling and timeout
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      console.log("Fetching post:", id);
      if (!id) return {
        title: "",
        content: "",
        status: "draft",
        photo_url: null,
      } as Post;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching post:", error);
        throw error;
      }

      return data as Post;
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle save mutation with proper error handling
  const saveMutation = useMutation({
    mutationFn: async (postData: Post) => {
      console.log("Saving post:", postData);
      if (!user) throw new Error("User not authenticated");

      const postToSave = {
        ...postData,
        author_id: user.id,
      };

      let response;
      if (id) {
        response = await supabase
          .from("posts")
          .update(postToSave)
          .eq("id", id);
      } else {
        response = await supabase
          .from("posts")
          .insert([postToSave]);
      }

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast.success(id ? "Post updated!" : "Post created!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (!id) navigate("/posts");
    },
    onError: (error) => {
      console.error("Error saving post:", error);
      toast.error("Failed to save post. Please try again.");
    },
    onSettled: () => {
      setSaving(false);
    }
  });

  // Handle publish mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      console.log("Publishing post:", id);
      if (!id || !user) throw new Error("Invalid operation");

      const response = await supabase
        .from("posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast.success("Post published!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post. Please try again.");
    }
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Error in PostEditor:", error);
      toast.error("Failed to load post");
      navigate("/posts");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const handleSave = async (postData: Post) => {
    setSaving(true);
    await saveMutation.mutateAsync(postData);
  };

  const handlePublish = async () => {
    await publishMutation.mutateAsync();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-semibold tracking-tight">
        {id ? "Edit Post" : "Create New Post"}
      </h1>
      
      {post && (
        <PostForm
          post={post}
          onSave={handleSave}
          onPublish={handlePublish}
          isLoading={saving || publishMutation.isPending}
        />
      )}
    </div>
  );
}