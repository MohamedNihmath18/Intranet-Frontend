import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { User, UserRole, AuditLog } from '../types';
import { useToast } from '../context/ToastContext';
import { UserPlus, ShieldAlert, Trash2, Key, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, List, Users as UsersIcon, Clock } from 'lucide-react';
import { Modal } from '../components/Modal';

export const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetUserTitle, setResetUserTitle] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
     username: '',
     password: '',
     fullName: '',
     role: UserRole.STAFF,
     jobTitle: '',
     department: '',
     email: '',
     extension: '',
  });

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsPage, setLogsPage] = useState(1);
  const logsPerPage = 10;

  const loadData = async () => {
     try {
       const [userData, logData] = await Promise.all([
         ApiService.getUsers(),
         ApiService.getAuditLogs()
       ]);
       setUsers(userData);
       setLogs(logData);
     } catch (error) {
       console.error(error);
     }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    let sortableItems = [...users];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [users, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

  const indexOfLastLog = logsPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalLogPages = Math.ceil(logs.length / logsPerPage);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400">You do not have permission to view this page.</p>
      </div>
    );
  }

  const initiateDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await ApiService.deleteUser(userToDelete.id);
        addToast('User deleted successfully', 'info');
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        loadData();
      } catch (error) {
        addToast('Failed to delete user', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.createUser(formData);
      addToast('User created successfully', 'success');
      setIsModalOpen(false);
      setFormData({
        username: '', password: '', fullName: '', role: UserRole.STAFF,
        jobTitle: '', department: '', email: '', extension: ''
      });
      loadData();
    } catch (error) {
      addToast('Failed to create user', 'error');
    }
  };

  const openResetModal = (user: User) => {
    setResetUserId(user.id);
    setResetUserTitle(user.fullName);
    setNewPassword('');
    setIsResetModalOpen(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetUserId && newPassword) {
      try {
        await ApiService.resetPassword(resetUserId, newPassword);
        addToast(`Password reset for ${resetUserTitle}`, 'success');
        setIsResetModalOpen(false);
        setResetUserId(null);
        setNewPassword('');
      } catch (error) {
        addToast('Failed to reset password', 'error');
      }
    }
  };

  const renderSortIcon = (key: keyof User) => {
    if (sortConfig?.key !== key) return <div className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    // ... JSX stays mostly the same, ensure no MockService calls exist
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Panel</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage system users and view audit logs</p>
        </div>
        {activeTab === 'users' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'users' 
              ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          User Management
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'logs' 
              ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <List className="w-4 h-4" />
          Audit Logs
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 select-none">
                <tr>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                    onClick={() => handleSort('username')}
                  >
                    <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                      User
                      <span className="text-slate-400 group-hover:text-blue-500">{renderSortIcon('username')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                    onClick={() => handleSort('role')}
                  >
                     <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                      Role
                      <span className="text-slate-400 group-hover:text-blue-500">{renderSortIcon('role')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                    onClick={() => handleSort('department')}
                  >
                     <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                      Department
                      <span className="text-slate-400 group-hover:text-blue-500">{renderSortIcon('department')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {currentUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.avatar} 
                          alt="" 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{u.fullName}</p>
                          <p className="text-xs text-slate-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                        ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}
                      `}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{u.department}</td>
                    <td className="px-6 py-4">
                       {u.username !== 'admin' && (
                         <div className="flex items-center gap-2">
                           <button 
                            onClick={() => openResetModal(u)} 
                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                            title="Reset Password"
                           >
                             <Key className="w-4 h-4" />
                           </button>
                           <button 
                            onClick={() => initiateDelete(u)} 
                            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                            title="Delete User"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       )}
                    </td>
                  </tr>
                ))}
                {currentUsers.length === 0 && (
                   <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                         No users found.
                      </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls for Users */}
          {users.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
               <span className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} users
               </span>
               <div className="flex items-center gap-2">
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
                  >
                     <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                     Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
                  >
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Timestamp</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Actor</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Action</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {currentLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString()}
                       </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{log.actorName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold
                        ${log.action.includes('DELETE') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                          log.action.includes('CREATE') || log.action.includes('ADD') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          log.action.includes('UPDATE') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}
                      `}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md truncate" title={log.details}>{log.details}</td>
                  </tr>
                ))}
                {currentLogs.length === 0 && (
                   <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                         No logs found.
                      </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for Logs */}
          {logs.length > 0 && (
             <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                   Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, logs.length)} of {logs.length} entries
                </span>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={() => setLogsPage(p => Math.max(1, p - 1))} 
                     disabled={logsPage === 1}
                     className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
                   >
                      <ChevronLeft className="w-4 h-4" />
                   </button>
                   <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Page {logsPage} of {totalLogPages}
                   </span>
                   <button 
                     onClick={() => setLogsPage(p => Math.min(totalLogPages, p + 1))} 
                     disabled={logsPage === totalLogPages}
                     className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
                   >
                      <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New User">
        <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Username</label>
               <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
               <input required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" type="password" />
             </div>
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
             <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" type="email" />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                   <option value={UserRole.STAFF}>Staff</option>
                   <option value={UserRole.ADMIN}>Admin</option>
                </select>
             </div>
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
             <input required value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                 <input required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Extension</label>
                 <input required value={formData.extension} onChange={e => setFormData({...formData, extension: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
           </div>
           <div className="flex justify-end mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create User</button>
           </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="Reset Password">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Resetting password for <span className="font-bold">{resetUserTitle}</span>.
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
            <input 
              required 
              type="password"
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
              placeholder="Enter new password"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
             <button 
               type="button" 
               onClick={() => setIsResetModalOpen(false)} 
               className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
             >
               Cancel
             </button>
             <button 
               type="submit" 
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
             >
               Update Password
             </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm User Deletion">
         <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800 flex items-start gap-3">
               <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
               <div>
                  <h4 className="font-bold text-red-800 dark:text-red-300 mb-1">Irreversible Action</h4>
                  <p className="text-sm text-red-700 dark:text-red-200 leading-relaxed">
                     You are about to permanently delete a user account. This action <span className="font-bold">cannot be undone</span>.
                  </p>
               </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
               <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">User Details</p>
               <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{userToDelete?.fullName}</span>
                  <span className="text-sm font-mono text-slate-600 dark:text-slate-300">@{userToDelete?.username}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{userToDelete?.department} • {userToDelete?.jobTitle}</span>
               </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
               <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
               >
                  Cancel
               </button>
               <button 
                  onClick={confirmDelete} 
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm font-medium"
               >
                  <Trash2 className="w-4 h-4" /> Delete User Account
               </button>
            </div>
         </div>
      </Modal>
    </div>
  );
};