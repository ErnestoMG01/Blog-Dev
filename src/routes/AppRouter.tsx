import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Blog from '../pages/Blog';
import { DraftsListPage } from '../modules/admin/pages/DraftsListPage';
import DraftEditorPage from '../modules/admin/pages/DraftEditorPage'; // Importación por defecto sin llaves
import { PostsListPage } from '../modules/admin/pages/PostsListPage';
import AdminLoginPage from '../modules/admin/pages/AdminLoginPage';
import ProtectedRoute from './ProtectedRoute';
import BlogFeedPage from '../modules/blog/pages/BlogFeedPage';
import BlogPostPage from '../modules/blog/pages/BlogPostPage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Vista Pública */}
      <Route element={<Blog />} path="/" />
      <Route element={<BlogFeedPage />} path="/blog" />
      <Route element={<BlogPostPage />} path="/blog/:slug" />
      
      {/* Panel CMS Admin */}
      <Route element={<AdminLoginPage />} path="/admin/login" />
      <Route element={<ProtectedRoute />}>
        <Route element={<Navigate replace to="/admin/drafts" />} path="/admin" />
        <Route element={<DraftsListPage />} path="/admin/drafts" />
        <Route element={<DraftEditorPage />} path="/admin/drafts/new" />
        <Route element={<DraftEditorPage />} path="/admin/drafts/:id" />
        <Route element={<PostsListPage />} path="/admin/posts" />
      </Route>

      {/* Catch-all */}
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  </BrowserRouter>
);