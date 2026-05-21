import type { UserApiResponse } from "../model/user.type";

function isValidUserApiResponse(
  value: unknown
): value is UserApiResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as UserApiResponse;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.first_name === "string" &&
    typeof candidate.email === "string"
  );
}

export function validateUsersApiResponse(
  users: unknown[]
): UserApiResponse[] {
  return users.filter(isValidUserApiResponse);
}