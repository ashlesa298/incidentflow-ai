const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface DashboardResponse {
    totalIncidents: number;
    openIncidents: number;
    inProgressIncidents: number;
    resolvedIncidents: number;
    closedIncidents: number;
    criticalIncidents: number;
    highIncidents: number;
    mediumIncidents: number;
    lowIncidents: number;
}

export const healthCheck = async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.text();
};

export const getDashboardStatistics = async (
    token: string
): Promise<DashboardResponse> => {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Dashboard API request failed: ${response.status}`);
    }

    return response.json();
};