import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { Announcement, LinkItem, BannerItem } from '../types';
import { useToast } from '../context/ToastContext';
import { Megaphone, Link as LinkIcon, Calendar, ArrowRight, ChevronLeft, ChevronRight, Activity, Heart, Baby, Shield, Star, Edit, Plus, Trash2, Settings, Image as ImageIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';

// Icon Mapping
const ICON_MAP = {
  Activity: Activity,
  Baby: Baby,
  Heart: Heart,
  Star: Star,
  Shield: Shield,
  Megaphone: Megaphone,
};

// Color Theme Mapping
const COLOR_MAP = {
  Blue: "from-blue-600 to-indigo-700",
  Pink: "from-pink-500 to-rose-600",
  Red: "from-red-600 to-red-800",
  Green: "from-emerald-500 to-green-700",
  Purple: "from-purple-600 to-indigo-700",
};

export const Home: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Admin Manage Banners State
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  
  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCta, setFormCta] = useState('Learn More');
  const [formImage, setFormImage] = useState('');
  const [formIcon, setFormIcon] = useState<keyof typeof ICON_MAP>('Activity');
  const [formTheme, setFormTheme] = useState<keyof typeof COLOR_MAP>('Blue');

  const loadData = async () => {
    try {
      const [annData, linkData, bannerData] = await Promise.all([
        ApiService.getAnnouncements(),
        ApiService.getLinks(),
        ApiService.getBanners()
      ]);
      setAnnouncements(annData.slice(0, 3));
      setLinks(linkData.slice(0, 4));
      setBanners(bannerData);
    } catch (error) {
      console.error("Failed to load home data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    if (banners.length > 0) setCurrentSlide((prev) => (prev + 1) % banners.length);
  };
  
  const prevSlide = () => {
    if (banners.length > 0) setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Banner Management
  const resetForm = () => {
    setFormTitle('');
    setFormSubtitle('');
    setFormCta('Learn More');
    setFormImage('');
    setFormIcon('Activity');
    setFormTheme('Blue');
    setEditingBanner(null);
  };

  const handleEditBanner = (banner: BannerItem) => {
    setEditingBanner(banner);
    setFormTitle(banner.title);
    setFormSubtitle(banner.subtitle);
    setFormCta(banner.cta);
    setFormImage(banner.image);
    setFormIcon(banner.iconName);
    setFormTheme(banner.theme);
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await ApiService.deleteBanner(id);
        addToast('Banner deleted', 'info');
        loadData();
      } catch (error) {
        addToast('Failed to delete banner', 'error');
      }
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const bannerData = {
      title: formTitle,
      subtitle: formSubtitle,
      cta: formCta,
      image: formImage || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200',
      iconName: formIcon,
      theme: formTheme,
    };

    try {
      if (editingBanner) {
        await ApiService.updateBanner(editingBanner.id, bannerData);
        addToast('Banner updated successfully', 'success');
      } else {
        await ApiService.createBanner(bannerData);
        addToast('Banner created successfully', 'success');
      }
      loadData();
      resetForm();
    } catch (error) {
      addToast('Failed to save banner', 'error');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB Limit
        addToast('Image is too large. Please use an image under 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            {user ? `Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, ${user.fullName.split(' ')[0]}!` : 'Welcome to Mahsa Specialist Hospital'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Access your daily tasks, announcements, and hospital resources.
          </p>
        </div>
        <div className="hidden md:block text-right">
           <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
             {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </p>
           <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
             {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Promotional Carousel */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-[300px] group bg-slate-100 dark:bg-slate-900">
            {isAdmin && (
              <button 
                onClick={() => { setIsManageModalOpen(true); resetForm(); }}
                className="absolute top-4 right-4 z-30 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform backdrop-blur-sm"
                title="Manage Banners"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            {banners.length > 0 ? (
              banners.map((banner, index) => {
                const Icon = ICON_MAP[banner.iconName] || Activity;
                const colorClass = COLOR_MAP[banner.theme] || COLOR_MAP.Blue;
                return (
                  <div 
                    key={banner.id} 
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-90 mix-blend-multiply dark:opacity-80`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white max-w-xl">
                      <div className="bg-white/20 backdrop-blur-md w-fit p-3 rounded-xl mb-4">
                         <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight drop-shadow-sm">{banner.title}</h2>
                      <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-sm">{banner.subtitle}</p>
                      <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-bold transition-colors w-fit flex items-center gap-2 group-hover:pl-5 duration-300 shadow-lg">
                        {banner.cta} <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p>No banners available</p>
                {isAdmin && <button onClick={() => setIsManageModalOpen(true)} className="text-blue-500 hover:underline mt-2">Add Banner</button>}
              </div>
            )}

            {banners.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {banners.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Latest Announcements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Latest Announcements
              </h2>
              <Link to="/announcements" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid gap-4">
              {announcements.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider
                      ${item.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                        item.priority === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                      {item.priority}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">{item.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl">No announcements yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Links & Stats */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Quick Links
              </h2>
              <Link to="/links" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">All Links</Link>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
              {links.map((link) => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{link.title}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded">{link.category}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Mini Directory Search CTA */}
          <div className="bg-indigo-900 dark:bg-indigo-950 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-2">Looking for someone?</h3>
            <p className="text-indigo-200 text-sm mb-4">Find contact details and extensions in the staff directory.</p>
            <Link to="/directory" className="block w-full bg-white text-indigo-900 dark:bg-slate-200 dark:text-indigo-950 text-center py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
              Search Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Manage Banners Modal */}
      <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Manage Carousel Banners">
        {/* ... Banner form UI remains same, but uses handleSaveBanner which calls ApiService ... */}
         <div className="space-y-6 max-h-[80vh] overflow-y-auto p-1">
          {!editingBanner && !formTitle && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <h4 className="font-semibold text-slate-700 dark:text-slate-300">Current Banners</h4>
                 <button 
                   onClick={() => setFormTitle('New Banner')} 
                   className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                 >
                   <Plus className="w-4 h-4" /> Add New
                 </button>
              </div>
              {banners.map(banner => (
                <div key={banner.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                   <img src={banner.image} alt="" className="w-16 h-10 object-cover rounded bg-slate-200" />
                   <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-white truncate">{banner.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{banner.subtitle}</p>
                   </div>
                   <div className="flex items-center gap-1">
                      <button onClick={() => handleEditBanner(banner)} className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteBanner(banner.id)} className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              ))}
            </div>
          )}

          {(editingBanner || formTitle) && (
            <form onSubmit={handleSaveBanner} className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
              {/* Form inputs same as before */}
              <div className="flex justify-between items-center mb-2">
                 <h4 className="font-bold text-slate-800 dark:text-white">{editingBanner ? 'Edit Banner' : 'Create New Banner'}</h4>
                 <button type="button" onClick={resetForm} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
                   <X className="w-3 h-3" /> Cancel
                 </button>
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Banner Title</label>
                 <input required value={formTitle} onChange={e => setFormTitle(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle</label>
                 <textarea required value={formSubtitle} onChange={e => setFormSubtitle(e.target.value)} rows={2} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">CTA Button Text</label>
                   <input required value={formCta} onChange={e => setFormCta(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Icon</label>
                   <select value={formIcon} onChange={e => setFormIcon(e.target.value as any)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                      {Object.keys(ICON_MAP).map(key => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                   </select>
                </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Color Theme</label>
                 <div className="flex gap-2">
                    {Object.keys(COLOR_MAP).map((color) => (
                      <button 
                        type="button"
                        key={color} 
                        onClick={() => setFormTheme(color as any)}
                        className={`w-8 h-8 rounded-full border-2 ${formTheme === color ? 'border-slate-800 dark:border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'} bg-gradient-to-r ${COLOR_MAP[color as keyof typeof COLOR_MAP]}`}
                      />
                    ))}
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Banner Image</label>
                 <div className="space-y-2">
                    <div className="flex gap-2">
                       <input type="text" value={formImage} onChange={e => setFormImage(e.target.value)} className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs" placeholder="Image URL" />
                    </div>
                    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                       <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                       <div className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400">
                          <ImageIcon className="w-5 h-5" />
                          <span className="text-xs">Click to upload image (Max 5MB)</span>
                       </div>
                    </div>
                    {formImage && (
                       <div className="relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                          <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                       </div>
                    )}
                 </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                 <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm">Cancel</button>
                 <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                   {editingBanner ? 'Save Changes' : 'Create Banner'}
                 </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};