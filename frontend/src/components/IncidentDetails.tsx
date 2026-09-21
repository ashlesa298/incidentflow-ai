import { useEffect, useState } from "react";
import {
  getIncidentById,
  generateAIAnalysis,
  getAIAnalysis,
  type Incident,
  type AIAnalysis,
} from "../services/incidentApi";

interface IncidentDetailsProps {
  incidentId: number;
  onBack: () => void;
  onEdit?: (incident: Incident) => void;
}

function IncidentDetails({
  incidentId,
  onBack,
  onEdit,
}: IncidentDetailsProps) {
  const [incident, setIncident] =
    useState<Incident | null>(null);

  const [aiAnalysis, setAIAnalysis] =
    useState<AIAnalysis | null>(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAILoading] = useState(false);

  const [error, setError] = useState("");
  const [aiError, setAIError] = useState("");

  const loadIncident = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const data = await getIncidentById(
        token,
        incidentId
      );

      setIncident(data);
    } catch (err) {
      console.error("Load incident details error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load incident details."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAIAnalysis = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAIError("Authentication token not found.");
      return;
    }

    try {
      setAIError("");

      const data = await getAIAnalysis(
        token,
        incidentId
      );

      setAIAnalysis(data);
    } catch (err) {
      console.log(
        "No existing AI analysis found for this incident."
      );
    }
  };

  const handleGenerateAIAnalysis = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAIError("Authentication token not found.");
      return;
    }

    try {
      setAILoading(true);
      setAIError("");

      const data = await generateAIAnalysis(
        token,
        incidentId
      );

      setAIAnalysis(data);
    } catch (err) {
      console.error(
        "Generate AI analysis error:",
        err
      );

      setAIError(
        err instanceof Error
          ? err.message
          : "Failed to generate AI analysis."
      );
    } finally {
      setAILoading(false);
    }
  };

  useEffect(() => {
    loadIncident();
    loadAIAnalysis();
  }, [incidentId]);

  if (loading) {
    return (
      <div className="incident-page-state">
        <div className="incident-loading-icon">
          Γùê
        </div>

        <h3>Loading incident...</h3>

        <p>
          Fetching incident details.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="incident-page-state incident-error-state">
        <div className="incident-loading-icon">
          !
        </div>

        <h3>Unable to load incident</h3>

        <p>{error}</p>

        <button
          className="load-dashboard-button"
          onClick={onBack}
        >
          ΓåÉ Back to Incidents
        </button>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="incident-page-state">
        <div className="incident-loading-icon">
          ?
        </div>

        <h3>Incident not found</h3>

        <p>
          The requested incident could not be found.
        </p>

        <button
          className="load-dashboard-button"
          onClick={onBack}
        >
          ΓåÉ Back to Incidents
        </button>
      </div>
    );
  }

  return (
    <section className="incident-details-section">
      <div className="incident-details-topbar">
        <button
          type="button"
          className="load-dashboard-button"
          onClick={onBack}
        >
          ΓåÉ Back to Incidents
        </button>

        <div className="incident-details-actions">
          {onEdit && (
            <button
              type="button"
              className="incident-edit-button"
              onClick={() => onEdit(incident)}
            >
              Edit Incident
            </button>
          )}
        </div>
      </div>

      <div className="incident-details-header">
        <div>
          <div className="breadcrumb">
            WORKSPACE / INCIDENTS / #{incident.id}
          </div>

          <h2>{incident.title}</h2>

          <p>
            Detailed information and activity for this
            incident.
          </p>
        </div>

        <div className="incident-details-badges">
          <span
            className={`severity-badge severity-${incident.severity.toLowerCase()}`}
          >
            {incident.severity}
          </span>

          <span
            className={`status-badge status-${incident.status.toLowerCase()}`}
          >
            {incident.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="incident-details-grid">
        <div className="incident-details-card incident-description-card">
          <div className="incident-details-card-header">
            <span>INCIDENT DESCRIPTION</span>
          </div>

          <p className="incident-details-description">
            {incident.description}
          </p>
        </div>

        <div className="incident-details-card">
          <div className="incident-details-card-header">
            <span>INCIDENT INFORMATION</span>
          </div>

          <div className="incident-details-info-list">
            <div className="incident-details-info-item">
              <span>Incident ID</span>
              <strong>#{incident.id}</strong>
            </div>

            <div className="incident-details-info-item">
              <span>Created By</span>
              <strong>
                User #{incident.createdBy}
              </strong>
            </div>

            <div className="incident-details-info-item">
              <span>Created</span>
              <strong>
                {new Date(
                  incident.createdAt
                ).toLocaleString()}
              </strong>
            </div>

            <div className="incident-details-info-item">
              <span>Last Updated</span>
              <strong>
                {new Date(
                  incident.updatedAt
                ).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="incident-details-card ai-analysis-card">
        <div className="incident-details-card-header">
          <span>AI INCIDENT ANALYSIS</span>

          <button
            type="button"
            className="incident-edit-button"
            onClick={handleGenerateAIAnalysis}
            disabled={aiLoading}
          >
            {aiLoading
              ? "Analyzing..."
              : aiAnalysis
                ? "Refresh AI Analysis"
                : "Generate AI Analysis"}
          </button>
        </div>

        {aiError && (
          <p className="incident-details-description">
            {aiError}
          </p>
        )}

        {!aiAnalysis && !aiLoading && !aiError && (
          <p className="incident-details-description">
            Generate an AI-powered analysis to get a
            summary, possible root causes, impact
            assessment, and recommended actions.
          </p>
        )}

        {aiLoading && (
          <p className="incident-details-description">
            Gemini is analyzing this incident. Please
            wait...
          </p>
        )}

        {aiAnalysis && !aiLoading && (
          <div className="ai-analysis-content">
            <div className="ai-analysis-section">
              <h4>Summary</h4>
              <p>{aiAnalysis.summary}</p>
            </div>

            <div className="ai-analysis-section">
              <h4>Possible Root Causes</h4>

              <ul>
                {aiAnalysis.rootCauseSuggestions.map(
                  (cause, index) => (
                    <li key={index}>{cause}</li>
                  )
                )}
              </ul>
            </div>

            <div className="ai-analysis-section">
              <h4>Impact Assessment</h4>
              <p>
                {aiAnalysis.impactAssessment}
              </p>
            </div>

            <div className="ai-analysis-section">
              <h4>Recommended Actions</h4>

              <ul>
                {aiAnalysis.recommendedActions.map(
                  (action, index) => (
                    <li key={index}>{action}</li>
                  )
                )}
              </ul>
            </div>

            <div className="ai-analysis-generated">
              Generated:{" "}
              {new Date(
                aiAnalysis.createdAt
              ).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default IncidentDetails;