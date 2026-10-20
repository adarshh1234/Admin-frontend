import type {
  CreateGitAccessTokenRequest,
  CreateGitAccessTokenResponse,
  CreateRepositoryMemberRequest,
  CreateRepositoryRequest,
  GitBlobResponse,
  GitCommit,
  GitCommitDetails,
  GitDiffResponse,
  GitTreeEntry,
  Repository,
  RepositoryMember,
  UpdateRepositoryMemberRequest,
  UpdateRepositoryRequest,
} from '../types/gitmite';
import { apiRequest } from './taskmiteApiClient';

export const gitmiteService = {
  getRepositories() {
    return apiRequest<Repository[]>('/repositories');
  },

  getRepository(slug: string) {
    return apiRequest<Repository>(`/repositories/${encodeURIComponent(slug)}`);
  },

  createRepository(payload: CreateRepositoryRequest) {
    return apiRequest<Repository>('/repositories', {
      method: 'POST',
      body: payload,
    });
  },

  updateRepository(slug: string, payload: UpdateRepositoryRequest) {
    return apiRequest<Repository>(`/repositories/${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  getBranches(slug: string) {
    return apiRequest<string[]>(
      `/repositories/${encodeURIComponent(slug)}/branches`,
    );
  },

  getCommits(slug: string, ref?: string) {
    const query = ref ? `?ref=${encodeURIComponent(ref)}` : '';
    return apiRequest<GitCommit[]>(
      `/repositories/${encodeURIComponent(slug)}/commits${query}`,
    );
  },

  getCommit(slug: string, hash: string) {
    return apiRequest<GitCommitDetails>(
      `/repositories/${encodeURIComponent(slug)}/commits/${encodeURIComponent(hash)}`,
    );
  },

  getCommitDiff(slug: string, hash: string) {
    return apiRequest<GitDiffResponse>(
      `/repositories/${encodeURIComponent(slug)}/commits/${encodeURIComponent(hash)}/diff`,
    );
  },

  getTree(slug: string, ref?: string, path?: string) {
    const params = new URLSearchParams();
    if (ref) params.set('ref', ref);
    if (path) params.set('path', path);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return apiRequest<GitTreeEntry[]>(
      `/repositories/${encodeURIComponent(slug)}/tree${queryString}`,
    );
  },

  getBlob(slug: string, path: string, ref?: string) {
    const params = new URLSearchParams();
    params.set('path', path);
    if (ref) params.set('ref', ref);

    return apiRequest<GitBlobResponse>(
      `/repositories/${encodeURIComponent(slug)}/blob?${params.toString()}`,
    );
  },

  getMembers(slug: string) {
    return apiRequest<RepositoryMember[]>(
      `/repositories/${encodeURIComponent(slug)}/members`,
    );
  },

  addMember(slug: string, payload: CreateRepositoryMemberRequest) {
    return apiRequest<RepositoryMember>(
      `/repositories/${encodeURIComponent(slug)}/members`,
      {
        method: 'POST',
        body: payload,
      },
    );
  },

  updateMember(
    slug: string,
    userId: number,
    payload: UpdateRepositoryMemberRequest,
  ) {
    return apiRequest<RepositoryMember>(
      `/repositories/${encodeURIComponent(slug)}/members/${userId}`,
      {
        method: 'PATCH',
        body: payload,
      },
    );
  },

  removeMember(slug: string, userId: number) {
    return apiRequest<{ message: string }>(
      `/repositories/${encodeURIComponent(slug)}/members/${userId}`,
      {
        method: 'DELETE',
      },
    );
  },

  createGitToken(payload: CreateGitAccessTokenRequest) {
    return apiRequest<CreateGitAccessTokenResponse>('/auth/git-tokens', {
      method: 'POST',
      body: payload,
    });
  },

  revokeGitToken(id: number) {
    return apiRequest(`/auth/git-tokens/${id}`, {
      method: 'DELETE',
    });
  },
};

export default gitmiteService;
