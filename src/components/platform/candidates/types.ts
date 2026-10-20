import type { CandidateUser, VerificationStatus } from '../../../types/platformUsers';

export interface CandidateDetailModalProps {
  isOpen: boolean;
  candidate: CandidateUser | null;
  onClose: () => void;
  onVerifyStatus: (candidate: CandidateUser, status: VerificationStatus) => void;
}

export interface CandidateEditModalProps {
  isOpen: boolean;
  editForm: Partial<CandidateUser>;
  onEditFormChange: (updated: Partial<CandidateUser>) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export interface CandidateTableProps {
  candidates: CandidateUser[];
  paginatedCandidates: CandidateUser[];
  sortField: keyof CandidateUser;
  sortAsc: boolean;
  onSort: (field: keyof CandidateUser) => void;
  onViewCandidate: (candidate: CandidateUser) => void;
  onEditCandidate: (candidate: CandidateUser) => void;
  onToggleStatus: (candidate: CandidateUser) => void;
  onSuspendCandidate: (candidate: CandidateUser) => void;
  onViewActivity: (candidate: CandidateUser) => void;
  onDeleteCandidate: (candidate: CandidateUser) => void;
}
