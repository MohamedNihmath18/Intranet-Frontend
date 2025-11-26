import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ApiService } from '../services/apiService';
import { AuditLog } from '../types';
import { User, Mail, Briefcase, Phone, Key, Save, Building, Shield, Activity, Clock, UserCircle, Hash } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { addToast } = useToast();

  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [extension, setExtension] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [myLogs, setMyLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (user) {
      setJobTitle(user.jobTitle || '');
      setDepartment(user.department || '');
      setExtension(user.extension || '');

      ApiService.getAuditLogs().then(allLogs => {
        const userLogs = allLogs.filter(log => log.actorName === user.fullName);
        setMyLogs(userLogs);
      }).catch(console.error);
    }
  }, [user]);

  if (!user) return <div className="text-center p-8 dark:text-white">Please log in to view your profile.</div>;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ jobTitle, department, extension });
    addToast('Profile information updated successfully', 'success');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 4) {
      addToast('Password must be at least 4 characters', 'error');
      return;
    }
    
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      addToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // ... Render logic remains identical ...
  return (
    <div className="space-y-8">
      {/* Header / Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <img 
                src={user.avatar} 
                alt={user.fullName} 
                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800 bg-white"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-slate-900 dark:bg-black text-white p-2 rounded-full border-4 border-white dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm" title="Change Avatar">
               <User className="w-4 h-4" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{user.fullName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full text-sm font-semibold flex items-center gap-1.5 border border-indigo-100 dark:border-indigo-800">
                <Shield className="w-3.5 h-3.5" /> {user.role}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full text-sm font-medium flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                <UserCircle className="w-3.5 h-3.5" /> @{user.username}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
              {user.jobTitle} at <span className="font-semibold text-slate-800 dark:text-slate-200">{user.department}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Identity Cards (Read Only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-colors hover:border-blue-200 dark:hover:border-blue-800 group">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                <p className="text-base font-bold text-slate-800 dark:text-white truncate" title={user.email}>{user.email}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-colors hover:border-indigo-200 dark:hover:border-indigo-800 group">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Access Level</p>
                <p className="text-base font-bold text-slate-800 dark:text-white">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Work Details Form (Editable) */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                   <Briefcase className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-slate-800 dark:text-white">Work Details</h2>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Update your professional information</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Title</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        value={jobTitle} 
                        onChange={e => setJobTitle(e.target.value)} 
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-medium"
                        placeholder="e.g. Senior Marketing Manager"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Department</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Building className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        value={department} 
                        onChange={e => setDepartment(e.target.value)} 
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-medium"
                        placeholder="e.g. Marketing"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Extension</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Hash className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        value={extension} 
                        onChange={e => setExtension(e.target.value)} 
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-medium"
                        placeholder="e.g. 1042"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                   <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      <Save className="w-4 h-4" /> Save Changes
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Password Change */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors h-fit">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
             <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <Key className="w-5 h-5 text-slate-700 dark:text-slate-300" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-800 dark:text-white">Security</h2>
               <p className="text-xs text-slate-500 dark:text-slate-400">Manage your password</p>
             </div>
          </div>
          <div className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                  <input 
                     type="password" 
                     required
                     value={currentPassword}
                     onChange={e => setCurrentPassword(e.target.value)}
                     className="w-full p-2.5 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                     placeholder="••••••••"
                  />
               </div>
               <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50"></div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input 
                     type="password" 
                     required
                     value={newPassword}
                     onChange={e => setNewPassword(e.target.value)}
                     className="w-full p-2.5 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                     placeholder="••••••••"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <input 
                     type="password" 
                     required
                     value={confirmPassword}
                     onChange={e => setConfirmPassword(e.target.value)}
                     className="w-full p-2.5 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                     placeholder="••••••••"
                  />
               </div>
               <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-2.5 rounded-lg font-medium transition-colors mt-2 shadow-sm">
                  Update Password
               </button>
            </form>
          </div>
        </div>
      </div>

      {/* User Activity Logs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
             <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h2>
             <p className="text-xs text-slate-500 dark:text-slate-400">Your actions within the portal</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Timestamp</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Action</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {myLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap w-48">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 w-48">
                    <span className={`px-2 py-1 rounded text-xs font-bold border
                      ${log.action.includes('DELETE') ? 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' : 
                        log.action.includes('CREATE') || log.action.includes('ADD') ? 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' :
                        log.action.includes('UPDATE') ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' :
                        'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}
                    `}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{log.details}</td>
                </tr>
              ))}
              {myLogs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <Activity className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-700 mb-3" />
                    <p>No activity recorded yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};