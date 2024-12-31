import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import PostEditor from "./pages/posts/PostEditor";
import ManagePosts from "./pages/posts/ManagePosts";
import PublicPost from "./pages/posts/PublicPost";
import Settings from "./pages/settings/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* All other routes use AppLayout */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/posts/new" element={<PostEditor />} />
                <Route path="/posts/edit/:id" element={<PostEditor />} />
                <Route path="/posts" element={<ManagePosts />} />
                <Route path="/posts/:id" element={<PublicPost />} />
                <Route path="/posts/view/:id" element={<PublicPost />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;