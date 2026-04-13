import { NotificationItem, Transaction } from '../types';

export const accountBalance = 12450.22;
export const creditScore = 754;

export const transactions: Transaction[] = [
  { id: 't1', title: 'Salary Deposit', category: 'Income', amount: 4200, kind: 'credit', date: '2026-04-11', status: 'completed', description: 'Monthly salary payout.' },
  { id: 't2', title: 'Coffee Central', category: 'Food', amount: 12.4, kind: 'debit', date: '2026-04-11', status: 'completed', description: 'Card payment for coffee.' },
  { id: 't3', title: 'Metro Transit', category: 'Transport', amount: 6.25, kind: 'debit', date: '2026-04-10', status: 'completed', description: 'Contactless ticket charge.' },
  { id: 't4', title: 'Refund - Gadget Hub', category: 'Shopping', amount: 78.99, kind: 'credit', date: '2026-04-09', status: 'completed', description: 'Refund for returned accessory.' },
  { id: 't5', title: 'Utilities', category: 'Bills', amount: 130.15, kind: 'debit', date: '2026-04-08', status: 'pending', description: 'Scheduled utility payment.' },
];

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'Security Alert', message: 'New login from demo device. If this was not you, rotate credentials.', createdAt: '2m ago', type: 'security' },
  { id: 'n2', title: 'Transfer Completed', message: 'Your transfer to Jamie was completed successfully.', createdAt: '1h ago', type: 'transaction' },
  { id: 'n3', title: 'Card Protection', message: 'Biometric lock is available in profile settings.', createdAt: 'Yesterday', type: 'security' },
];
