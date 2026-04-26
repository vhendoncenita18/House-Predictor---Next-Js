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
