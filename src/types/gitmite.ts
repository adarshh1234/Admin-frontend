export type RepositoryVisibility = 'PUBLIC' | 'PRIVATE';
export type RepositoryMemberRole = 'READ' | 'WRITE' | 'ADMIN';

export interface Repository {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  localPath?: string;
  visibility: RepositoryVisibility;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepositoryRequest {
  name: string;
  slug: string;
  description?: string;
  visibility?: RepositoryVisibility;
}

export interface UpdateRepositoryRequest {
  name?: string;
  description?: string;
  visibility?: RepositoryVisibility;
}

export interface RepositoryMember {
  repositoryId: number;
  userId: number;
  role: RepositoryMemberRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRepositoryMemberRequest {
  username: string;
  role: RepositoryMemberRole;
}

export interface UpdateRepositoryMemberRequest {
  role: RepositoryMemberRole;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  authorName: string;
  authorEmail: string;
  authoredAt: string;
  subject: string;
}

export interface GitCommitDetails extends GitCommit {
  committerName: string;
  committerEmail: string;
  committedAt: string;
  parentHashes: string[];
}

export interface GitDiffResponse {
  hash: string;
  diff: string;
}

export interface GitTreeEntry {
  mode: string;
  type: string;
  hash: string;
  name: string;
}

export interface GitBlobResponse {
  path: string;
  content: string;
}

export interface GitAccessToken {
  id: number;
  name: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateGitAccessTokenRequest {
  name: string;
}

export interface CreateGitAccessTokenResponse {
  id: number;
  name: string;
  token: string;
  createdAt: string;
}
