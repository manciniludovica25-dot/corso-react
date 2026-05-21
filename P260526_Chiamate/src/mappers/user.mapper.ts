import type { User, UserApiResponse } from "../model/user.type";

export function mapUserApiResponseToUser(
    userApiResponse: UserApiResponse
): User {
    return {
        id: userApiResponse.id,
        fullName: userApiResponse.first_name,
        email: userApiResponse.email
    }
}
