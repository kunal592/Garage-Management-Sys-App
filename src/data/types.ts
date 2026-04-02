export interface Vehicle {
  id: string;
  model: string;
  vehicleNumber: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  customerId: string;
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
  type?: string; // summary of items
  serviceItems?: string[];
  date: string;
  nextServiceDate?: string;
  cost?: number; // legacy
  serviceCost?: number;
  partsCost?: number;
  totalCost: number;
  status: 'Pending' | 'Performed' | string;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  selectedParts?: SelectedPart[];
  customParts?: SelectedPart[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
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
  status?: 'Pending' | 'Performed' | string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  todayRevenue: number;
  todayServices: number;
}
