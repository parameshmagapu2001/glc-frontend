// ----------------------------------------------------------------------
export type IForgotRequest = {
  loginId: string,
  password: string,
  verificationCode: string
};

export type IChangePasswordRequest = {
  password: string,
  oldPassword: string
};