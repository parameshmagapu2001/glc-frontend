export type Agent = {
  agentRank: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  profileImage: string;
  totalEarnings: number;
  userCode: string;
  userEmail: string;
  userId: number;
  totalFarmlands: number;
  totalSales: number;
};

export type AgentDetail = Agent & {
  pendingCount: number;
  rejectedCount: number;
  totalCredits: number;
  totalEarnings: number;
  totalFarmlands: number;
  totalSales: number;
  approvedCount: number;
};

export type AgentSaleReportItem = {
  agentName: string;
  areaName: string;
  contactEmail: string;
  contactNumber: string;
  createdOn: string;
  farmlandId: number;
  firstName: string;
  gender: string;
  isFavorite: false;
  landCost: number;
  lastName: string;
  leadCode: string;
  leadId: number;
  leadStatus: string;
  regionName: string;
  religion: string;
  stateName: string;
  thumbnailImage: string;
};
