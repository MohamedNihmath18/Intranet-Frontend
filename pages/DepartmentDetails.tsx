
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { Department, DepartmentResource, UserRole } from '../types';
import { useToast } from '../context/ToastContext';
import { 
  ChevronLeft, 
  Plus, 
  FileText, 
  Users, 
  HelpCircle, 
  FileBarChart, 
  Trash2, 
  Download, 
  Briefcase, 
  Clock, 
  X, 
  Loader2, 
  Image as ImageIcon,
  Maximize2,
  Calendar
} from 'lucide-react';
import { Modal } from '../components/Modal';

const TABS = [
  { id: 'ORG_CHART', label: 'Org Chart', icon: Users, desc: 'Departmental structure and hierarchy', type: 'visual' },
  { id: 'ROSTER', label: 'On-Call Roster', icon: FileBarChart, desc: 'Department specific on-call schedules', type: 'visual' },
  { id: 'MEMO', label: 'Memorandums', icon: Briefcase, desc: 'Internal memos and circulars', type: 'doc' },
  { id: 'SOP', label: 'SOP & Policy', icon: FileText, desc: 'Standard Operating Procedures', type: 'doc' },
  { id: 'FAQ', label: 'How-to & FAQ', icon: HelpCircle, desc: 'Guides and common questions', type: 'doc' },
];

export const DepartmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [dept, setDept] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState('ORG_CHART');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Image Preview State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Resource Form
  const [resTitle, setResTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await ApiService.getDepartmentById(id);
      setDept(data);
    } catch (err: any) {
      console.error(err);
      addToast('Failed to load department details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const hasDeptPermission = useMemo(() => {
    if (!user || !dept) return false;
    return (
      user.role === UserRole.ADMIN || 
      user.department.trim().toLowerCase() === dept.name.trim().toLowerCase()
    );
  }, [user, dept]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    if (!fileUrl && activeTab !== 'FAQ') { 
      addToast('Please upload a file', 'error'); 
      return; 
    }

    setIsSubmitting(true);
    try {
      await ApiService.addDepartmentResource(id, {
        title: resTitle,
        type: activeTab,
        url: fileUrl || '#',
        fileType: fileUrl.split(';')[0].split('/')[1] || 'pdf'
      });
      addToast('Resource added successfully', 'success');
      setIsModalOpen(false);
      setResTitle(''); setFileUrl('');
      loadData();
    } catch(e: any) { 
      console.error(e);
      addToast(e.message || 'Failed to add resource', 'error'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await ApiService.deleteDepartmentResource(id, resourceId);
        addToast('Resource deleted', 'info');
        loadData();
      } catch(e: any) { 
        console.error(e);
        addToast(e.message || 'Failed to delete', 'error'); 
      }
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

  if (isLoading && !dept) return <div className="p-12 text-center text-slate-500">Loading department details...</div>;
  if (!dept) return <div className="p-12 text-center text-slate-500">Department not found</div>;

  const currentResources = dept.resources ? dept.resources.filter(r => r.type === activeTab) : [];
  const activeTabInfo = TABS.find(t => t.id === activeTab);
  const isVisualTab = activeTabInfo?.type === 'visual';

  return (
    <div className="pb-20">
      <div className="mb-6">
        <Link to="/departments" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Departments
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{dept.name}</h1>
               {!hasDeptPermission && (
                 <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                   Read Only
                 </span>
               )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">{dept.description}</p>
          </div>
          {hasDeptPermission && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add {activeTabInfo?.label}
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700 mb-8 scrollbar-thin">
        {TABS.map(tab => {
           const Icon = tab.icon;
           const isActive = activeTab === tab.id;
           return (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap relative
                 ${isActive 
                   ? 'text-blue-600 dark:text-blue-400' 
                   : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                 }`}
             >
               <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
               {tab.label}
               {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />}
             </button>
           );
        })}
      </div>

      {/* Grid Content */}
      {isVisualTab ? (
        // LARGE VISUAL VIEW (Org Chart & On-Call Roster)
        <div className="space-y-12">
          {currentResources.map(res => (
            <div 
              key={res._id || res.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
               {/* Resource Header */}
               <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/20">
                  <div className="flex items-center gap-3">
                     <button 
                       onClick={() => setPreviewImage(res.url)}
                       className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
                       title="View Full Screen"
                     >
                        <Maximize2 className="w-5 h-5" />
                     </button>
                     <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{res.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                           <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Updated {new Date(res.date).toLocaleDateString()}</span>
                           <span>•</span>
                           <span className="font-medium text-slate-600 dark:text-slate-300">By {res.uploadedBy}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <a 
                       href={res.url} 
                       download={res.title}
                       className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                     >
                       <Download className="w-4 h-4" /> Download
                     </a>
                     {hasDeptPermission && (
                       <button 
                         onClick={() => handleDeleteResource(res._id || res.id!)}
                         className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                         title="Delete"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                     )}
                  </div>
               </div>

               {/* Full-Size Image Container */}
               <div 
                 className="p-2 sm:p-4 bg-slate-100 dark:bg-slate-900 flex justify-center items-center cursor-zoom-in"
                 onClick={() => setPreviewImage(res.url)}
               >
                  <div className="w-full relative rounded-xl overflow-hidden shadow-inner bg-white dark:bg-slate-800 flex items-center justify-center min-h-[400px]">
                    {res.url.startsWith('data:image') || res.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || res.url.startsWith('http') ? (
                      <img 
                        src={res.url} 
                        alt={res.title} 
                        className="max-w-full h-auto block hover:scale-[1.01] transition-transform duration-500" 
                      />
                    ) : (
                      <div className="p-12 text-center">
                         <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                         <p className="text-slate-500 font-medium">This document must be downloaded to view</p>
                         <a href={res.url} download className="text-blue-600 font-bold hover:underline mt-2 inline-block">Click here to download</a>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        // DOCUMENT LIST VIEW (Memos, SOP, FAQ)
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
               <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold">
                 <tr>
                   <th className="px-6 py-5">Title</th>
                   <th className="px-6 py-5">Uploaded By</th>
                   <th className="px-6 py-5">Date</th>
                   <th className="px-6 py-5 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                 {currentResources.map(res => (
                   <tr key={res._id || res.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                     <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                           <FileText className="w-5 h-5" />
                         </div>
                         <span className="font-bold text-slate-900 dark:text-white">{res.title}</span>
                       </div>
                     </td>
                     <td className="px-6 py-5 font-medium">{res.uploadedBy}</td>
                     <td className="px-6 py-5 text-slate-500 dark:text-slate-400">{new Date(res.date).toLocaleDateString()}</td>
                     <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <a 
                           href={res.url} 
                           download={res.title}
                           className="p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                           title="Download"
                         >
                           <Download className="w-5 h-5" />
                         </a>
                         <button 
                           onClick={() => setPreviewImage(res.url)}
                           className="p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                           title="Preview"
                         >
                           <Maximize2 className="w-5 h-5" />
                         </button>
                         {hasDeptPermission && (
                           <button 
                             onClick={() => handleDeleteResource(res._id || res.id!)}
                             className="p-2.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                             title="Delete"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                         )}
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}
      
      {/* Empty State */}
      {currentResources.length === 0 && (
        <div className="col-span-full text-center py-24 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 mt-4">
           <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-700">
              <ImageIcon className="w-10 h-10 text-slate-200 dark:text-slate-600" />
           </div>
           <h3 className="text-slate-800 dark:text-white text-xl font-bold mb-2">No {activeTabInfo?.label} Uploaded</h3>
           <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-xs mx-auto">This section is currently empty. Resources uploaded will be displayed here.</p>
           {hasDeptPermission && (
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                Upload First Resource
              </button>
           )}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Upload ${activeTabInfo?.label}`}>
         <form onSubmit={handleAddResource} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Resource Title</label>
              <input 
                required 
                value={resTitle} 
                onChange={e => setResTitle(e.target.value)} 
                className="w-full p-3.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                placeholder={`e.g. ${activeTab === 'ORG_CHART' ? 'Department Org Chart V2' : 'Specialist Roster - Dec 2024'}`} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Choose File</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all relative group cursor-pointer">
                 <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                 <div className="flex flex-col items-center">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-base text-blue-600 dark:text-blue-400 font-bold">Select high-quality image or PDF</p>
                    <p className="text-xs text-slate-400 mt-2">Maximum file size: 10MB</p>
                 </div>
              </div>
              {fileUrl && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-700 dark:text-green-300 font-bold uppercase tracking-tight">Ready for upload</span>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 gap-3">
               <button 
                 type="button" 
                 onClick={() => setIsModalOpen(false)} 
                 className="px-6 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors font-bold"
               >
                 Cancel
               </button>
               <button 
                 type="submit" 
                 disabled={isSubmitting} 
                 className="bg-blue-600 text-white px-10 py-3 rounded-xl hover:bg-blue-700 font-bold shadow-lg active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                 {isSubmitting ? 'Uploading...' : 'Publish Resource'}
               </button>
            </div>
         </form>
      </Modal>

      {/* IMMERSIVE PREVIEW OVERLAY */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => setPreviewImage(null)}
        >
           <button 
             className="absolute top-6 right-6 text-white/50 hover:text-white transition-all p-3 bg-white/10 hover:bg-white/20 rounded-full group" 
             onClick={() => setPreviewImage(null)}
           >
             <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
           </button>
           
           <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
             {previewImage.startsWith('data:image') || previewImage.match(/\.(jpg|jpeg|png|gif|webp)$/i) || previewImage.startsWith('http') ? (
               <img 
                 src={previewImage} 
                 alt="Preview" 
                 className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-500 border border-white/10"
               />
             ) : (
               <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl text-center max-w-md shadow-2xl border border-slate-200 dark:border-slate-700">
                 <FileText className="w-20 h-20 text-blue-500 mx-auto mb-6" />
                 <h3 className="text-2xl font-bold mb-4 dark:text-white">Full View Required</h3>
                 <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">This document format is best viewed after downloading.</p>
                 <a 
                   href={previewImage} 
                   download 
                   className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 font-bold shadow-xl shadow-blue-500/20 active:scale-95"
                 >
                    <Download className="w-5 h-5" /> Download Document
                 </a>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};