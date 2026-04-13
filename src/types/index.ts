export type TransactionKind = 'credit' | 'debit';

export type Transaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  kind: TransactionKind;
  date: string;
  status: 'completed' | 'pending';
  description: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: 'security' | 'transaction';
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  Notifications: undefined;
};

export type TransactionsStackParamList = {
  TransactionsHome: undefined;
  TransactionDetails: { transactionId: string };
};

export type SendStackParamList = {
  SendMoneyHome: undefined;
  SendMoneyConfirm: { recipient: string; amount: number };
};
