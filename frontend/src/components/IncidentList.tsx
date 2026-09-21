import { useEffect, useState } from "react";
import {
  deleteIncident,
  getIncidents,
  type Incident,
} from "../services/incidentApi";
import CreateIncident from "./CreateIncident";
import EditIncident from "./EditIncident";
import IncidentDetails from "./IncidentDetails";

function IncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingIncident, setEditingIncident] =
    useState<Incident | null>(null);
  const [deletingIncidentId, setDeletingIncidentId] =
    useState<number | null>(null);
  const [viewingIncidentId, setViewingIncidentId] =
    useState<number | null>(null);

  const loadIncidents = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const data = await getIncidents(token);

      setIncidents(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load incidents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleIncidentCreated = async () => {
    setShowCreateForm(false);
    await loadIncidents();
  };

  const handleIncidentUpdated = async () => {
    setEditingIncident(null);
    await loadIncidents();
  };

  const handleEditClick = (incident: Incident) => {
    setEditingIncident(incident);
  };

  const handleDeleteClick = async (incident: Incident) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete incident #${incident.id}?\n\n"${incident.title}"`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      setError("");
      setDeletingIncidentId(incident.id);

      await deleteIncident(token, incident.id);

      await loadIncidents();
    } catch (err) {
      console.error("Delete incident error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete incident."
      );
    } finally {
      setDeletingIncidentId(null);
    }
  };

  const handleViewClick = (incident: Incident) => {
    setViewingIncidentId(incident.id);
  };

  const handleBackToIncidents = () => {
    setViewingIncidentId(null);
  };

  if (viewingIncidentId !== null) {
    return (
      <IncidentDetails
        incidentId={viewingIncidentId}
        onBack={handleBackToIncidents}
        onEdit={(incident) => {
          setViewingIncidentId(null);
          setEditingIncident(incident);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="incident-page-state">
        <div className="incident-loading-icon">◈</div>

        <h3>Loading incidents...</h3>

        <p>
          Fetching the latest incident data.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="incident-page-state incident-error-state">
        <div className="incident-loading-icon">!</div>

        <h3>Unable to load incidents</h3>

        <p>{error}</p>

        <button
          className="load-dashboard-button"
          onClick={loadIncidents}
        >
          Try again ↻
        </button>
      </div>
    );
  }

  return (
    <section className="incident-list-section">
      <div className="incident-list-header">
        <div>
          <div className="breadcrumb">
            WORKSPACE / INCIDENTS
          </div>

          <h2>Incident Management</h2>

          <p>
            Monitor, investigate and manage your team's incidents.
          </p>
        </div>

        <div className="incident-header-actions">
          <button
            className="create-incident-button"
            onClick={() => setShowCreateForm(true)}
          >
            + Create Incident
          </button>

          <button
            className="load-dashboard-button"
            onClick={loadIncidents}
          >
            Refresh ↻
          </button>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="incident-page-state">
          <div className="incident-loading-icon">◈</div>

          <h3>No incidents found</h3>

          <p>
            Create your first incident to start managing
            incident activity.
          </p>

          <button
            className="create-incident-button"
            onClick={() => setShowCreateForm(true)}
          >
            + Create Incident
          </button>
        </div>
      ) : (
        <div className="incident-table-wrapper">
          <table className="incident-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Incident</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {incidents.map((incident) => {
                const isDeleting =
                  deletingIncidentId === incident.id;

                return (
                  <tr key={incident.id}>
                    <td>
                      <span className="incident-id">
                        #{incident.id}
                      </span>
                    </td>

                    <td>
                      <div className="incident-title-cell">
                        <strong>{incident.title}</strong>

                        <span>
                          {incident.description}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`severity-badge severity-${incident.severity.toLowerCase()}`}
                      >
                        {incident.severity}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge status-${incident.status.toLowerCase()}`}
                      >
                        {incident.status.replace("_", " ")}
                      </span>
                    </td>

                    <td>
                      <span className="incident-date">
                        {new Date(
                          incident.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </td>

                    <td>
                      <div className="incident-action-buttons">
                        <button
                          type="button"
                          className="incident-view-button"
                          onClick={() =>
                            handleViewClick(incident)
                          }
                          disabled={isDeleting}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="incident-edit-button"
                          onClick={() =>
                            handleEditClick(incident)
                          }
                          disabled={isDeleting}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="incident-delete-button"
                          onClick={() =>
                            handleDeleteClick(incident)
                          }
                          disabled={isDeleting}
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showCreateForm && (
        <CreateIncident
          onCancel={() => setShowCreateForm(false)}
          onCreated={handleIncidentCreated}
        />
      )}

      {editingIncident && (
        <EditIncident
          incident={editingIncident}
          onCancel={() => setEditingIncident(null)}
          onUpdated={handleIncidentUpdated}
        />
      )}
    </section>
  );
}

export default IncidentList;