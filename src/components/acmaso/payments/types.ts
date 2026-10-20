import type { SalesPayment, Party, SalesInvoice } from '../../../types/acmaso';

export interface PaymentAllocation {
  type: string;
  name: string;
  amount: number;
}

export interface PaymentFormState {
  party: string;
  numberSeries: string;
  date: string;
  dateStr: string;
  paymentType: 'Receive' | 'Pay';
  fromAccount: string;
  toAccount: string;
  paymentMethod: string;
  clearanceDate: string;
  chequeNo: string;
  refDate: string;
  amount: number;
  writeOff: number;
  attachmentName: string;
  allocations: PaymentAllocation[];
  status: 'Draft' | 'Submitted';
  referenceNumber: string;
  forInvoice: string;
  notes: string;
}

export interface PaymentDetailModalProps {
  payment: SalesPayment | null;
  onClose: () => void;
  onDelete: (payment: SalesPayment) => void;
}

export interface CreatePaymentModalProps {
  isOpen: boolean;
  parties: Party[];
  invoices: SalesInvoice[];
  onClose: () => void;
  onSuccess: () => void;
}
