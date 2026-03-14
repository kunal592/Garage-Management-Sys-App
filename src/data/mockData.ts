export interface Vehicle {
  id: string;
  model: string;
  vehicleNumber: string;
  lastServiceDate?: string;
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

// REMOVED: MOCK_DATA constant to ensure live data is used.
