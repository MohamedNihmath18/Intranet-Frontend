// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import { 
//   LayoutDashboard, 
//   Link as LinkIcon, 
//   FileText, 
//   Users, 
//   Megaphone, 
//   Menu, 
//   LogOut, 
//   Phone, 
//   ShieldCheck,
//   LogIn,
//   Sun,
//   Moon
// } from 'lucide-react';

// export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user, logout, isAuthenticated, isAdmin } = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const navItems = [
//     { label: 'Home', path: '/', icon: LayoutDashboard },
//     { label: 'Announcements', path: '/announcements', icon: Megaphone },
//     { label: 'Documents', path: '/documents', icon: FileText },
//     { label: 'Links', path: '/links', icon: LinkIcon },
//     { label: 'Directory', path: '/directory', icon: Users },
//     { label: 'Extensions', path: '/extensions', icon: Phone },
//   ];

//   if (isAdmin) {
//     navItems.push({ label: 'Admin Panel', path: '/admin', icon: ShieldCheck });
//   }

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <div className="flex h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-20 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`
//         fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 dark:bg-slate-950 text-white transform transition-transform duration-200 ease-in-out
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//       `}>
//         <div className="h-16 flex flex-col justify-center px-6 bg-slate-950 dark:bg-black font-bold tracking-tight border-b border-slate-800">
//           <span className="text-blue-400 text-lg leading-none mb-0.5">MAHSA</span>
//           <span className="text-white text-xs leading-none tracking-wide">SPECIALIST HOSPITAL</span>
//         </div>

//         <div className="p-4">
//           {isAuthenticated && user ? (
//             <Link to="/profile" onClick={() => setSidebarOpen(false)} className="block">
//               <div className="flex items-center p-3 mb-6 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors group cursor-pointer border border-transparent hover:border-slate-700">
//                 <img src={user.avatar || 'https://via.placeholder.com/40'} alt="User" className="w-10 h-10 rounded-full border-2 border-blue-500 group-hover:border-blue-400 transition-colors" />
//                 <div className="ml-3 overflow-hidden">
//                   <p className="text-sm font-semibold truncate text-slate-100 group-hover:text-white">{user.fullName}</p>
//                   <p className="text-xs text-slate-400 truncate capitalize group-hover:text-slate-300">{user.role.toLowerCase()}</p>
//                 </div>
//               </div>
//             </Link>
//           ) : (
//              <div className="flex items-center p-3 mb-6 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700">
//                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
//                   <Users className="w-5 h-5 text-slate-400" />
//                </div>
//               <div className="ml-3">
//                 <p className="text-sm font-semibold text-slate-200">Guest Viewer</p>
//                 <Link to="/login" className="text-xs text-blue-400 hover:text-blue-300 flex items-center mt-1">
//                   Log In <LogIn className="w-3 h-3 ml-1"/>
//                 </Link>
//               </div>
//             </div>
//           )}

//           <nav className="space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => setSidebarOpen(false)}
//                   className={`
//                     flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200
//                     ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white'}
//                   `}
//                 >
//                   <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
//                   {item.label}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         {isAuthenticated && (
//           <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
//             <button 
//               onClick={handleLogout}
//               className="flex items-center w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-900 rounded-lg transition-colors"
//             >
//               <LogOut className="w-5 h-5 mr-3" />
//               Sign Out
//             </button>
//           </div>
//         )}
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 transition-colors duration-200">
//           <div className="flex items-center">
//             <button 
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden p-2 mr-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
//             >
//               <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
//             </button>
//             <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
//               {navItems.find(i => i.path === location.pathname)?.label || (location.pathname === '/profile' ? 'My Profile' : 'Dashboard')}
//             </h1>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
//               title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
//             >
//               {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
//             </button>
            
//              {!isAuthenticated && (
//                 <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Login</Link>
//              )}
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin">
//           <div className="max-w-7xl mx-auto">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  FileText, 
  Users, 
  Megaphone, 
  Menu, 
  LogOut, 
  Phone, 
  ShieldCheck,
  LogIn,
  Sun,
  Moon,
  Stethoscope,
  Building
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/', icon: LayoutDashboard },
    { label: 'Announcements', path: '/announcements', icon: Megaphone },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Links', path: '/links', icon: LinkIcon },
    { label: 'Directory', path: '/directory', icon: Users },
    { label: 'Extensions', path: '/extensions', icon: Phone },
    // New Tabs
    { label: 'Doctors On-Call', path: '/oncall', icon: Stethoscope },
    { label: 'Departments', path: '/departments', icon: Building },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 dark:bg-slate-950 text-white transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex flex-col justify-center px-6 bg-slate-950 dark:bg-black font-bold tracking-tight border-b border-slate-800">
          <span className="text-blue-400 text-lg leading-none mb-0.5">MAHSA</span>
          <span className="text-white text-xs leading-none tracking-wide">SPECIALIST HOSPITAL</span>
        </div>

        <div className="p-4">
          {isAuthenticated && user ? (
            <Link to="/profile" onClick={() => setSidebarOpen(false)} className="block">
              <div className="flex items-center p-3 mb-6 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors group cursor-pointer border border-transparent hover:border-slate-700">
                <img src={user.avatar || 'https://via.placeholder.com/40'} alt="User" className="w-10 h-10 rounded-full border-2 border-blue-500 group-hover:border-blue-400 transition-colors" />
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-semibold truncate text-slate-100 group-hover:text-white">{user.fullName}</p>
                  <p className="text-xs text-slate-400 truncate capitalize group-hover:text-slate-300">{user.role.toLowerCase()}</p>
                </div>
              </div>
            </Link>
          ) : (
             <div className="flex items-center p-3 mb-6 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700">
               <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-400" />
               </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-slate-200">Guest Viewer</p>
                <Link to="/login" className="text-xs text-blue-400 hover:text-blue-300 flex items-center mt-1">
                  Log In <LogIn className="w-3 h-3 ml-1"/>
                </Link>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200
                    ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white'}
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {isAuthenticated && (
          <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-900 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 transition-colors duration-200">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 mr-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
              {navItems.find(i => i.path === location.pathname)?.label || (location.pathname.includes('/departments/') ? 'Department Details' : location.pathname === '/profile' ? 'My Profile' : 'Dashboard')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
             {!isAuthenticated && (
                <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Login</Link>
             )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};