import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../modules/landing/pages/LandingPage";
import BlogFeedPage from "../modules/blog/pages/BlogFeedPage";
import BlogPostPage from "../modules/blog/pages/BlogPostPage";
import DraftsListPage from "../modules/admin/pages/DraftsListPage";
import PostsListPage from "../modules/admin/pages/PostsListPage";
import DraftEditorPage from "../modules/admin/pages/DraftEditorPage";
import AdminLoginPage from "../modules/admin/pages/AdminLoginPage";
import ProtectedRoute from "./ProtectedRoute";

export function AppRouter() {
  const basename = window.location.pathname === "/Blog-Dev" || window.location.pathname.startsWith("/Blog-Dev/")
    ? "/Blog-Dev"
    : undefined;

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogFeedPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/admin/drafts" replace />} />
          <Route path="drafts" element={<DraftsListPage />} />
          <Route path="drafts/new" element={<DraftEditorPage />} />
          <Route path="drafts/:id" element={<DraftEditorPage />} />
          <Route path="drafts/:id/edit" element={<DraftEditorPage />} />
          <Route path="posts" element={<PostsListPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
