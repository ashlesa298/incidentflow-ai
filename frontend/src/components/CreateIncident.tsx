import { useState } from "react";
import type { FormEvent } from "react";
import {
  createIncident,
  type IncidentRequest,
} from "../services/incidentApi";

interface CreateIncidentProps {
  onCancel: () => void;
  onCreated?: () => void;
}

const CreateIncident = ({
  onCancel,
  onCreated,
}: CreateIncidentProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] =
    useState<IncidentRequest["severity"]>("MEDIUM");
  const [status, setStatus] =
    useState<IncidentRequest["status"]>("OPEN");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Incident title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Incident description is required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      setLoading(true);

      const incidentData: IncidentRequest = {
        title: title.trim(),
        description: description.trim(),
        severity,
        status,
      };

      await createIncident(token, incidentData);

      setSuccess("Incident created successfully.");

      setTitle("");
      setDescription("");
      setSeverity("MEDIUM");
      setStatus("OPEN");

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      console.error("Create incident error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create incident. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-incident-overlay">
      <div className="create-incident-modal">
        <div className="create-incident-header">
          <div>
            <p className="create-incident-eyebrow">
              INCIDENT MANAGEMENT
            </p>

            <h2>Create Incident</h2>

            <p className="create-incident-subtitle">
              Report a new incident and track its resolution.
            </p>
          </div>

          <button
            type="button"
            className="create-incident-close"
            onClick={onCancel}
            aria-label="Close create incident form"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="create-incident-form"
        >
          <div className="create-incident-field">
            <label htmlFor="incident-title">
              Title
            </label>

            <input
              id="incident-title"
              type="text"
              placeholder="e.g. Payment service unavailable"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              disabled={loading}
            />
          </div>

          <div className="create-incident-field">
            <label htmlFor="incident-description">
              Description
            </label>

            <textarea
              id="incident-description"
              placeholder="Describe what happened, the affected system, and the impact..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={5}
              disabled={loading}
            />
          </div>

          <div className="create-incident-row">
            <div className="create-incident-field">
              <label htmlFor="incident-severity">
                Severity
              </label>

              <select
                id="incident-severity"
                value={severity}
                onChange={(event) =>
                  setSeverity(
                    event.target.value as IncidentRequest["severity"]
                  )
                }
                disabled={loading}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="create-incident-field">
              <label htmlFor="incident-status">
                Status
              </label>

              <select
                id="incident-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as IncidentRequest["status"]
                  )
                }
                disabled={loading}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="create-incident-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="create-incident-message success">
              {success}
            </div>
          )}

          <div className="create-incident-actions">
            <button
              type="button"
              className="create-incident-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-incident-submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncident;