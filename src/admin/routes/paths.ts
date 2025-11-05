
const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  ROLE_MANAGER: '/role-manager',
  FIELD_OFFICER: '/field-officer',
  REGIONAL_OFFICER: '/region-officer',
  INTELLIGENCE_OFFICER: '/intelligence-officer',
  GLC_CCS: '/ccs-approval-team',
  ADMIN: '/glc-admin',
  VALUATION_OFFICER: '/document-valuation-officer',
  SUPER_ADMIN: '/super-admin',
};

// ----------------------------------------------------------------------

export const paths = {
  components: '/components',
  appleAppSiteAssociation: '/apple-app-site-association',
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    forgot_password: `${ROOTS.AUTH}/forgot-password`,
    new_password: `${ROOTS.AUTH}/new-password`,
    session_expired: `${ROOTS.AUTH}/session-expired`,
  },

  // role manager navigation paths
  rm: {
    root: ROOTS.ROLE_MANAGER,
    change_password: `${ROOTS.ROLE_MANAGER}/change-password`,
    
    area_regions: {
      root: `${ROOTS.ROLE_MANAGER}/area-regions`,
      region_view: (id: number) => `${ROOTS.ROLE_MANAGER}/area-regions/${id}/regions`,
      area_view: (id: number) => `${ROOTS.ROLE_MANAGER}/area-regions/${id}/areas`,
      create_region_area: `${ROOTS.ROLE_MANAGER}/area-regions/create-region-area`,
      create_region: `${ROOTS.ROLE_MANAGER}/area-regions/create-region-area/create-region`,
      create_area: `${ROOTS.ROLE_MANAGER}/area-regions/create-region-area/create-area`,
    },

    roles: {
      root: `${ROOTS.ROLE_MANAGER}`,
      new: `${ROOTS.ROLE_MANAGER}/roles/create`,
      edit: (id: number, userId: number) => `${ROOTS.ROLE_MANAGER}/roles/${id}/${userId}/edit`,
      regional_officers: `${ROOTS.ROLE_MANAGER}/roles/regional-officers`,
      field_officers: `${ROOTS.ROLE_MANAGER}/roles/field-officers`,
      intelligence_officers: `${ROOTS.ROLE_MANAGER}/roles/intelligence-officers`,
      agents: `${ROOTS.ROLE_MANAGER}/roles/agents`,
      role_view: (id: number) => `${ROOTS.ROLE_MANAGER}/roles/regional-officers/${id}`,
      create_role_type_view: `${ROOTS.ROLE_MANAGER}/roles/create-role-type-view`,
      create_regional_officer: `${ROOTS.ROLE_MANAGER}/roles/regional-officers/create`,
      create_field_officer: `${ROOTS.ROLE_MANAGER}/roles/field-officers/create`,
      create_intelligence_officer: `${ROOTS.ROLE_MANAGER}/roles/intelligence-officers/create`,
      create_agent: `${ROOTS.ROLE_MANAGER}/roles/agents/create`,
      area_region_view: (id: number) => `${ROOTS.ROLE_MANAGER}/roles/area-regions/${id}/regions`,
      regional_officer_view: (id: number) => `${ROOTS.ROLE_MANAGER}/roles/regional-officers/${id}`,
      field_officer_view: (id: number) => `${ROOTS.ROLE_MANAGER}/roles/field-officers/${id}`,
      intelligence_officer_view: (id: number) => `${ROOTS.ROLE_MANAGER}/roles/intelligence-officers/${id}`,
      agent_view: (id: number) => `${ROOTS.ROLE_MANAGER}/roles/agents/${id}`,
    },

    locations: {
      root: `${ROOTS.ROLE_MANAGER}/locations`,
      new: `${ROOTS.ROLE_MANAGER}/locations/create`,
      edit: (id: number) => `${ROOTS.ROLE_MANAGER}/locations/${id}/edit`,
    },

    roles_users: {
      root: `${ROOTS.ROLE_MANAGER}/roles-users`,
      newRole: `${ROOTS.ROLE_MANAGER}/roles-users/role/create`,
      users: `${ROOTS.ROLE_MANAGER}/roles-users/user`,
      roles: `${ROOTS.ROLE_MANAGER}/roles-users/roles`,
      newUser: `${ROOTS.ROLE_MANAGER}/roles-users/user/create`,
      edit: (id: number) => `${ROOTS.ROLE_MANAGER}/roles-users/user/${id}/edit`,
      role_edit: (id: number) => `${ROOTS.ROLE_MANAGER}/roles-users/role/${id}/edit`,
    },

  },

  // Field officer navigation paths
  fo: {
    root: ROOTS.FIELD_OFFICER,
    change_password: `${ROOTS.FIELD_OFFICER}/change-password`,
    newFarmLand: (id: number) => `${ROOTS.FIELD_OFFICER}/create-farmland/${id}`,
    documents: (id: number) => `${ROOTS.FIELD_OFFICER}/documents/${id}`,
    allFarmlandAlerts: `${ROOTS.FIELD_OFFICER}/all-farmland-alerts`,
    allRequestedInfo: `${ROOTS.FIELD_OFFICER}/all-requested-info`,
    allFarmlands: `${ROOTS.FIELD_OFFICER}/all-farmlands`,
    allDrafts: `${ROOTS.FIELD_OFFICER}/all-drafts`,
    allTopPerformers: `${ROOTS.FIELD_OFFICER}/top-performers`,
  },

  // Regional officer navigation paths
  ro: {
    root: ROOTS.REGIONAL_OFFICER,
    change_password: `${ROOTS.REGIONAL_OFFICER}/change-password`,
    documents: (id: number) => `${ROOTS.REGIONAL_OFFICER}/documents/${id}`,
    allAssignedFarmlands: `${ROOTS.REGIONAL_OFFICER}/all-assigned-farmlands`,
    allFarmlands: `${ROOTS.REGIONAL_OFFICER}/all-farmlands`,
    allDrafts: `${ROOTS.REGIONAL_OFFICER}/all-drafts`,
    allRequested: `${ROOTS.REGIONAL_OFFICER}/all-requested`,
  },

  // Intelligence officer navigation paths
  io: {
    root: ROOTS.INTELLIGENCE_OFFICER,
    change_password: `${ROOTS.INTELLIGENCE_OFFICER}/change-password`,
    documents: (id: number) => `${ROOTS.INTELLIGENCE_OFFICER}/documents/${id}`,
    allAssignedFarmlands: `${ROOTS.INTELLIGENCE_OFFICER}/all-assigned-farmlands`,
    allFarmlands: `${ROOTS.INTELLIGENCE_OFFICER}/all-farmlands`,
    allDrafts: `${ROOTS.INTELLIGENCE_OFFICER}/all-drafts`,
    allRequested: `${ROOTS.INTELLIGENCE_OFFICER}/all-requested`,
  },

  // GLC CCS navigation paths
  ccs: {
    root: ROOTS.GLC_CCS,
    change_password: `${ROOTS.GLC_CCS}/change-password`,
    total_farmland_requests: `${ROOTS.GLC_CCS}/total-farmland-requests`,
    total_farmland_list: `${ROOTS.GLC_CCS}/total-farmland-list`,
    documents: (id: number) => `${ROOTS.GLC_CCS}/documents/${id}`,
  },

  // GLC Admin navigation paths
  admin: {
    root: ROOTS.ADMIN,
    change_password: `${ROOTS.ADMIN}/change-password`,
  },

  // validation officer navigation paths
  vo: {
    root: ROOTS.VALUATION_OFFICER,
    change_password: `${ROOTS.VALUATION_OFFICER}/change-password`,
    all_assigned_farmland: `${ROOTS.VALUATION_OFFICER}/assigned-farmlands`,
    all_inprogress_farmland: `${ROOTS.VALUATION_OFFICER}/inprogress-farmlands`,
    all_farmland_list: `${ROOTS.VALUATION_OFFICER}/total-farmland-list`,
    documents: (id: number) => `${ROOTS.VALUATION_OFFICER}/documents/${id}`,
  },

  // super admin navigation path
  superAdmin: {
    root: ROOTS.SUPER_ADMIN,
    change_password: `${ROOTS.SUPER_ADMIN}/change-password`,
    all_farmland_list: `${ROOTS.SUPER_ADMIN}/farmlands-list-details`,
    documents: (id: number) => `${ROOTS.SUPER_ADMIN}/documents/${id}`,
  },
};
