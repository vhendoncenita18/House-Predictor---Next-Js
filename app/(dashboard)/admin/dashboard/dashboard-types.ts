export type AdminDashboardStat = {
  label: string;
  value: string;
  hint: string;
};

export type AdminRecentUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  utype: string;
  createdAt: Date;
};

export type AdminRecentPrediction = {
  id: string;
  location: string;
  propertyType: string;
  predictedPrice: number;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
    username: string;
  };
};

export type AdminHistoryPrediction = {
  id: string;
  createdAt: Date;
  location: string;
  propertyType: string;
  lotArea: unknown;
  floorArea: unknown;
  bedrooms: number | null;
  bathrooms: number | null;
  kitchens: number | null;
  garages: number | null;
  predictedPrice: unknown;
};

export type AdminHistoryUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  predictions: AdminHistoryPrediction[];
};
