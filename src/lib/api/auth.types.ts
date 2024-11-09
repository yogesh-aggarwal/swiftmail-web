export enum AuthAPIError {
   INVALID_EMAIL = "INVALID_EMAIL",
   INVALID_PASSWORD = "INVALID_PASSWORD",
   USER_NOT_FOUND = "USER_NOT_FOUND",
}

export const AuthAPIErrorMessageDescription: Record<string, string> = {
   [AuthAPIError.INVALID_EMAIL]: "Invalid email",
   [AuthAPIError.INVALID_PASSWORD]: "Invalid password",
   [AuthAPIError.USER_NOT_FOUND]: "User not found",
}
