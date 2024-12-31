import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Save, Link as LinkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Post } from "@/types/post";

interface PostFormProps {
  post: Post;
  onSave: (post: Post) => Promise<void>;
  onPublish: () => Promise<void>;
  isLoading: boolean;
}

export function PostForm({ post, onSave, onPublish, isLoading }: PostFormProps) {
  const [localPost, setLocalPost] = useState(post);

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

      setLocalPost(prev => ({ ...prev, photo_url: publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/view/${post.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Public link copied to clipboard");
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={localPost.title}
          onChange={(e) => setLocalPost(prev => ({ ...prev, title: e.target.value }))}
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
            {localPost.photo_url ? (
              <img
                src={localPost.photo_url}
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
          value={localPost.content}
          onChange={(e) => setLocalPost(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Write your post content..."
          className="min-h-[300px]"
        />
      </div>

      <div className="flex justify-end space-x-4">
        {post.id && post.status === "published" && (
          <Button onClick={handleCopyLink} variant="outline" size="sm">
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy Public Link
          </Button>
        )}
        {post.status === "draft" && (
          <Button onClick={() => onPublish()} variant="outline" disabled={isLoading}>
            Publish
          </Button>
        )}
        <Button onClick={() => onSave(localPost)} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </Card>
  );
}