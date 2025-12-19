import React from 'react';

export enum AppTab {
  CLEAN = 'clean',
  BROWSE = 'browse',
  SHARE = 'share'
}

export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'app' | 'folder';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  modified: string;
  icon?: string;
  path: string;
}

export interface NetworkServer {
  id: string;
  name: string;
  host: string;
  protocol: 'SMB' | 'FTP' | 'SAMBA';
  user?: string;
  isConnected: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}