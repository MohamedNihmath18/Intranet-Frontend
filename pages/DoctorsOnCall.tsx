// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { ApiService } from '../services/apiService';
// import { OnCallRoster } from '../types';
// import { useToast } from '../context/ToastContext';
// import { Plus, Trash2, Calendar, FileImage, Download, UploadCloud, RefreshCw, User, Loader2 } from 'lucide-react';
// import { Modal } from '../components/Modal';

// export const DoctorsOnCall: React.FC = () => {
//   const { canEdit } = useAuth();
//   const { addToast } = useToast();
//   const [rosters, setRosters] = useState<OnCallRoster[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
  
//   // Form State
//   const [title, setTitle] = useState('');
//   const [month, setMonth] = useState('');
//   const [fileUrl, setFileUrl] = useState('');
  
//   const loadData = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await ApiService.getOnCalls();
//       setRosters(data);
//     } catch (err: any) {
//       console.error("Load Data Error:", err);
//       setError(err.message || "Failed to connect to server");
//       addToast('Could not load rosters. Ensure backend is running.', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   useEffect(() => { loadData(); }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!fileUrl) { addToast('Please upload a roster image', 'error'); return; }
//     if (!title.trim()) { addToast('Title is required', 'error'); return; }
//     if (!month.trim()) { addToast('Month/Period is required', 'error'); return; }

//     setIsSubmitting(true);
//     try {
//       await ApiService.createOnCall({ title, month, fileUrl, fileType: 'img' });
//       addToast('Roster uploaded successfully', 'success');
//       setIsModalOpen(false);
//       setTitle(''); setFileUrl(''); setMonth('');
//       loadData();
//     } catch (e: any) { 
//       console.error("Upload error:", e);
//       addToast(e.message || 'Failed to upload roster. Try logging in again.', 'error'); 
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if(window.confirm('Delete this roster?')) {
//       try {
//         await ApiService.deleteOnCall(id);
//         addToast('Roster deleted', 'info');
//         loadData();
//       } catch(e: any) { addToast(e.message || 'Failed to delete', 'error'); }
//     }
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5000000) {
//         addToast('Image too large (max 5MB)', 'error');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => setFileUrl(reader.result as string);
//       reader.readAsDataURL(file);
      
//       if (!title) {
//         const name = file.name.split('.')[0];
//         setTitle(name.charAt(0).toUpperCase() + name.slice(1).replace(/[_-]/g, ' '));
//       }
//     }
//   };

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Doctors On-Call</h1>
//           <p className="text-slate-500 dark:text-slate-400">Monthly general doctors roster and availability schedules</p>
//         </div>
//         {canEdit && (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
//           >
//             <Plus className="w-4 h-4" /> Upload Roster
//           </button>
//         )}
//       </div>

//       {error && (
//         <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mb-6">
//           <p className="text-red-600 dark:text-red-400 mb-2 font-medium">Unable to load rosters.</p>
//           <p className="text-red-500 dark:text-red-300 text-sm mb-4">{error}</p>
//           <button onClick={loadData} className="flex items-center gap-2 mx-auto text-blue-600 hover:underline bg-white dark:bg-slate-800 px-4 py-2 rounded shadow-sm">
//             <RefreshCw className="w-4 h-4" /> Retry Connection
//           </button>
//         </div>
//       )}

//       {isLoading && !error && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//            {[1,2,3].map(i => (
//              <div key={i} className="h-80 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
//            ))}
//         </div>
//       )}

//       {!isLoading && !error && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {rosters.map(roster => (
//             <div key={roster.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all group flex flex-col">
//               <div className="h-56 bg-slate-100 dark:bg-slate-700 relative overflow-hidden border-b border-slate-100 dark:border-slate-700">
//                  <img src={roster.fileUrl} alt={roster.title} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
//                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 
//                  {canEdit && (
//                     <button 
//                       onClick={() => handleDelete(roster.id)} 
//                       className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 text-red-600 p-2 rounded-full shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
//                       title="Delete Roster"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                  )}
//               </div>
//               <div className="p-5 flex-1 flex flex-col">
//                 <div className="mb-4 flex-1">
//                   <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1 mb-1">{roster.title}</h3>
//                   <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-slate-400 gap-y-1">
//                      <span className="flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full mr-2">
//                        <Calendar className="w-3 h-3 mr-1" /> {roster.month}
//                      </span>
//                      {roster.uploadedBy && (
//                        <span className="flex items-center">
//                          <User className="w-3 h-3 mr-1" /> {roster.uploadedBy}
//                        </span>
//                      )}
//                   </div>
//                 </div>
//                 <a 
//                   href={roster.fileUrl} 
//                   download={roster.title}
//                   className="flex items-center justify-center w-full py-2.5 bg-slate-50 hover:bg-blue-50 dark:bg-slate-700/50 dark:hover:bg-blue-900/20 text-slate-700 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300 font-medium rounded-lg transition-colors border border-slate-200 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-800"
//                 >
//                   <Download className="w-4 h-4 mr-2" /> Download Roster
//                 </a>
//               </div>
//             </div>
//           ))}
          
//           {rosters.length === 0 && (
//              <div className="col-span-full text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
//                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
//                  <FileImage className="w-8 h-8 text-slate-400 dark:text-slate-500" />
//                </div>
//                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No rosters available</h3>
//                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">There are currently no on-call rosters uploaded for this month.</p>
//                {canEdit && (
//                  <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-700 font-medium">Upload New Roster</button>
//                )}
//              </div>
//           )}
//         </div>
//       )}

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload On-Call Roster">
//          <form onSubmit={handleSubmit} className="space-y-5">
//            <div>
//              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Roster Image</label>
//              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-800">
//                 <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
//                 <div className="space-y-2 pointer-events-none">
//                    <UploadCloud className="w-10 h-10 mx-auto text-blue-500 opacity-80" />
//                    <p className="text-sm text-slate-900 dark:text-white font-medium">Click to upload image</p>
//                    <p className="text-xs text-slate-500">Supported: JPG, PNG (Max 5MB)</p>
//                 </div>
//              </div>
//              {fileUrl && (
//                 <div className="mt-3 relative h-40 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
//                    <img src={fileUrl} alt="Preview" className="w-full h-full object-cover" />
//                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">Preview</div>
//                 </div>
//              )}
//            </div>
           
//            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//              <div>
//                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
//                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. ED Roster March" />
//              </div>
//              <div>
//                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Month/Period</label>
//                <input required value={month} onChange={e => setMonth(e.target.value)} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. March 2024" />
//              </div>
//            </div>
           
//            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
//               <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
//               <button 
//                 type="submit" 
//                 disabled={isSubmitting}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm transform active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
//                 {isSubmitting ? 'Uploading...' : 'Upload Roster'}
//               </button>
//            </div>
//          </form>
//       </Modal>
//     </div>
//   );
// };

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { OnCallRoster } from '../types';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2, Calendar, Search, RefreshCw, User, Stethoscope, Filter, X, Loader2, AlertCircle, Clock } from 'lucide-react';
import { Modal } from '../components/Modal';

export const DoctorsOnCall: React.FC = () => {
  const { canEdit } = useAuth();
  const { addToast } = useToast();
  const [rosters, setRosters] = useState<OnCallRoster[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchName, setSearchName] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Form State
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.getOnCalls();
      // Filter out old legacy data (that might have fileUrl but no doctorName) to prevent crashes
      const validData = data.filter(d => d.doctorName); 
      setRosters(validData);
    } catch (err: any) {
      console.error("Load Data Error:", err);
      setError(err.message || "Failed to connect to server");
      addToast('Could not load rosters.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctorName.trim()) { addToast('Doctor Name is required', 'error'); return; }
    if (!specialty.trim()) { addToast('Specialty is required', 'error'); return; }
    if (!date) { addToast('Date is required', 'error'); return; }

    setIsSubmitting(true);
    try {
      await ApiService.createOnCall({ doctorName, specialty, date });
      addToast('On-Call entry added successfully', 'success');
      setIsModalOpen(false);
      // Reset Form
      setDoctorName(''); setSpecialty(''); setDate('');
      loadData();
    } catch (e: any) { 
      console.error("Submit error:", e);
      addToast(e.message || 'Failed to add entry.', 'error'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Delete this entry?')) {
      try {
        await ApiService.deleteOnCall(id);
        addToast('Entry deleted', 'info');
        loadData();
      } catch(e: any) { addToast(e.message || 'Failed to delete', 'error'); }
    }
  };

  // Filter Data
  const filteredRosters = useMemo(() => {
    return rosters.filter(item => {
      const matchesName = item.doctorName.toLowerCase().includes(searchName.toLowerCase());
      const matchesSpecialty = filterSpecialty ? item.specialty === filterSpecialty : true;
      const matchesDate = filterDate ? item.date === filterDate : true;
      return matchesName && matchesSpecialty && matchesDate;
    });
  }, [rosters, searchName, filterSpecialty, filterDate]);

  // Group Data by Specialty
  const groupedRosters = useMemo(() => {
    const groups: Record<string, OnCallRoster[]> = {};
    filteredRosters.forEach(item => {
      if (!groups[item.specialty]) {
        groups[item.specialty] = [];
      }
      groups[item.specialty].push(item);
    });
    // Sort items within groups by date
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
    return groups;
  }, [filteredRosters]);

  const specialties = useMemo(() => {
    const unique = new Set(rosters.map(r => r.specialty));
    return Array.from(unique).sort();
  }, [rosters]);

  const clearFilters = () => {
    setSearchName('');
    setFilterSpecialty('');
    setFilterDate('');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Doctors On-Call</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and view daily on-call schedules</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-4 items-center sticky top-0 z-10">
        <div className="relative w-full md:w-1/3">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search doctor name..." 
             value={searchName}
             onChange={e => setSearchName(e.target.value)}
             className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
           />
        </div>
        <div className="relative w-full md:w-1/4">
           <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <select 
             value={filterSpecialty}
             onChange={e => setFilterSpecialty(e.target.value)}
             className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none"
           >
             <option value="">All Specialties</option>
             {specialties.map(s => <option key={s} value={s}>{s}</option>)}
           </select>
        </div>
        <div className="relative w-full md:w-1/4">
           <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="date" 
             value={filterDate}
             onChange={e => setFilterDate(e.target.value)}
             className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
           />
        </div>
        {(searchName || filterSpecialty || filterDate) && (
          <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 whitespace-nowrap px-2">
            <X className="w-4 h-4" /> Clear Filters
          </button>
        )}
      </div>

      {error && (
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mb-6">
          <p className="text-red-600 dark:text-red-400 mb-2 font-medium">Unable to load data.</p>
          <button onClick={loadData} className="flex items-center gap-2 mx-auto text-blue-600 hover:underline bg-white dark:bg-slate-800 px-4 py-2 rounded shadow-sm">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {isLoading && !error && (
        <div className="space-y-8">
           {[1,2].map(i => (
             <div key={i} className="space-y-4">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                   <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                   <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                </div>
             </div>
           ))}
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-10">
          {Object.entries(groupedRosters).map(([specialtyGroup, items]) => (
            <div key={specialtyGroup} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                  <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm">
                     <Stethoscope className="w-5 h-5" />
                  </span>
                  {specialtyGroup}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                    {items.length} Doctors
                  </span>
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group relative">
                       {canEdit && (
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="absolute top-3 right-3 text-slate-300 hover:text-red-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       )}
                       
                       <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                             <User className="w-6 h-6" />
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{item.doctorName}</h3>
                             <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Added by {item.uploadedBy?.split(' ')[0]}</p>
                          </div>
                       </div>
                       
                       <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
                          <div className="flex items-center text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg w-full justify-center font-medium">
                             <Clock className="w-4 h-4 mr-2 text-slate-400" />
                             {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}

          {Object.keys(groupedRosters).length === 0 && (
             <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                   <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No On-Call Entries Found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                   There are no doctors scheduled matching your current filters.
                </p>
                {canEdit && (
                   <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      Add a new on-call entry
                   </button>
                )}
             </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add On-Call Entry">
         <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Doctor Name</label>
             <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required 
                  value={doctorName} 
                  onChange={e => setDoctorName(e.target.value)} 
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. Dr. Sarah Smith" 
                />
             </div>
           </div>
           
           <div>
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Specialty</label>
             <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required 
                  value={specialty} 
                  onChange={e => setSpecialty(e.target.value)} 
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. Cardiology" 
                  list="specialties-list"
                />
                <datalist id="specialties-list">
                   {specialties.map(s => <option key={s} value={s} />)}
                </datalist>
             </div>
           </div>

           <div>
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
             <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date"
                  required 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                />
             </div>
           </div>
           
           <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm transform active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {isSubmitting ? 'Adding...' : 'Add Entry'}
              </button>
           </div>
         </form>
      </Modal>
    </div>
  );
};