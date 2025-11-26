import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { Announcement } from '../types';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2, Calendar, Edit } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Announcements: React.FC = () => {
  const { canEdit, user } = useAuth();
  const { addToast } = useToast();
  const [items, setItems] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await ApiService.getAnnouncements();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      if (editingId) {
        await ApiService.updateAnnouncement(editingId, { title, content, priority });
        addToast('Announcement updated successfully', 'success');
      } else {
        await ApiService.createAnnouncement({ title, content, priority });
        addToast('Announcement published successfully', 'success');
      }
      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      addToast('Failed to save announcement', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await ApiService.deleteAnnouncement(id);
        addToast('Announcement deleted', 'info');
        loadData();
      } catch (error) {
        addToast('Failed to delete announcement', 'error');
      }
    }
  };

  const handleEdit = (item: Announcement) => {
    setTitle(item.title);
    setContent(item.content);
    setPriority(item.priority);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPriority('medium');
    setEditingId(null);
  };

  const openNewModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Announcements</h1>
          <p className="text-slate-500 dark:text-slate-400">Company-wide news and updates</p>
        </div>
        {canEdit && (
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
            <div className={`h-1 w-full ${
              item.priority === 'high' ? 'bg-red-500' : 
              item.priority === 'medium' ? 'bg-orange-400' : 'bg-blue-400'
            }`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{item.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>Posted by {item.authorName}</span>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2"
                      title="Edit Announcement"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                <p>{item.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No announcements found.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Announcement" : "Create Announcement"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};