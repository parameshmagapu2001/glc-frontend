// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.HOST_API_KEY;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

// ROOT PATH AFTER LOGIN SUCCESSFULL
export const RM_PATH_AFTER_LOGIN = paths.rm.root;
export const FO_PATH_AFTER_LOGIN = paths.fo.root;
export const RO_PATH_AFTER_LOGIN = paths.ro.root;
export const IO_PATH_AFTER_LOGIN = paths.io.root;
export const CCS_PATH_AFTER_LOGIN = paths.ccs.root;
export const ADMIN_PATH_AFTER_LOGIN = paths.superAdmin.root;
export const VO_PATH_AFTER_LOGIN = paths.vo.root;
export const login = paths.auth.login;


