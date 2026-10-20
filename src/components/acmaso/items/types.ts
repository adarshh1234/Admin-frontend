import type { Item, Account, TaxTemplate } from '../../../types/acmaso';

export interface SalesItemsProps {
  filterType?: 'sales' | 'purchases' | 'all';
}

export interface ItemDetailModalProps {
  item: Item | null;
  onClose: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export interface CreateEditItemModalProps {
  isOpen: boolean;
  editingItem: Item | null;
  accounts: Account[];
  taxTemplates: TaxTemplate[];
  onClose: () => void;
  onSuccess: () => void;
}
