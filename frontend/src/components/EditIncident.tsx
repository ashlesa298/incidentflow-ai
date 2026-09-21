import { useState } from "react";
import type { FormEvent } from "react";
import {
  updateIncident,
  type Incident,
  type IncidentRequest,
} from "../services/incidentApi";

interface EditIncidentProps {
  incident: Incident;
  onCancel: () => void;
  onUpdated?: () => void;
}

const EditIncident = ({
  incident,
  onCancel,
  onUpdated,
}: EditIncidentProps) => {
  const [title, setTitle] = useState(incident.title);
  const [description, setDescription] = useState(
    incident.description
  );

  const [severity, setSeverity] =
    useState<IncidentRequest["severity"]>(
      incident.severity
    );

  const [status, setStatus] =
    useState<IncidentRequest["status"]>(
      incident.status
    );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
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

      await updateIncident(
        token,
        incident.id,
        incidentData
      );

      setSuccess("Incident updated successfully.");

      if (onUpdated) {
        setTimeout(() => {
          onUpdated();
        }, 500);
      }
    } catch (err) {
      console.error("Update incident error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update incident. Please try again."
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

            <h2>Edit Incident</h2>

            <p className="create-incident-subtitle">
              Update the incident details and current status.
            </p>
          </div>

          <button
            type="button"
            className="create-incident-close"
            onClick={onCancel}
            aria-label="Close edit incident form"
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
            <label htmlFor="edit-incident-title">
              Title
            </label>

            <input
              id="edit-incident-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              maxLength={150}
              disabled={loading}
            />
          </div>

          <div className="create-incident-field">
            <label htmlFor="edit-incident-description">
              Description
            </label>

            <textarea
              id="edit-incident-description"
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
              <label htmlFor="edit-incident-severity">
                Severity
              </label>

              <select
                id="edit-incident-severity"
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
                <option value="CRITICAL">
                  Critical
                </option>
              </select>
            </div>

            <div className="create-incident-field">
              <label htmlFor="edit-incident-status">
                Status
              </label>

              <select
                id="edit-incident-status"
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
                <option value="RESOLVED">
                  Resolved
                </option>
                <option value="CLOSED">
                  Closed
                </option>
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
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncident;