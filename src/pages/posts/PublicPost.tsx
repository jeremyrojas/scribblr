import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function PublicPost() {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["public-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles(username)
        `)
        .eq("id", id)
        .eq("status", "published")
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="text-muted-foreground mt-2">This post might be private or doesn't exist.</p>
      </div>
    );
  }

  return (
    <article className="prose prose-slate mx-auto">
      {post.photo_url && (
        <img
          src={post.photo_url}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <span>By {post.author?.username}</span>
        <span>•</span>
        <time>
          {new Date(post.published_at || post.created_at).toLocaleDateString()}
        </time>
      </div>
      <div className="whitespace-pre-wrap">{post.content}</div>
    </article>
  );
}