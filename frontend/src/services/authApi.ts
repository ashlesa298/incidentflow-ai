const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    token: string;
}

export const loginUser = async (
    loginData: LoginRequest
): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
    }

    return response.json();
};