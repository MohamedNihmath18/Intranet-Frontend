import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { Department } from '../types';
import { useToast } from '../context/ToastContext';
import * as LucideIcons from 'lucide-react';
import { Plus, Search, ArrowRight, Building } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Departments: React.FC = () => {
  const { canEdit } = useAuth();
  const { addToast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [iconName, setIconName] = useState('Building');

  const loadData = () => ApiService.getDepartments().then(setDepartments).catch(console.error);
  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.createDepartment({ name, description: desc, icon: iconName });
      addToast('Department created successfully', 'success');
      setIsModalOpen(false);
      setName(''); setDesc(''); setIconName('Building');
      loadData();
    } catch (e) { addToast('Failed to create department', 'error'); }
  };

  // Helper to dynamically render icon
  const renderIcon = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (LucideIcons as any)[name] || LucideIcons.Building;
    return <Icon className="w-7 h-7 text-white" />;
  };

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Departments</h1>
          <p className="text-slate-500 dark:text-slate-400">Access departmental resources, SOPs, and On-Call Rosters</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Department
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-8 max-w-md relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
         <input 
            type="text" 
            placeholder="Search departments..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
         />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDepts.map(dept => (
          <Link 
            key={dept.id} 
            to={`/departments/${dept.id}`}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
               <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  {renderIcon(dept.icon)}
               </div>
               <div className="bg-slate-100 dark:bg-slate-700 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-300" />
               </div>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{dept.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">{dept.description}</p>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400 font-medium">
               <span>{dept.resources?.length || 0} Resources</span>
               <span className="text-blue-600 dark:text-blue-400">View Portal</span>
            </div>
          </Link>
        ))}
        
        {filteredDepts.length === 0 && (
           <div className="col-span-full py-12 text-center">
              <div className="bg-slate-100 dark:bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Building className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">No departments found matching your search.</p>
           </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Department">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Cardiology" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Brief description of the department..." />
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Icon Name (Lucide)</label>
             <input value={iconName} onChange={e => setIconName(e.target.value)} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Heart, Activity, Brain" />
             <p className="text-[10px] text-slate-500 mt-1">Enter a valid Lucide React icon name (Case Sensitive).</p>
          </div>
          <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
             <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">Create Department</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};