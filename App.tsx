 

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Announcements } from './pages/Announcements';
import { Documents } from './pages/Documents';
import { LinksPage } from './pages/Links';
import { Directory } from './pages/Directory';
import { AdminPanel } from './pages/Admin';
import { Profile } from './pages/Profile';
import { DoctorsOnCall } from './pages/DoctorsOnCall';
import { Departments } from './pages/Departments';
import { DepartmentDetail } from './pages/DepartmentDetails';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/announcements" element={<Announcements />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/links" element={<LinksPage />} />
                      <Route path="/directory" element={<Directory />} />
                     /*<Route path="/extensions" element={<Directory />} /> */
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/profile" element={<Profile />} />
                      {/* New Routes */}
                      <Route path="/oncall" element={<DoctorsOnCall />} />
                      <Route path="/departments" element={<Departments />} />
                      <Route path="/departments/:id" element={<DepartmentDetail />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </HashRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;