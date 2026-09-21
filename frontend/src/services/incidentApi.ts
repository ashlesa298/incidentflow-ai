const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export interface IncidentRequest {
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
}

export interface AIAnalysis {
  id: number;
  incidentId: number;
  summary: string;
  rootCauseSuggestions: string[];
  impactAssessment: string;
  recommendedActions: string[];
  createdAt: string;
}

const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getIncidents = async (
  token: string
): Promise<Incident[]> => {
  const response = await fetch(`${API_BASE_URL}/incidents`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch incidents: ${response.status}`);
  }

  return response.json();
};

export const getIncidentById = async (
  token: string,
  id: number
): Promise<Incident> => {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch incident: ${response.status}`);
  }

  return response.json();
};

export const createIncident = async (
  token: string,
  incident: IncidentRequest
): Promise<Incident> => {
  const response = await fetch(`${API_BASE_URL}/incidents`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(incident),
  });

  if (!response.ok) {
    throw new Error(`Failed to create incident: ${response.status}`);
  }

  return response.json();
};

export const updateIncident = async (
  token: string,
  id: number,
  incident: IncidentRequest
): Promise<Incident> => {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(incident),
  });

  if (!response.ok) {
    throw new Error(`Failed to update incident: ${response.status}`);
  }

  return response.json();
};

export const deleteIncident = async (
  token: string,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete incident: ${response.status}`);
  }
};

export const generateAIAnalysis = async (
  token: string,
  incidentId: number
): Promise<AIAnalysis> => {
  const response = await fetch(
    `${API_BASE_URL}/incidents/${incidentId}/ai-analysis`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to generate AI analysis: ${response.status}`);
  }

  return response.json();
};

export const getAIAnalysis = async (
  token: string,
  incidentId: number
): Promise<AIAnalysis> => {
  const response = await fetch(
    `${API_BASE_URL}/incidents/${incidentId}/ai-analysis`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch AI analysis: ${response.status}`);
  }

  return response.json();
};