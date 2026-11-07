import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Blog from '../pages/Blog';
import { DraftsListPage } from '../modules/admin/pages/DraftsListPage';
import DraftEditorPage from '../modules/admin/pages/DraftEditorPage'; // Importación por defecto sin llaves
import { PostsListPage } from '../modules/admin/pages/PostsListPage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Vista Pública */}
      <Route element={<Blog />} path="/" />
      
      {/* Panel CMS Admin */}
      <Route element={<Navigate replace to="/admin/drafts" />} path="/admin" />
      <Route element={<DraftsListPage />} path="/admin/drafts" />
      <Route element={<DraftEditorPage />} path="/admin/drafts/new" />
      <Route element={<DraftEditorPage />} path="/admin/drafts/:id" />
      <Route element={<PostsListPage />} path="/admin/posts" />

      {/* Catch-all */}
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  </BrowserRouter>
);