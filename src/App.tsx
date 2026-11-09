import './index.css';
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import BlogFeedPage from "./modules/blog/pages/BlogFeedPage";
import BlogPostPage from "./modules/blog/pages/BlogPostPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { DraftsListPage } from "./modules/admin/pages/DraftsListPage";
import DraftEditorPage from "./modules/admin/pages/DraftEditorPage";
import { PostsListPage } from "./modules/admin/pages/PostsListPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/blog" element={<BlogFeedPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/drafts" element={<DraftsListPage />} />
          <Route path="/admin/drafts/new" element={<DraftEditorPage />} />
          <Route path="/admin/drafts/:id" element={<DraftEditorPage />} />
          <Route path="/admin/posts" element={<PostsListPage />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;