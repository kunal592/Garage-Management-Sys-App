export const MOCK_DATA = {
  stats: {
    totalCustomers: 124,
    totalVehicles: 156,
    todayRevenue: 8540,
    todayServices: 12
  },
  customers: [
    {
      id: '1',
      name: 'Jane Smith',
      phone: '+91 98765 43210',
      address: '123, Blue Ridge, Hinjewadi, Pune',
      vehicles: [
        { id: 'v1', model: 'Ford Mustang', number: 'DEF-5678', lastService: '2024-03-10', nextServiceDate: '2024-03-15' }
      ],
      history: [
        { id: 'h1', date: '2024-03-10', type: 'Oil Change', cost: 1200, parts: 800, labour: 400, status: 'Performed', notes: 'Used synthetic oil', nextServiceDate: '2024-06-10' }
      ]
    },
    {
      id: '2',
      name: 'John Doe',
      phone: '+91 99887 76655',
      address: 'Flat 402, Sunshine Apartments, Mumbai',
      vehicles: [
        { id: 'v2', model: 'Tesla Model 3', number: 'ABC-1234', lastService: '2024-02-15', nextServiceDate: '2024-08-15' }
      ],
      history: [
        { id: 'h2', date: '2024-02-15', type: 'Full Service', cost: 4500, parts: 2500, labour: 2000, status: 'Performed', notes: 'Brake check complete', nextServiceDate: '2024-08-15' }
      ]
    }
  ],
  parts: [
    { id: 'p1', name: 'Engine Oil', category: 'Fluids', price: 800, brand: 'Castrol' },
    { id: 'p2', name: 'Brake Pads', category: 'General', price: 1500, brand: 'Bosch' }
  ],
  analytics: {
    monthlyRevenue: {
      labels: ['Jan', 'Feb', 'Mar'],
      data: [12000, 15000, 18000]
    },
    serviceDistribution: [
      { name: 'Oil Change', population: 45, color: '#4F46E5', legendFontColor: '#7F7F7F', legendFontSize: 15 }
    ],
    topCustomers: [
      { id: '1', name: 'Jane Smith', totalSpent: 12000 }
    ]
  },
  recentActivity: []
};
