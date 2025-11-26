// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { ApiService } from '../services/apiService';
// import { LinkItem } from '../types';
// import { useToast } from '../context/ToastContext';
// import { ExternalLink, Plus, Trash2, Globe, Briefcase, Wrench, Users } from 'lucide-react';
// import { Modal } from '../components/Modal';

// export const LinksPage: React.FC = () => {
//   const { canEdit, user } = useAuth();
//   const { addToast } = useToast();
//   const [links, setLinks] = useState<LinkItem[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const [title, setTitle] = useState('');
//   const [url, setUrl] = useState('');
//   const [category, setCategory] = useState<LinkItem['category']>('Internal');
//   const [desc, setDesc] = useState('');

//   const loadData = async () => {
//     try {
//       setLinks(await ApiService.getLinks());
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
//   useEffect(() => { loadData(); }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;
//     try {
//       await ApiService.createLink({ title, url, category, description: desc });
//       addToast('Link added', 'success');
//       setIsModalOpen(false);
//       setTitle(''); setUrl(''); setDesc('');
//       loadData();
//     } catch (error) {
//       addToast('Failed to add link', 'error');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!user) return;
//     if(window.confirm('Delete link?')) {
//       try {
//         await ApiService.deleteLink(id);
//         loadData();
//       } catch (error) {
//         addToast('Failed to delete link', 'error');
//       }
//     }
//   };

//   const categories = ['Internal', 'External', 'Tools', 'HR'];

//   const getCategoryIcon = (cat: string) => {
//     switch(cat) {
//       case 'Internal': return <Briefcase className="w-5 h-5 text-blue-500" />;
//       case 'External': return <Globe className="w-5 h-5 text-green-500" />;
//       case 'Tools': return <Wrench className="w-5 h-5 text-orange-500" />;
//       case 'HR': return <Users className="w-5 h-5 text-purple-500" />;
//       default: return <ExternalLink className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   return (
//     <div>
//        <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Links & Resources</h1>
//           <p className="text-slate-500 dark:text-slate-400">Quick access to tools and portals</p>
//         </div>
//         {canEdit && (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
//           >
//             <Plus className="w-4 h-4" /> Add Link
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {categories.map(cat => {
//           const catLinks = links.filter(l => l.category === cat);
//           if (catLinks.length === 0) return null;
          
//           return (
//             <div key={cat} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
//               <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
//                  {getCategoryIcon(cat)}
//                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{cat}</h3>
//               </div>
//               <ul className="space-y-3">
//                 {catLinks.map(link => (
//                   <li key={link.id} className="flex items-start justify-between group">
//                     <div>
//                       <a href={link.url} className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
//                         {link.title} <ExternalLink className="w-3 h-3" />
//                       </a>
//                       {link.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{link.description}</p>}
//                     </div>
//                     {canEdit && (
//                        <button onClick={() => handleDelete(link.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
//                           <Trash2 className="w-4 h-4" />
//                        </button>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )
//         })}
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Link">
//          <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
//               <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL</label>
//               <input required value={url} onChange={e => setUrl(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="https://..." />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
//               <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
//                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
//               <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
//             </div>
//             <div className="flex justify-end mt-4">
//                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save</button>
//             </div>
//          </form>
//       </Modal>
//     </div>
//   );
// }

// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { ApiService } from '../services/apiService';
// import { LinkItem } from '../types';
// import { useToast } from '../context/ToastContext';
// import * as LucideIcons from 'lucide-react';
// import { ExternalLink, Plus, Trash2, Globe, Briefcase, Wrench, Users, Link as LinkIcon, FileCheck, ClipboardList, GraduationCap, Headphones } from 'lucide-react';
// import { Modal } from '../components/Modal';

// export const LinksPage: React.FC = () => {
//   const { canEdit, user } = useAuth();
//   const { addToast } = useToast();
//   const [links, setLinks] = useState<LinkItem[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const [title, setTitle] = useState('');
//   const [url, setUrl] = useState('');
//   const [category, setCategory] = useState<LinkItem['category']>('Internal');
//   const [desc, setDesc] = useState('');
//   const [customIcon, setCustomIcon] = useState('');

//   const loadData = () => ApiService.getLinks().then(setLinks).catch(console.error);
//   useEffect(() => { loadData(); }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;
//     try {
//       await ApiService.createLink({ title, url, category, description: desc, icon: customIcon });
//       addToast('Link added', 'success');
//       setIsModalOpen(false);
//       setTitle(''); setUrl(''); setDesc(''); setCustomIcon('');
//       loadData();
//     } catch(e) { addToast('Failed to add link', 'error'); }
//   };

//   const handleDelete = async (id: string) => {
//     if (!user) return;
//     if(window.confirm('Delete link?')) {
//       try {
//         await ApiService.deleteLink(id);
//         addToast('Link deleted', 'info');
//         loadData();
//       } catch(e) { addToast('Failed to delete', 'error'); }
//     }
//   };

//   const categories = ['Internal', 'External', 'Tools', 'HR', 'Policies', 'Forms', 'Training', 'IT Support'];

//   const getCategoryIcon = (cat: string) => {
//     switch(cat) {
//       case 'Internal': return <Briefcase className="w-6 h-6" />;
//       case 'External': return <Globe className="w-6 h-6" />;
//       case 'Tools': return <Wrench className="w-6 h-6" />;
//       case 'HR': return <Users className="w-6 h-6" />;
//       case 'Policies': return <FileCheck className="w-6 h-6" />;
//       case 'Forms': return <ClipboardList className="w-6 h-6" />;
//       case 'Training': return <GraduationCap className="w-6 h-6" />;
//       case 'IT Support': return <Headphones className="w-6 h-6" />;
//       default: return <LinkIcon className="w-6 h-6" />;
//     }
//   };

//   // Function to render specific link icon if present, otherwise default icon
//   const renderLinkIcon = (iconName?: string) => {
//     if (!iconName) return <ExternalLink className="w-3 h-3 opacity-50" />;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const Icon = (LucideIcons as any)[iconName];
//     if (!Icon) return <ExternalLink className="w-3 h-3 opacity-50" />;
//     return <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
//   };

//   const getCategoryColor = (cat: string) => {
//     switch(cat) {
//       case 'Internal': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300';
//       case 'External': return 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300';
//       case 'Tools': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300';
//       case 'HR': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300';
//       case 'Policies': return 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300';
//       case 'Forms': return 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300';
//       case 'Training': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300';
//       case 'IT Support': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300';
//       default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
//     }
//   };

//   return (
//     <div>
//        <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Links & Resources</h1>
//           <p className="text-slate-500 dark:text-slate-400">Quick access to essential tools and portals</p>
//         </div>
//         {canEdit && (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
//           >
//             <Plus className="w-4 h-4" /> Add Link
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {categories.map(cat => {
//           const catLinks = links.filter(l => l.category === cat);
          
//           return (
//             <div key={cat} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
//               <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50">
//                  <div className={`p-3 rounded-xl ${getCategoryColor(cat)} shadow-sm`}>
//                    {getCategoryIcon(cat)}
//                  </div>
//                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{cat}</h3>
//               </div>
//               <div className="p-4 flex-1">
//                 {catLinks.length > 0 ? (
//                   <ul className="space-y-2">
//                     {catLinks.map(link => (
//                       <li key={link.id} className="group relative rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors p-3 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                               <a 
//                                 href={link.url} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 className="font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 mb-1"
//                               >
//                                 {renderLinkIcon(link.icon)} {link.title} 
//                               </a>
//                               {link.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pl-6">{link.description}</p>}
//                           </div>
//                           {canEdit && (
//                               <button 
//                                 onClick={() => handleDelete(link.id)} 
//                                 className="ml-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
//                                 title="Delete Link"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                           )}
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="h-full flex items-center justify-center text-slate-400 text-sm italic p-4">
//                     No links in this category.
//                   </div>
//                 )}
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Link">
//          <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
//               <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="e.g. Employee Portal" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL</label>
//               <input required value={url} onChange={e => setUrl(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="https://..." />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
//                 <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
//                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom Icon (Optional)</label>
//                 <input value={customIcon} onChange={e => setCustomIcon(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="e.g. User, Home, Settings" />
//                 <p className="text-[10px] text-slate-500 mt-1">Valid Lucide icon name</p>
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
//               <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
//             </div>
//             <div className="flex justify-end mt-4">
//                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save</button>
//             </div>
//          </form>
//       </Modal>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { LinkItem } from '../types';
import { useToast } from '../context/ToastContext';
import * as LucideIcons from 'lucide-react';
import { ExternalLink, Plus, Trash2, Globe, Briefcase, Wrench, Users, Link as LinkIcon, FileCheck, ClipboardList, GraduationCap, Headphones } from 'lucide-react';
import { Modal } from '../components/Modal';

export const LinksPage: React.FC = () => {
  const { canEdit, user } = useAuth();
  const { addToast } = useToast();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<LinkItem['category']>('Internal');
  const [desc, setDesc] = useState('');
  const [customIcon, setCustomIcon] = useState('');

  const loadData = () => ApiService.getLinks().then(setLinks).catch(console.error);
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await ApiService.createLink({ title, url, category, description: desc, icon: customIcon });
      addToast('Link added', 'success');
      setIsModalOpen(false);
      setTitle(''); setUrl(''); setDesc(''); setCustomIcon('');
      loadData();
    } catch(e) { addToast('Failed to add link', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if(window.confirm('Delete link?')) {
      try {
        await ApiService.deleteLink(id);
        addToast('Link deleted', 'info');
        loadData();
      } catch(e) { addToast('Failed to delete', 'error'); }
    }
  };

  const categories = ['Internal', 'External', 'Tools', 'HR', 'Policies', 'Forms', 'Training', 'IT Support'];

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Internal': return <Briefcase className="w-6 h-6" />;
      case 'External': return <Globe className="w-6 h-6" />;
      case 'Tools': return <Wrench className="w-6 h-6" />;
      case 'HR': return <Users className="w-6 h-6" />;
      case 'Policies': return <FileCheck className="w-6 h-6" />;
      case 'Forms': return <ClipboardList className="w-6 h-6" />;
      case 'Training': return <GraduationCap className="w-6 h-6" />;
      case 'IT Support': return <Headphones className="w-6 h-6" />;
      default: return <LinkIcon className="w-6 h-6" />;
    }
  };

  // Enhanced function to render link icon: supports Image URL or Lucide Icon Name
  const renderLinkIcon = (iconString?: string) => {
    if (!iconString) return <ExternalLink className="w-4 h-4 opacity-50" />;

    // Check if it's a URL (basic check)
    if (iconString.startsWith('http') || iconString.startsWith('data:image')) {
      return (
        <img 
          src={iconString} 
          alt="icon" 
          className="w-10 h-10 object-contain rounded-sm mr-1"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }} 
        />
      );
    }

    // Fallback to Lucide Icon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (LucideIcons as any)[iconString];
    if (!Icon) return <ExternalLink className="w-4 h-4 opacity-50" />;
    return <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Internal': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300';
      case 'External': return 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300';
      case 'Tools': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300';
      case 'HR': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300';
      case 'Policies': return 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300';
      case 'Forms': return 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300';
      case 'Training': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'IT Support': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Links & Resources</h1>
          <p className="text-slate-500 dark:text-slate-400">Quick access to essential tools and portals</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Link
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const catLinks = links.filter(l => l.category === cat);
          
          return (
            <div key={cat} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50">
                 <div className={`p-3 rounded-xl ${getCategoryColor(cat)} shadow-sm`}>
                   {getCategoryIcon(cat)}
                 </div>
                 <h3 className="font-bold text-lg text-slate-800 dark:text-white">{cat}</h3>
              </div>
              <div className="p-4 flex-1">
                {catLinks.length > 0 ? (
                  <ul className="space-y-2">
                    {catLinks.map(link => (
                      <li key={link.id} className="group relative rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors p-3 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 mb-1"
                              >
                                {renderLinkIcon(link.icon)} 
                                <span>{link.title}</span>
                              </a>
                              {link.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pl-7">{link.description}</p>}
                          </div>
                          {canEdit && (
                              <button 
                                onClick={() => handleDelete(link.id)} 
                                className="ml-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                                title="Delete Link"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm italic p-4">
                    No links in this category.
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Link">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="e.g. EMR System" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL</label>
              <input required value={url} onChange={e => setUrl(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Icon (Name or URL)</label>
                <input value={customIcon} onChange={e => setCustomIcon(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="e.g. 'Heart' or 'https://logo.com/img.png'" />
                <p className="text-[10px] text-slate-500 mt-1">Enter a Lucide icon name OR an image URL.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
            </div>
            <div className="flex justify-end mt-4">
               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};