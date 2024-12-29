import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({
    title: "",
    content: "",
    status: "draft",
    photo_url: null as string | null,
  });

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setPost({
          title: data.title,
          content: data.content || "",
          status: data.status || "draft",
          photo_url: data.photo_url,
        });
      }
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("Failed to load post");
    }
  };

  const handlePublish = async () => {
    await savePost("published");
  };

  const handleSave = async () => {
    await savePost(post.status);
  };

  const savePost = async (status: string) => {
    if (!user) return;
    setLoading(true);

    try {
      const postData = {
        title: post.title,
        content: post.content,
        status,
        photo_url: post.photo_url,
        author_id: user.id,
        published_at: status === "published" ? new Date().toISOString() : null,
      };

      let response;
      if (id) {
        response = await supabase
          .from("posts")
          .update(postData)
          .eq("id", id);
      } else {
        response = await supabase
          .from("posts")
          .insert([postData]);
      }

      if (response.error) throw response.error;
      
      toast.success(status === "published" ? "Post published!" : "Post saved!");
      if (!id) {
        navigate("/posts");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(fileName);

      setPost(prev => ({ ...prev, photo_url: publicUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">
          {id ? "Edit Post" : "Create New Post"}
        </h1>
        <div className="space-x-4">
          {post.status === "draft" && (
            <Button onClick={handlePublish} variant="outline" disabled={loading}>
              Publish
            </Button>
          )}
          <Button onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={post.title}
            onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter post title..."
          />
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              {post.photo_url ? (
                <img
                  src={post.photo_url}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded"
                />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImagePlus className="h-12 w-12 mb-2" />
                  <span>Click to upload image</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={post.content}
            onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Write your post content..."
            className="min-h-[300px]"
          />
        </div>
      </Card>
    </div>
  );
}