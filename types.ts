// export enum UserRole {
//   ADMIN = 'ADMIN',
//   STAFF = 'STAFF',
//   GUEST = 'GUEST',
// }

// export interface User {
//   id: string;
//   username: string;
//   password?: string; // In a real app, never store plain text. This is for mock auth.
//   fullName: string;
//   role: UserRole;
//   jobTitle: string;
//   department: string;
//   email: string;
//   extension: string;
//   avatar?: string;
// }

// export interface Announcement {
//   id: string;
//   title: string;
//   content: string;
//   date: string; // ISO string
//   authorName: string;
//   priority: 'low' | 'medium' | 'high';
// }

// export interface DocumentItem {
//   id: string;
//   title: string;
//   category: string;
//   uploadedBy: string;
//   date: string;
//   size: string;
//   type: 'pdf' | 'doc' | 'xls' | 'img';
//   url?: string;
//   fileName?: string;
// }

// export interface LinkItem {
//   id: string;
//   title: string;
//   url: string;
//   category: 'Internal' | 'External' | 'Tools' | 'HR';
//   description?: string;
// }

// export interface AuditLog {
//   id: string;
//   timestamp: string;
//   actorName: string;
//   action: string;
//   details: string;
// }

// export interface BannerItem {
//   id: string;
//   title: string;
//   subtitle: string;
//   cta: string;
//   image: string;
//   iconName: 'Activity' | 'Baby' | 'Heart' | 'Star' | 'Shield' | 'Megaphone';
//   theme: 'Blue' | 'Pink' | 'Red' | 'Green' | 'Purple';
// }

// export interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }


export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  GUEST = 'GUEST',
}

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, never store plain text. This is for mock auth.
  fullName: string;
  role: UserRole;
  jobTitle: string;
  department: string;
  email: string;
  extension: string;
  avatar?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string
  authorName: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  uploadedBy: string;
  date: string;
  size: string;
  type: 'pdf' | 'doc' | 'xls' | 'img';
  url?: string;
  fileName?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  category: 'Internal' | 'External' | 'Tools' | 'HR' | 'Policies' | 'Forms' | 'Training' | 'IT Support';
  description?: string;
  icon?: string; // Added optional icon field
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  action: string;
  details: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  iconName: 'Activity' | 'Baby' | 'Heart' | 'Star' | 'Shield' | 'Megaphone';
  theme: 'Blue' | 'Pink' | 'Red' | 'Green' | 'Purple';
}

export interface OnCallRoster {
  id: string;
  title: string;
  month: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
}

export interface DepartmentResource {
  id?: string;
  _id?: string;
  title: string;
  type: 'ORG_CHART' | 'ROSTER' | 'MEMO' | 'SOP' | 'FAQ';
  url: string;
  fileType: string;
  uploadedBy: string;
  date: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  resources: DepartmentResource[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}