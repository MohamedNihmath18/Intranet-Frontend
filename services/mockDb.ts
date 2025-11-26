import { User, UserRole, Announcement, DocumentItem, LinkItem, AuditLog, BannerItem } from '../types';

const STORAGE_KEYS = {
  USERS: 'mahsa_users',
  ANNOUNCEMENTS: 'mahsa_announcements',
  DOCUMENTS: 'mahsa_documents',
  LINKS: 'mahsa_links',
  AUDIT_LOGS: 'mahsa_audit_logs',
  BANNERS: 'mahsa_banners',
};

// Initial Seed Data
const SEED_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'password',
    fullName: 'System Administrator',
    role: UserRole.ADMIN,
    jobTitle: 'IT Director',
    department: 'Information Technology',
    email: 'admin@mahsa.com',
    extension: '1000',
    avatar: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: '2',
    username: 'jdoe',
    password: 'password',
    fullName: 'Jane Doe',
    role: UserRole.STAFF,
    jobTitle: 'Senior Marketing Manager',
    department: 'Marketing',
    email: 'jdoe@mahsa.com',
    extension: '1042',
    avatar: 'https://picsum.photos/200/200?random=2',
  },
  {
    id: '3',
    username: 'bsmith',
    password: 'password',
    fullName: 'Bob Smith',
    role: UserRole.STAFF,
    jobTitle: 'HR Specialist',
    department: 'Human Resources',
    email: 'bsmith@mahsa.com',
    extension: '1055',
    avatar: 'https://picsum.photos/200/200?random=3',
  },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '101',
    title: 'Hospital Accreditation Success',
    content: 'We are proud to announce that Mahsa Specialist Hospital has successfully renewed its JCI accreditation. Thank you all for your hard work and dedication to patient safety.',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    authorName: 'System Administrator',
    priority: 'high',
  },
  {
    id: '102',
    title: 'New Cafeteria Menu',
    content: 'We have updated the cafeteria menu to include more healthy options for staff and visitors starting next Monday.',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    authorName: 'Bob Smith',
    priority: 'medium',
  },
];

const SEED_DOCUMENTS: DocumentItem[] = [
  {
    id: '201',
    title: 'Clinical Practice Guidelines 2024',
    category: 'Medical',
    uploadedBy: 'Bob Smith',
    date: new Date().toISOString(),
    size: '5.4 MB',
    type: 'pdf',
    url: '#',
    fileName: 'CPG_2024_Final.pdf'
  },
  {
    id: '202',
    title: 'On-Call Schedule - March',
    category: 'HR',
    uploadedBy: 'Jane Doe',
    date: new Date().toISOString(),
    size: '450 KB',
    type: 'xls',
    url: '#',
    fileName: 'Mar_Schedule_v2.xlsx'
  },
];

const SEED_LINKS: LinkItem[] = [
  { id: '301', title: 'Staff Portal', url: '#', category: 'HR', description: 'Manage your shifts and view paystubs.' },
  { id: '302', title: 'Hospital Information System (HIS)', url: '#', category: 'Tools', description: 'Patient records and billing.' },
  { id: '303', title: 'IT Helpdesk', url: '#', category: 'Internal', description: 'Submit a technical support ticket.' },
  { id: '304', title: 'Ministry of Health', url: '#', category: 'External', description: 'Official MOH website.' },
];

const SEED_LOGS: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    actorName: 'System Administrator',
    action: 'SYSTEM_INIT',
    details: 'System initialized and seed data loaded.',
  },
];

const SEED_BANNERS: BannerItem[] = [
  {
    id: '1',
    title: "Comprehensive Health Screening",
    subtitle: "Prioritize your well-being with our full body checkup packages. Early detection saves lives.",
    cta: "View Packages",
    image: "https://images.unsplash.com/photo-1579684385136-4f897b522438?auto=format&fit=crop&q=80&w=1200",
    iconName: 'Activity',
    theme: 'Blue'
  },
  {
    id: '2',
    title: "Maternity Care Excellence",
    subtitle: "Experience world-class care for you and your little one with our premium maternity suites.",
    cta: "Learn More",
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1200",
    iconName: 'Baby',
    theme: 'Pink'
  },
  {
    id: '3',
    title: "Heart Health Month",
    subtitle: "Special discounts on cardiac consultations, ECG, and stress tests this month.",
    cta: "Book Now",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=1200",
    iconName: 'Heart',
    theme: 'Red'
  }
];

// Helper to initialize storage
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SEED_DOCUMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LINKS)) {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(SEED_LINKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(SEED_BANNERS));
  }
};

// Generic Getter
const getCollection = <T,>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Generic Setter
const setCollection = <T,>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const MockService = {
  init: initStorage,

  // Auth
  login: async (username: string, password: string): Promise<User | null> => {
    await new Promise((r) => setTimeout(r, 500)); // Simulate network delay
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      // Return user without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;
      return safeUser as User;
    }
    return null;
  },

  // Audit Logs
  getAuditLogs: () => getCollection<AuditLog>(STORAGE_KEYS.AUDIT_LOGS).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  
  addAuditLog: (actorName: string, action: string, details: string) => {
    const logs = getCollection<AuditLog>(STORAGE_KEYS.AUDIT_LOGS);
    const newLog: AuditLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      actorName,
      action,
      details,
    };
    // Keep logs limited to last 100 to prevent local storage overflow
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    setCollection(STORAGE_KEYS.AUDIT_LOGS, updatedLogs);
  },

  // Users
  getUsers: () => getCollection<User>(STORAGE_KEYS.USERS),
  createUser: (newUser: Omit<User, 'id'>) => {
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    const id = Date.now().toString();
    const userWithId = { ...newUser, id };
    setCollection(STORAGE_KEYS.USERS, [...users, userWithId]);
    return userWithId;
  },
  updateUser: (id: string, updates: Partial<User>) => {
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    const updatedUsers = users.map(u => 
      u.id === id ? { ...u, ...updates } : u
    );
    setCollection(STORAGE_KEYS.USERS, updatedUsers);
    const updatedUser = updatedUsers.find(u => u.id === id);
    if (updatedUser) {
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const { password, ...safeUser } = updatedUser;
       return safeUser as User;
    }
    return null;
  },
  deleteUser: (id: string) => {
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    setCollection(STORAGE_KEYS.USERS, users.filter(u => u.id !== id));
  },
  resetPassword: (id: string, newPassword: string) => {
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    setCollection(STORAGE_KEYS.USERS, updatedUsers);
  },
  changePassword: (id: string, oldPass: string, newPass: string): boolean => {
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === id && u.password === oldPass);
    
    if (userIndex === -1) return false;
    
    users[userIndex].password = newPass;
    setCollection(STORAGE_KEYS.USERS, users);
    return true;
  },

  // Announcements
  getAnnouncements: () => getCollection<Announcement>(STORAGE_KEYS.ANNOUNCEMENTS).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  createAnnouncement: (data: Omit<Announcement, 'id' | 'date'>) => {
    const items = getCollection<Announcement>(STORAGE_KEYS.ANNOUNCEMENTS);
    const newItem = { ...data, id: Date.now().toString(), date: new Date().toISOString() };
    setCollection(STORAGE_KEYS.ANNOUNCEMENTS, [newItem, ...items]);
    return newItem;
  },
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => {
    const items = getCollection<Announcement>(STORAGE_KEYS.ANNOUNCEMENTS);
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setCollection(STORAGE_KEYS.ANNOUNCEMENTS, updatedItems);
  },
  deleteAnnouncement: (id: string) => {
    const items = getCollection<Announcement>(STORAGE_KEYS.ANNOUNCEMENTS);
    setCollection(STORAGE_KEYS.ANNOUNCEMENTS, items.filter((i) => i.id !== id));
  },

  // Documents
  getDocuments: () => getCollection<DocumentItem>(STORAGE_KEYS.DOCUMENTS),
  createDocument: (data: Omit<DocumentItem, 'id' | 'date'>) => {
    const items = getCollection<DocumentItem>(STORAGE_KEYS.DOCUMENTS);
    const newItem = { ...data, id: Date.now().toString(), date: new Date().toISOString() };
    setCollection(STORAGE_KEYS.DOCUMENTS, [newItem, ...items]);
    return newItem;
  },
  deleteDocument: (id: string) => {
    const items = getCollection<DocumentItem>(STORAGE_KEYS.DOCUMENTS);
    setCollection(STORAGE_KEYS.DOCUMENTS, items.filter((i) => i.id !== id));
  },

  // Links
  getLinks: () => getCollection<LinkItem>(STORAGE_KEYS.LINKS),
  createLink: (data: Omit<LinkItem, 'id'>) => {
    const items = getCollection<LinkItem>(STORAGE_KEYS.LINKS);
    const newItem = { ...data, id: Date.now().toString() };
    setCollection(STORAGE_KEYS.LINKS, [...items, newItem]);
    return newItem;
  },
  deleteLink: (id: string) => {
    const items = getCollection<LinkItem>(STORAGE_KEYS.LINKS);
    setCollection(STORAGE_KEYS.LINKS, items.filter(i => i.id !== id));
  },

  // Banners
  getBanners: () => getCollection<BannerItem>(STORAGE_KEYS.BANNERS),
  createBanner: (data: Omit<BannerItem, 'id'>) => {
    const items = getCollection<BannerItem>(STORAGE_KEYS.BANNERS);
    const newItem = { ...data, id: Date.now().toString() };
    setCollection(STORAGE_KEYS.BANNERS, [...items, newItem]);
    return newItem;
  },
  updateBanner: (id: string, updates: Partial<BannerItem>) => {
    const items = getCollection<BannerItem>(STORAGE_KEYS.BANNERS);
    const updatedItems = items.map(item => item.id === id ? { ...item, ...updates } : item);
    setCollection(STORAGE_KEYS.BANNERS, updatedItems);
  },
  deleteBanner: (id: string) => {
    const items = getCollection<BannerItem>(STORAGE_KEYS.BANNERS);
    setCollection(STORAGE_KEYS.BANNERS, items.filter(i => i.id !== id));
  }
};