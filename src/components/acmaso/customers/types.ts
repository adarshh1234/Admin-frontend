import type { Party, SalesInvoice, SalesPayment } from '../../../types/acmaso';

export interface CustomerWithBalance extends Party {
  calculatedOutstanding?: number;
}

export interface CustomerDetailModalProps {
  customer: CustomerWithBalance | null;
  invoices: SalesInvoice[];
  payments: SalesPayment[];
  onClose: () => void;
  onEdit: (customer: CustomerWithBalance) => void;
  onDelete: (customer: CustomerWithBalance) => void;
}

export interface CreateEditCustomerModalProps {
  isOpen: boolean;
  editingCustomer: Party | null;
  onClose: () => void;
  onSuccess: () => void;
}
