import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { DocumentItem } from '../types';
import { useToast } from '../context/ToastContext';
import { FileText, Download, Trash2, Plus, FileSpreadsheet, File, FileImage, Search, Filter, UploadCloud, X } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Documents: React.FC = () => {
  const { canEdit, user } = useAuth();
  const { addToast } = useToast();
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [type, setType] = useState<'pdf'|'doc'|'xls'|'img'>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadData = async () => {
    try {
      setDocs(await ApiService.getDocuments());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setTitle(nameWithoutExt);
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['pdf'].includes(ext || '')) setType('pdf');
      else if (['doc', 'docx'].includes(ext || '')) setType('doc');
      else if (['xls', 'xlsx', 'csv'].includes(ext || '')) setType('xls');
      else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) setType('img');
      else setType('doc');
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setTitle('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let fileSize = '0 KB';
    let fileName = '';

    if (selectedFile) {
      if (selectedFile.size < 1024 * 1024) {
        fileSize = (selectedFile.size / 1024).toFixed(0) + ' KB';
      } else {
        fileSize = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';
      }
      fileName = selectedFile.name;
    } else {
       fileSize = `${Math.floor(Math.random() * 5000) + 100} KB`; 
       fileName = `${title.replace(/\s+/g, '_')}.${type === 'img' ? 'jpg' : type}`;
    }

    try {
      await ApiService.createDocument({
        title,
        category,
        type,
        size: fileSize,
        fileName: fileName
      });
      addToast('Document added successfully', 'success');
      closeModal();
      loadData();
    } catch (error) {
      addToast('Failed to upload document', 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setCategory('General');
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm('Delete this document?')) {
      try {
        await ApiService.deleteDocument(id);
        addToast('Document deleted', 'info');
        loadData();
      } catch (error) {
        addToast('Failed to delete document', 'error');
      }
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    addToast(`Starting download: ${doc.fileName || doc.title}...`, 'info');
    setTimeout(() => {
      addToast(`Download complete: ${doc.fileName || doc.title}`, 'success');
    }, 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'xls': return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
      case 'img': return <FileImage className="w-8 h-8 text-purple-500" />;
      default: return <File className="w-8 h-8 text-blue-500" />;
    }
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filterCategories = ['All', 'General', 'Medical', 'HR', 'Finance', 'IT', 'Marketing'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Documents</h1>
          <p className="text-slate-500 dark:text-slate-400">Central repository for policies and templates</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Upload Document
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors shadow-sm"
          />
        </div>
        <div className="relative w-full sm:w-56">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
           </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white appearance-none transition-colors shadow-sm cursor-pointer"
          >
            {filterCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Uploaded By</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getIcon(doc.type)}
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white block">{doc.title}</span>
                        {doc.fileName && <span className="text-xs text-slate-400">{doc.fileName}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-300">{doc.category}</span>
                  </td>
                  <td className="px-6 py-4">{doc.size}</td>
                  <td className="px-6 py-4">{doc.uploadedBy}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDownload(doc)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {canEdit && (
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDocs.length === 0 && (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p>No documents found matching your filters.</p>
            </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Upload Document">
         {/* ... Form is same, handleSubmit calls ApiService ... */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">File Upload</label>
            <div className={`
              border-2 border-dashed rounded-xl p-6 text-center transition-all
              ${selectedFile 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-slate-500'
              }
            `}>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg"
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); clearFile(); }}
                    className="z-10 p-1 hover:bg-white dark:hover:bg-slate-700 rounded-full ml-2"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pointer-events-none">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PDF, Word, Excel, Images (Max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Document Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option>General</option>
                  <option>Medical</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>IT</option>
                  <option>Marketing</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">File Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="pdf">PDF</option>
                  <option value="doc">Word</option>
                  <option value="xls">Excel</option>
                  <option value="img">Image</option>
                </select>
             </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Upload Document</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};