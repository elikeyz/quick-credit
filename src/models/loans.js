const loans = [
  {
    id: 1,
    user: 'johndoe25@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    createdOn: '1/1/2019, 08:00:00 AM',
    updatedOn: '2/1/2019, 08:00:00 AM',
    purpose: 'Tuition payment',
    status: 'approved',
    repaid: true,
    tenor: 1,
    amount: 20000.00,
    paymentInstallment: 21000.00,
    balance: 0.00,
    interest: 1000.00,
  },
  {
    id: 2,
    user: 'janedoe25@gmail.com',
    firstName: 'Jane',
    lastName: 'Doe',
    createdOn: '2/1/2019, 09:00:00 AM',
    updatedOn: '5/1/2019, 09:00:00 AM',
    purpose: 'Business capital',
    status: 'approved',
    repaid: false,
    tenor: 12,
    amount: 100000.00,
    paymentInstallment: 8750.00,
    balance: 73750.00,
    interest: 5000.00,
  },
  {
    id: 3,
    user: 'johndoe25@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    createdOn: '2/4/2019, 08:00:00 AM',
    updatedOn: '2/4/2019, 08:00:00 AM',
    purpose: 'Business capital',
    status: 'rejected',
    repaid: false,
    tenor: 10,
    amount: 200000.00,
    paymentInstallment: 21000.00,
    balance: 0.00,
    interest: 10000.00,
  },
  {
    id: 4,
    user: 'johndoe25@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    createdOn: '2/11/2019, 08:00:00 AM',
    updatedOn: '2/11/2019, 08:00:00 AM',
    purpose: 'Business capital',
    status: 'pending',
    repaid: false,
    tenor: 10,
    amount: 120000.00,
    paymentInstallment: 12600.00,
    balance: 0.00,
    interest: 6000.00,
  },
  {
    id: 5,
    user: 'tommyvercetti25@gmail.com',
    firstName: 'Tommy',
    lastName: 'Vercetti',
    createdOn: '3/5/2019, 08:00:00 AM',
    updatedOn: '4/5/2019, 08:00:00 AM',
    purpose: 'Business capital',
    status: 'approved',
    repaid: false,
    tenor: 2,
    amount: 10000.00,
    paymentInstallment: 5250.00,
    balance: 4500.00,
    interest: 500.00,
  },
];

export default loans;