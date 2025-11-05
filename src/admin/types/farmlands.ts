export type IFarmlandAlert = {
  agentName: string;
  alertCode: string;
  alertId: number;
  alertStatus: string;
  areaName: string;
  contactEmail: string;
  contactNumber: string;
  createdOn: string;
  dob: string;
  farmlandCode: string;
  farmlandCreatedOn: string;
  firstName: string;
  gender: string;
  landCost: number;
  landLatitude: string;
  landLongitude: string;
  lastName: string;
  regionName: string;
  religion: string;
  stateName: string;
  thumbnailImage: string;
  farmlandId: number;
  profileImage: string;
  landCostLabel: string;
  publishedTime: string;
  dismissReason: string;
};

export type IOwnerDetails = {
  areaName: string;
  contactMail: string;
  contactNumber: string;
  created_on: string;
  dob: string;
  gender: string;
  landCost: number;
  landLatitude: string;
  landLongitude: string;
  firstName: string;
  lastName: string;
  regionName: string;
  religion: string;
  stateName: string;
};

export type IFarmlandAlertState = {
  isLoading: boolean;
  error: Error | string | null;
  regions: IFarmlandAlert[];
};
export type IFarmlandTableFilterValue = string | string[];

export type IFarmlandTableFilters = {
  agentName: string;
};

export type ICreateFarmlandBody = {
  firstName: string;
  lastName: string;
  contactNumber: string;
  contactMail: string;
  dob: string;
  religion: string;
  gender: string;
  landCost: number;
  landLatitude: string;
  landLongitude: string;
  alertId: number;
};

export type FarmlandAnalytics = {
  totalFarmlands: number;
  pendingFarmlands: number;
  approveFarmlands: number;
  rejectedFarmlands: number;
};

export type FarmlandReportItem = {
  agentName: string;
  areaName: string;
  createdOn: string;
  farmlandCode: string;
  farmlandId: number;
  farmlandStatus: string;
  landCostLabel: number;
  landLatitude: string;
  landLongitude: string;
  regionName: string;
  stateName: string;
  thumbnailImage: string;
  position: number;
  commission: number;
};

export type FarmlandData = {
  farmlandId: number;
  areaId: number;
  farmlandCode: string;
  imageUrl: string;
  documentSets: FarmlandDocumentSet[];
};

export type FarmlandDocumentSet = {
  documentSet: string;
  documentSetId: number;
  documentsStatus: string;
  reviewStatus: string;
};

export type FarmlandDocumentsData = {
  documentSet: string;
  documentSetId: number;
  documentsStatus: string;
  documents: FarmlandDocuments[];
};

export type FarmlandDocuments = {
  documentId: number;
  documentName: string;
  documentStatus: string;
  reviewStatus: string;
  documentDetails: {
    [key: string]: string;
  };
  approveAccess: number;
  rejectAccess: number;
  editAccess: number;
  timeLineView: boolean;
};

export type FarmlandDocumentBody = {
  documentId: number;
  documentName: string;
  documentStatus: string;
  documentDetails: object
};

export type IFarmlandItem = {
  farmlandId: number;
  farmlandCode: string;
  farmlandStatus: string;
  createdOn: string;
  landCost: number;
  landLatitude: string;
  landLongitude: string;
  stateName: string;
  regionName: string;
  agentName: string;
  thumbnailImage: string;
  location: string;
  costPerAcre: number;
  areaName: string;
  landArea: number;
  landCostLabel: string;
  publishedTime: string;
  returnReason: string;
};

export type IAssignedFarmlandRequest = {
  searchKey: string | null;
  status: string;
  pageNumber: number;
  pageSize: number;
};

export type ITimelineItem = {
  reviewTime: string;
  submittedTime: string;
  documentDetails: {
    comments: string | null;
    documents: string[];
  };
  reviewComments: string;
  reviewedBy: string;
};
