import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Save } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PostEditor() {
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [image, setImage] = useState<string | null>(null);

  const handlePublish = () => {
    setStatus("published");
    // TODO: Implement publish logic
  };

  const handleSave = () => {
    // TODO: Implement save logic
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">
          {status === "draft" ? "Create New Post" : "Edit Post"}
        </h1>
        <div className="space-x-4">
          {status === "draft" && (
            <Button onClick={handlePublish} variant="outline">
              Publish
            </Button>
          )}
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Enter post title..." />
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="max-h-48 mx-auto rounded"
              />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImagePlus className="h-12 w-12 mb-2" />
                <span>Click to upload image</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your post content..."
            className="min-h-[300px]"
          />
        </div>
      </Card>
    </div>
  );
}