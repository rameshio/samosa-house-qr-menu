import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogoIntro from './components/LogoIntro';
import MenuPage from './pages/MenuPage';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuEditor from './pages/admin/AdminMenuEditor';
import AdminStaff from './pages/admin/AdminStaff';
import AdminAudit from './pages/admin/AdminAudit';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <LogoIntro />
            <MenuPage />
          </>
        } />
        
        <Route path="/admin/*" element={
          <AuthProvider>
            <Routes>
              <Route element={<AdminLayout />}>
                <Route path="login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="menu/new" element={<AdminMenuEditor />} />
                  <Route path="menu/:id/edit" element={<AdminMenuEditor />} />
                  <Route element={<ProtectedRoute requireOwner={true} />}>
                    <Route path="staff" element={<AdminStaff />} />
                    <Route path="audit" element={<AdminAudit />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;