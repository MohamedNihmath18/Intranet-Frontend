import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ApiService } from '../services/apiService';
import { User } from '../types';
import { Search, Phone, Mail, Briefcase } from 'lucide-react';

export const Directory: React.FC = () => {
  const location = useLocation();
  const isExtensionsView = location.pathname === '/extensions';
  
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    ApiService.getUsers().then(setUsers).catch(console.error);
  }, []);

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {isExtensionsView ? 'Extension List' : 'Staff Directory'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {isExtensionsView 
            ? 'Quickly find internal phone extensions.' 
            : 'Connect with colleagues across the organization.'
          }
        </p>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, department, or title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {isExtensionsView ? (
        /* EXTENSIONS TABLE VIEW */
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Department</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Extension</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white hidden md:table-cell">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                   <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                         <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      {user.fullName}
                   </td>
                   <td className="px-6 py-4">{user.department}</td>
                   <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 py-1 px-2 rounded font-mono font-bold">
                        {user.extension}
                      </span>
                   </td>
                   <td className="px-6 py-4 hidden md:table-cell text-blue-600 dark:text-blue-400">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* DIRECTORY GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all flex items-start gap-4">
               <img 
                  src={user.avatar} 
                  alt={user.fullName} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm"
                />
               <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white truncate">{user.fullName}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-1 truncate">{user.jobTitle}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">{user.department}</p>
                  
                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                     <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 rounded">Ext. {user.extension}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{user.email}</span>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};