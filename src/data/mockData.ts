export interface Vehicle {
  id: string;
  model: string;
  number: string;
  lastService: string;
  nextServiceDate?: string;
}

export interface Part {
  id: string;
  name: string;
  category: string;
  price: number;
  brand?: string;
}

export interface SelectedPart {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ServiceHistory {
  id: string;
  type: string;
  date: string;
  nextServiceDate?: string;
  cost: number;
  parts: number;
  labour: number;
  status: 'Pending' | 'Performed';
  notes: string;
  customerName?: string;
  vehicleModel?: string;
  selectedParts?: SelectedPart[];
  customParts?: SelectedPart[];
  totalPartsCost?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  vehicles: Vehicle[];
  history: ServiceHistory[];
}

export interface Analytics {
  monthlyRevenue: {
    labels: string[];
    data: number[];
  };
  serviceDistribution: Array<{
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    totalSpent: number;
  }>;
}

export interface RecentActivity {
  id: string;
  customer: string;
  type: string;
  cost: number;
  time: string;
  vehicle: string;
  status?: 'Pending' | 'Performed';
}

export interface MockData {
  stats: {
    totalCustomers: number;
    totalVehicles: number;
    todayRevenue: number;
    todayServices: number;
  };
  customers: Customer[];
  parts: Part[];
  analytics: Analytics;
  recentActivity: RecentActivity[];
}

const rawCustomers: Customer[] = [
  {
    id: '1',
    name: 'Jane Smith',
    phone: '+91 98765 43210',
    address: '123, Blue Ridge, Hinjewadi, Pune',
    vehicles: [{ id: 'v1', model: 'Ford Mustang', number: 'DEF-5678', lastService: 'Mar 10, 2026', nextServiceDate: 'Mar 15, 2026' }],
    history: [
      { id: 's1', type: 'Oil change, Brake inspection', date: 'Mar 10, 2026 - 1:20 AM', cost: 326, parts: 267, labour: 59, status: 'Performed', notes: 'Routine maintenance performed.' },
      { id: 's2', type: 'Tire Rotation', date: 'Jan 15, 2026', cost: 120, parts: 0, labour: 120, status: 'Performed', notes: 'Checked tire pressure.' },
      { id: 's21', type: 'Battery Replacement', date: 'Nov 20, 2025', cost: 4500, parts: 4200, labour: 300, status: 'Performed', notes: 'New Exide battery installed.' },
      { id: 's60', type: 'Detailing & Wax', date: 'Oct 12, 2025', cost: 2500, parts: 500, labour: 2000, status: 'Performed', notes: 'High gloss finish.' }
    ]
  },
  {
    id: '2',
    name: 'John Doe',
    phone: '+91 99887 76655',
    address: 'Flat 402, Sunshine Apartments, Mumbai',
    vehicles: [
      { id: 'v2', model: 'Honda CBR600RR', number: 'MH-01-AB-1234', lastService: 'Mar 02, 2026' },
      { id: 'v3', model: 'Toyota Camry', number: 'MH-01-CD-5678', lastService: 'Feb 22, 2026' }
    ],
    history: [
      { id: 's3', type: 'Oil change', date: 'Mar 02, 2026', cost: 349, parts: 280, labour: 69, status: 'Performed', notes: 'Used synthetic oil.' },
      { id: 's4', type: 'Oil change', date: 'Feb 22, 2026', cost: 402, parts: 320, labour: 82, status: 'Performed', notes: 'Filter replaced.' },
      { id: 's22', type: 'Brake Pad Replacement', date: 'Dec 10, 2025', cost: 1800, parts: 1200, labour: 600, status: 'Performed', notes: 'Ceramic pads used.' },
      { id: 's61', type: 'Coolant Flush', date: 'Sep 05, 2025', cost: 1200, parts: 800, labour: 400, status: 'Performed', notes: 'System cleaned.' },
      { id: 's70', type: 'Wheel Alignment', date: 'Jul 18, 2025', cost: 800, parts: 0, labour: 800, status: 'Performed', notes: 'Corrected pull to left.' }
    ]
  },
  {
    id: '3',
    name: 'Emily Davis',
    phone: '+91 91234 56789',
    address: 'House No. 45, Sector 15, Gurgaon',
    vehicles: [{ id: 'v4', model: 'Yamaha MT-07', number: 'DL-3C-9999', lastService: 'Feb 26, 2026' }],
    history: [
      { id: 's5', type: 'Oil change', date: 'Feb 26, 2026', cost: 676, parts: 500, labour: 176, status: 'Performed', notes: 'Premium parts used.' },
      { id: 's42', type: 'Chain Lube', date: 'Feb 28, 2026', cost: 200, parts: 50, labour: 150, status: 'Pending', notes: 'Customer waiting.' },
      { id: 's62', type: 'Handlebar adjustment', date: 'Feb 10, 2026', cost: 150, parts: 0, labour: 150, status: 'Performed', notes: 'Tightened.' },
      { id: 's71', type: 'Brake Fluid Flush', date: 'Jan 05, 2026', cost: 1200, parts: 600, labour: 600, status: 'Performed', notes: 'Dot 4 fluid.' }
    ]
  },
  {
    id: '4',
    name: 'Rahul Sharma',
    phone: '+91 90000 11111',
    address: 'Whitefield, Bangalore',
    vehicles: [{ id: 'v5', model: 'Maruti Swift', number: 'KA-01-MJ-1010', lastService: 'Mar 05, 2026' }],
    history: [
      { id: 's6', type: 'Full Service', date: 'Mar 05, 2026', cost: 4500, parts: 3500, labour: 1000, status: 'Performed', notes: 'AC filter cleaned.' },
      { id: 's63', type: 'Dent Paint', date: 'Jan 22, 2026', cost: 3200, parts: 1200, labour: 2000, status: 'Performed', notes: 'Left fender.' },
      { id: 's72', type: 'Wiper Blade Change', date: 'Dec 12, 2025', cost: 850, parts: 700, labour: 150, status: 'Performed', notes: 'Bosch Aerotwin.' }
    ]
  },
  {
    id: '5',
    name: 'Priya Patel',
    phone: '+91 90000 22222',
    address: 'Satellite, Ahmedabad',
    vehicles: [{ id: 'v6', model: 'Hyundai i20', number: 'GJ-01-AA-2020', lastService: 'Mar 01, 2026' }],
    history: [
      { id: 's7', type: 'Brake Repair', date: 'Mar 01, 2026', cost: 1200, parts: 800, labour: 400, status: 'Performed', notes: 'Brake pads replaced.' },
      { id: 's64', type: 'Wiper Fluid refill', date: 'Feb 15, 2026', cost: 100, parts: 100, labour: 0, status: 'Performed', notes: 'Checked spray nozzle.' },
      { id: 's73', type: 'Interior Vacuum', date: 'Jan 20, 2026', cost: 300, parts: 0, labour: 300, status: 'Performed', notes: 'Quick clean.' }
    ]
  },
  {
    id: '6',
    name: 'Amit Kumar',
    phone: '+91 90000 33333',
    address: 'Salt Lake, Kolkata',
    vehicles: [{ id: 'v7', model: 'Tata Nexon', number: 'WB-02-BB-3030', lastService: 'Feb 20, 2026' }],
    history: [
      { id: 's8', type: 'Engine Tuning', date: 'Feb 20, 2026', cost: 2500, parts: 500, labour: 2000, status: 'Performed', notes: 'Idle RPM adjusted.' },
      { id: 's65', type: 'Sunroof Lube', date: 'Jan 10, 2026', cost: 400, parts: 100, labour: 300, status: 'Performed', notes: 'Smooth operation now.' },
      { id: 's74', type: 'General Checkup', date: 'Nov 15, 2025', cost: 500, parts: 0, labour: 500, status: 'Performed', notes: 'Ready for winter.' }
    ]
  },
  {
    id: '7',
    name: 'Suresh Raina',
    phone: '+91 90000 44444',
    address: 'Adyar, Chennai',
    vehicles: [{ id: 'v8', model: 'Mahindra XUV700', number: 'TN-01-CC-4040', lastService: 'Feb 15, 2026' }],
    history: [
      { id: 's9', type: 'Wheel Alignment', date: 'Feb 15, 2026', cost: 800, parts: 0, labour: 800, status: 'Performed', notes: 'Aligned.' },
      { id: 's66', type: 'General Checkup', date: 'Dec 28, 2025', cost: 500, parts: 0, labour: 500, status: 'Performed', notes: 'All OK.' },
      { id: 's75', type: 'Oil change', date: 'Aug 10, 2025', cost: 3500, parts: 3000, labour: 500, status: 'Performed', notes: 'First service.' }
    ]
  },
  {
    id: '8',
    name: 'Anjali Gupta',
    phone: '+91 90000 55555',
    address: 'Banjara Hills, Hyderabad',
    vehicles: [{ id: 'v9', model: 'Kia Seltos', number: 'TS-09-DD-5050', lastService: 'Feb 10, 2026' }],
    history: [
      { id: 's10', type: 'General Checkup', date: 'Feb 10, 2026', cost: 500, parts: 0, labour: 500, status: 'Performed', notes: 'Checked fluids.' },
      { id: 's67', type: 'Fog Light Install', date: 'Jan 05, 2026', cost: 2200, parts: 1800, labour: 400, status: 'Performed', notes: 'LED bulbs used.' },
      { id: 's76', type: 'Tyre Rotation', date: 'Sep 20, 2025', cost: 400, parts: 0, labour: 400, status: 'Performed', notes: 'Equalized wear.' }
    ]
  },
  {
    id: '9',
    name: 'Vikram Singh',
    phone: '+91 90000 66666',
    address: 'Malviya Nagar, Jaipur',
    vehicles: [{ id: 'v10', model: 'Toyota Fortuner', number: 'RJ-14-EE-6060', lastService: 'Feb 05, 2026' }],
    history: [
      { id: 's11', type: 'Oil change', date: 'Feb 05, 2026', cost: 1500, parts: 1200, labour: 300, status: 'Performed', notes: 'Filter replaced.' },
      { id: 's77', type: 'Brake inspection', date: 'Nov 10, 2025', cost: 300, parts: 0, labour: 300, status: 'Performed', notes: 'Cleaned dust.' }
    ]
  },
  {
    id: '10',
    name: 'Kavita Iyer',
    phone: '+91 90000 77777',
    address: 'Koramangala, Bangalore',
    vehicles: [{ id: 'v11', model: 'Honda City', number: 'KA-03-FF-7070', lastService: 'Jan 30, 2026' }],
    history: [
      { id: 's12', type: 'Clutch Repair', date: 'Jan 30, 2026', cost: 5500, parts: 4000, labour: 1500, status: 'Performed', notes: 'Plate replaced.' },
      { id: 's78', type: 'Full Service', date: 'Jul 15, 2025', cost: 4800, parts: 3800, labour: 1000, status: 'Performed', notes: 'Synthetic oil.' }
    ]
  },
  {
    id: '11',
    name: 'Manish Pandey',
    phone: '+91 90000 88888',
    address: 'Indirapuram, Ghaziabad',
    vehicles: [{ id: 'v12', model: 'Skoda Slavia', number: 'UP-14-GG-8080', lastService: 'Jan 25, 2026' }],
    history: [
      { id: 's13', type: 'Suspension Work', date: 'Jan 25, 2026', cost: 8000, parts: 6500, labour: 1500, status: 'Performed', notes: 'Front shocks replaced.' },
      { id: 's79', type: 'Wheel Alignment', date: 'Oct 02, 2025', cost: 800, parts: 0, labour: 800, status: 'Performed', notes: 'Regular check.' }
    ]
  },
  {
    id: '12',
    name: 'Neha Sharma',
    phone: '+91 90000 99999',
    address: 'Vasant Kunj, Delhi',
    vehicles: [{ id: 'v13', model: 'Volkswagen Taigun', number: 'DL-10-HH-9090', lastService: 'Jan 20, 2026' }],
    history: [
      { id: 's14', type: 'Brake inspection', date: 'Jan 20, 2026', cost: 300, parts: 0, labour: 300, status: 'Performed', notes: 'Cleaned.' },
      { id: 's80', type: 'AC Service', date: 'May 10, 2025', cost: 2500, parts: 1500, labour: 1000, status: 'Performed', notes: 'Cooling improved.' }
    ]
  },
  {
    id: '13',
    name: 'Rohan Mehra',
    phone: '+91 91111 00000',
    address: 'Andheri West, Mumbai',
    vehicles: [{ id: 'v14', model: 'Mercedes C-Class', number: 'MH-02-II-1111', lastService: 'Jan 15, 2026' }],
    history: [
      { id: 's15', type: 'Oil change', date: 'Jan 15, 2026', cost: 12000, parts: 9000, labour: 3000, status: 'Performed', notes: 'Premium oil.' },
      { id: 's81', type: 'Brake Pad Change', date: 'Jun 20, 2025', cost: 8500, parts: 6500, labour: 2000, status: 'Performed', notes: 'Original parts.' }
    ]
  },
  {
    id: '14',
    name: 'Sanya Malhotra',
    phone: '+91 92222 00000',
    address: 'Bandra, Mumbai',
    vehicles: [{ id: 'v15', model: 'BMW 3 Series', number: 'MH-03-JJ-2222', lastService: 'Jan 10, 2026' }],
    history: [
      { id: 's16', type: 'General service', date: 'Jan 10, 2026', cost: 15000, parts: 10000, labour: 5000, status: 'Performed', notes: 'Full scan.' },
      { id: 's82', type: 'Battery Check', date: 'Nov 05, 2025', cost: 500, parts: 0, labour: 500, status: 'Performed', notes: 'Healthy.' }
    ]
  },
  {
    id: '15',
    name: 'Varun Dhawan',
    phone: '+91 93333 00000',
    address: 'Juhu, Mumbai',
    vehicles: [{ id: 'v16', model: 'Audi A4', number: 'MH-04-KK-3333', lastService: 'Jan 05, 2026' }],
    history: [
      { id: 's17', type: 'Transmission Fluid', date: 'Jan 05, 2026', cost: 7500, parts: 6000, labour: 1500, status: 'Performed', notes: 'Flushed.' },
      { id: 's83', type: 'Oil change', date: 'Jul 22, 2025', cost: 11000, parts: 8500, labour: 2500, status: 'Performed', notes: 'Service A.' }
    ]
  },
  {
    id: '16',
    name: 'Kriti Sanon',
    phone: '+91 94444 00000',
    address: 'Worli, Mumbai',
    vehicles: [{ id: 'v17', model: 'Jeep Compass', number: 'MH-01-LL-4444', lastService: 'Mar 08, 2026' }],
    history: [
      { id: 's18', type: 'Oil change', date: 'Mar 08, 2026', cost: 4500, parts: 3500, labour: 1000, status: 'Performed', notes: 'Synthetic oil.' },
      { id: 's84', type: 'Tyre Rotation', date: 'Nov 30, 2025', cost: 600, parts: 0, labour: 600, status: 'Performed', notes: 'Balanced.' }
    ]
  },
  {
    id: '17',
    name: 'Ayushmann Khurrana',
    phone: '+91 95555 00000',
    address: 'Chandigarh',
    vehicles: [{ id: 'v18', model: 'Mahindra Thar', number: 'CH-01-MM-5555', lastService: 'Mar 07, 2026' }],
    history: [
      { id: 's19', type: 'General Checkup', date: 'Mar 07, 2026', cost: 1000, parts: 0, labour: 1000, status: 'Performed', notes: 'Post-offroad check.' },
      { id: 's85', type: 'Underbody coating', date: 'Aug 15, 2025', cost: 4500, parts: 3000, labour: 1500, status: 'Performed', notes: 'Anti-rust.' }
    ]
  },
  {
    id: '18',
    name: 'Alia Bhatt',
    phone: '+91 96666 00000',
    address: 'Juhu, Mumbai',
    vehicles: [{ id: 'v19', model: 'Range Rover', number: 'MH-02-NN-6666', lastService: 'Mar 06, 2026' }],
    history: [
      { id: 's20', type: 'Full Service', date: 'Mar 06, 2026', cost: 25000, parts: 18000, labour: 7000, status: 'Performed', notes: 'Annual service.' },
      { id: 's86', type: 'Soft Software Update', date: 'Jan 12, 2026', cost: 0, parts: 0, labour: 0, status: 'Performed', notes: 'OTA Update check.' }
    ]
  },
  {
    id: '19',
    name: 'Ranbir Kapoor',
    phone: '+91 97777 00000',
    address: 'Pali Hill, Mumbai',
    vehicles: [{ id: 'v20', model: 'Mercedes G-Wagon', number: 'MH-01-RR-7777', lastService: 'Mar 11, 2026' }],
    history: [
      { id: 's43', type: 'Full Detail', date: 'Mar 11, 2026', cost: 8000, parts: 1000, labour: 7000, status: 'Performed', notes: 'Showroom finish.' },
      { id: 's51', type: 'Glass Coating', date: 'Feb 25, 2026', cost: 5000, parts: 2000, labour: 3000, status: 'Performed', notes: 'Clear view.' },
      { id: 's68', type: 'Sunroof Repair', date: 'Jan 15, 2026', cost: 4500, parts: 2500, labour: 2000, status: 'Performed', notes: 'Motor fixed.' }
    ]
  },
  {
    id: '20',
    name: 'Deepika Padukone',
    phone: '+91 98888 00000',
    address: 'Prabhadevi, Mumbai',
    vehicles: [{ id: 'v21', model: 'Maybach S-Class', number: 'MH-01-DP-8888', lastService: 'Mar 12, 2026' }],
    history: [
      { id: 's44', type: 'Software Update', date: 'Mar 12, 2026', cost: 0, parts: 0, labour: 0, status: 'Performed', notes: 'Infotainment update.' },
      { id: 's52', type: 'Leather Treatment', date: 'Mar 05, 2026', cost: 4500, parts: 1500, labour: 3000, status: 'Performed', notes: 'Nappa leather cared.' },
      { id: 's69', type: 'Wheel Refurbish', date: 'Feb 12, 2026', cost: 12000, parts: 2000, labour: 10000, status: 'Performed', notes: 'Diamond cut finish.' }
    ]
  }
];

const PARTS_LIST: Part[] = [
  // Engine Parts
  { id: 'p1', name: 'Spark Plug', category: 'Engine Parts', price: 120, brand: 'NGK' },
  { id: 'p2', name: 'Air Filter', category: 'Engine Parts', price: 250, brand: 'Hero' },
  { id: 'p3', name: 'Fuel Filter', category: 'Engine Parts', price: 80, brand: 'TVS' },
  { id: 'p4', name: 'Carburetor Kit', category: 'Engine Parts', price: 450 },
  { id: 'p5', name: 'Engine Oil Filter', category: 'Engine Parts', price: 150 },
  { id: 'p6', name: 'Throttle Cable', category: 'Engine Parts', price: 180 },
  // Transmission & Brake Parts
  { id: 'p7', name: 'Chain & Sprocket Kit', category: 'Transmission & Brake', price: 1800, brand: 'LGB' },
  { id: 'p8', name: 'Wheel Bearing', category: 'Transmission & Brake', price: 220 },
  { id: 'p9', name: 'Brake Pads (Disc)', category: 'Transmission & Brake', price: 450, brand: 'Bosch' },
  { id: 'p10', name: 'Brake Shoes (Drum)', category: 'Transmission & Brake', price: 280 },
  { id: 'p11', name: 'Clutch Plates', category: 'Transmission & Brake', price: 850 },
  { id: 'p12', name: 'Clutch Cable', category: 'Transmission & Brake', price: 200 },
  // Electrical Parts
  { id: 'p13', name: 'CDI Unit', category: 'Electrical Parts', price: 650 },
  { id: 'p14', name: 'Ignition Coil', category: 'Electrical Parts', price: 450 },
  { id: 'p15', name: 'Battery', category: 'Electrical Parts', price: 1800, brand: 'Exide' },
  { id: 'p16', name: 'Horn', category: 'Electrical Parts', price: 350 },
  // Consumables
  { id: 'p17', name: 'Engine Oil (1L)', category: 'Consumables', price: 450, brand: 'Castrol' },
  { id: 'p18', name: 'Chain Lubricant', category: 'Consumables', price: 250 },
  { id: 'p19', name: 'Brake Oil', category: 'Consumables', price: 150 },
  { id: 'p20', name: 'Coolant', category: 'Consumables', price: 350 },
];

export const MOCK_DATA: MockData = {
  stats: {
    totalCustomers: rawCustomers.length,
    totalVehicles: rawCustomers.reduce((acc, curr) => acc + curr.vehicles.length, 0),
    todayRevenue: 326 + 349 + 4500 + 8000 + 0, // Sum of Mar 10-12 records
    todayServices: 5,
  },
  customers: rawCustomers,
  parts: PARTS_LIST,
  analytics: {
    monthlyRevenue: {
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      data: [35000, 42000, 38000, 55000, 48000, 62000],
    },
    serviceDistribution: [
      { name: 'Oil Change', population: 45, color: '#4F46E5', legendFontColor: '#7F7F7F', legendFontSize: 12 },
      { name: 'Brake Repair', population: 20, color: '#0EA5E9', legendFontColor: '#7F7F7F', legendFontSize: 12 },
      { name: 'Engine Work', population: 15, color: '#6366F1', legendFontColor: '#7F7F7F', legendFontSize: 12 },
      { name: 'Other', population: 20, color: '#94A3B8', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    ],
    topCustomers: rawCustomers.map(c => ({
      id: c.id,
      name: c.name,
      totalSpent: c.history.reduce((acc, curr) => acc + curr.cost, 0)
    })).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5),
  },
  recentActivity: [
    { id: 's42', customer: 'Emily Davis', type: 'Chain Lube', cost: 200, time: '11:45 AM', vehicle: 'Yamaha MT-07', status: 'Pending' },
    { id: 's44', customer: 'Deepika Padukone', type: 'Software Update', cost: 0, time: '12:00 PM', vehicle: 'Maybach S-Class', status: 'Performed' },
    { id: 's43', customer: 'Ranbir Kapoor', type: 'Full Detail', cost: 8000, time: '10:00 AM', vehicle: 'Mercedes G-Wagon', status: 'Performed' },
    { id: 's1', customer: 'Jane Smith', type: 'Oil change', cost: 326, time: '1:20 AM', vehicle: 'Ford Mustang', status: 'Performed' },
  ],
};
