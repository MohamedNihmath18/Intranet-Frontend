import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { Department } from '../types';
import { useToast } from '../context/ToastContext';
import { ChevronLeft, Plus, FileText, Users, HelpCircle, FileBarChart, Trash2, Download, Briefcase, Clock } from 'lucide-react';
import { Modal } from '../components/Modal';

const TABS = [
  { id: 'ORG_CHART', label: 'Org Chart', icon: Users, desc: 'Departmental structure and hierarchy' },
  { id: 'ROSTER', label: 'On-Call Roster', icon: FileBarChart, desc: 'Monthly on-call schedules' },
  { id: 'MEMO', label: 'Memorandums', icon: Briefcase, desc: 'Internal memos and circulars' },
  { id: 'SOP', label: 'SOP & Policy', icon: FileText, desc: 'Standard Operating Procedures' },
  { id: 'FAQ', label: 'How-to & FAQ', icon: HelpCircle, desc: 'Guides and common questions' },
];

export const DepartmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { canEdit } = useAuth();
  const { addToast } = useToast();
  const [dept, setDept] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState('ORG_CHART');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Resource Form
  const [resTitle, setResTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  
  const loadData = () => {
    if (id) ApiService.getDepartmentById(id).then(setDept).catch(console.error);
  };

  useEffect(() => { loadData(); }, [id]);

  if (!dept) return <div className="p-12 text-center text-slate-500">Loading department details...</div>;

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!fileUrl && activeTab !== 'FAQ') { addToast('Please upload a file', 'error'); return; }

    try {
      await ApiService.addDepartmentResource(id, {
        title: resTitle,
        type: activeTab,
        url: fileUrl || '#',
        fileType: 'pdf' // Simplified for now
      });
      addToast('Resource added successfully', 'success');
      setIsModalOpen(false);
      setResTitle(''); setFileUrl('');
      loadData();
    } catch(e) { addToast('Failed to add resource', 'error'); }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await ApiService.deleteDepartmentResource(id, resourceId);
        addToast('Resource deleted', 'info');
        loadData();
      } catch(e) { addToast('Failed to delete', 'error'); }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFileUrl(reader.result as string);
      reader.readAsDataURL(file);
      if(!resTitle) setResTitle(file.name.split('.')[0]);
    }
  };

  const currentResources = dept.resources ? dept.resources.filter(r => r.type === activeTab) : [];
  const activeTabInfo = TABS.find(t => t.id === activeTab);

  return (
    <div>
      <div className="mb-6">
        <Link to="/departments" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Departments
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{dept.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">{dept.description}</p>
          </div>
          {canEdit && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add {activeTabInfo?.label}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700 mb-6 scrollbar-thin">
        {TABS.map(tab => {
           const Icon = tab.icon;
           const isActive = activeTab === tab.id;
           return (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-all whitespace-nowrap relative
                 ${isActive 
                   ? 'text-blue-600 dark:text-blue-400' 
                   : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                 }`}
             >
               <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
               {tab.label}
               {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />}
             </button>
           );
        })}
      </div>

      {/* Content Header */}
      <div className="mb-6">
         <h2 className="text-lg font-bold text-slate-800 dark:text-white">{activeTabInfo?.label}</h2>
         <p className="text-sm text-slate-500 dark:text-slate-400">{activeTabInfo?.desc}</p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentResources.map(res => (
          <div key={res._id || res.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-md transition-all group">
             <div>
               <div className="flex items-start justify-between mb-3">
                 <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                   {activeTab === 'ORG_CHART' ? <Users className="w-5 h-5" /> : 
                    activeTab === 'ROSTER' ? <FileBarChart className="w-5 h-5" /> :
                    <FileText className="w-5 h-5" />}
                 </div>
                 {canEdit && (
                   <button 
                    onClick={() => handleDeleteResource(res._id || res.id!)} 
                    className="text-slate-300 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 )}
               </div>
               <h3 className="font-semibold text-slate-800 dark:text-white mb-1 line-clamp-2">{res.title}</h3>
               <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(res.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{res.uploadedBy}</span>
               </div>
             </div>
             <a 
               href={res.url} 
               download={res.title}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center justify-center w-full py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
             >
               <Download className="w-4 h-4 mr-2" /> Download / View
             </a>
          </div>
        ))}
        
        {currentResources.length === 0 && (
          <div className="col-span-full text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
             <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-slate-400" />
             </div>
             <p className="text-slate-500 dark:text-slate-400">No items found in this section.</p>
             {canEdit && <button onClick={() => setIsModalOpen(true)} className="text-sm text-blue-600 hover:underline mt-1">Upload the first one</button>}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Upload to ${activeTabInfo?.label}`}>
         <form onSubmit={handleAddResource} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Resource Title</label>
              <input required value={resTitle} onChange={e => setResTitle(e.target.value)} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder={`e.g. ${activeTab === 'ORG_CHART' ? 'Org Chart 2024' : 'Q1 Schedule'}`} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Upload File</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative">
                 <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                 <div className="text-center">
                    <Download className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                    <p className="text-sm text-blue-600">Choose a file</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, Images, Docs</p>
                 </div>
              </div>
              {fileUrl && <p className="text-xs text-green-600 mt-2 flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-1" /> File selected successfully</p>}
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
               <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
               <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">Upload</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};