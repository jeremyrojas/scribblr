import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AppLayout } from "./components/layout/AppLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
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
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Public routes for viewing posts */}
            <Route path="/posts/view/:id" element={
              <PublicLayout>
                <PublicPost />
              </PublicLayout>
            } />
            <Route path="/posts/:id" element={
              <PublicLayout>
                <PublicPost />
              </PublicLayout>
            } />
            {/* Protected admin routes */}
            <Route
              path="/"
              element={
                <AppLayout>
                  <Index />
                </AppLayout>
              }
            />
            <Route
              path="/posts/new"
              element={
                <AppLayout>
                  <PostEditor />
                </AppLayout>
              }
            />
            <Route
              path="/posts/edit/:id"
              element={
                <AppLayout>
                  <PostEditor />
                </AppLayout>
              }
            />
            <Route
              path="/posts"
              element={
                <AppLayout>
                  <ManagePosts />
                </AppLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;