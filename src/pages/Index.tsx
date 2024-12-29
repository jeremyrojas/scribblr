import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 animate-fadeIn">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to SCRIBBLR</h1>
      <p className="text-lg text-muted-foreground">Your minimalist content management system</p>
      <Button 
        size="lg"
        onClick={() => navigate("/posts/new")}
        className="mt-8"
      >
        <FileEdit className="mr-2 h-5 w-5" />
        Create Your First Post
      </Button>
    </div>
  );
};

export default Index;