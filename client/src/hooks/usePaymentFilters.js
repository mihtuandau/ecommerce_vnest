import { useMemo } from 'react';

export const usePaymentFilters = (
  payments,
  searchTerm,
  statusFilter,
  methodFilter,
  sortField,
  sortOrder
) => {
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.id.toString().includes(searchTerm) ||
          payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.order?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    if (methodFilter) {
      filtered = filtered.filter((payment) => payment.method === methodFilter);
    }

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [payments, searchTerm, statusFilter, methodFilter, sortField, sortOrder]);

  return filteredPayments;
};

export const usePaymentStats = (payments) => {
  const stats = useMemo(() => {
    const total = payments.length;
    const pending = payments.filter((p) => p.status === 'PENDING').length;
    const success = payments.filter((p) => p.status === 'SUCCESS').length;
    const failed = payments.filter((p) => p.status === 'FAILED').length;
    const totalAmount = payments
      .filter((p) => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);

    return { total, pending, success, failed, totalAmount };
  }, [payments]);

  return stats;
};
