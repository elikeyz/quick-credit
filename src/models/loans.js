const loans = [
  {
    id: 1,
    user: 'johndoe25@gmail.com',
    createdOn: '1/1/2019, 08:00:00 AM',
    purpose: 'Tuition payment',
    status: 'approved',
    repaid: true,
    tenor: 1,
    amount: 20000,
    paymentInstallment: 21000.00,
    balance: 0.00,
    interest: 1000,
  },
  {
    id: 2,
    user: 'janedoe25@gmail.com',
    createdOn: '2/1/2019, 09:00:00 AM',
    purpose: 'Business capital',
    status: 'approved',
    repaid: false,
    tenor: 12,
    amount: 100000,
    paymentInstallment: 8750.00,
    balance: 73750.00,
    interest: 5000,
  },
  {
    id: 3,
    user: 'johndoe25@gmail.com',
    createdOn: '2/4/2019, 08:00:00 AM',
    purpose: 'Business capital',
    status: 'rejected',
    repaid: false,
    tenor: 10,
    amount: 200000,
    paymentInstallment: 21000.00,
    balance: 0.00,
    interest: 10000,
  },
  {
    id: 4,
    user: 'johndoe25@gmail.com',
    createdOn: '2/11/2019, 08:00:00 AM',
    purpose: 'Business capital',
    status: 'pending',
    repaid: false,
    tenor: 10,
    amount: 120000,
    paymentInstallment: 12600.00,
    balance: 0.00,
    interest: 6000,
  },
];

export default loans;