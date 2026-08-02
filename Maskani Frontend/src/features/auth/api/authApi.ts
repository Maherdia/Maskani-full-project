import api from "../../../lib/api/apiClient";
import type {
    LoginRequest,
    LoginResponse,
} from "../types/auth.types";
import type {
    RegisterRequest,
    RegisterResponse,
} from "../types/auth.types";

export async function login(
    credentials: LoginRequest
): Promise<LoginResponse> {

    const response =
        await api.post<LoginResponse>(
            "/LoginAndSignin/login",
            credentials
        );

    return response.data;
}
export async function register(
    data: RegisterRequest
): Promise<RegisterResponse> {

    const response =
        await api.post<RegisterResponse>(
            "/LoginAndSignin/register",
            data
        );

    return response.data;
}