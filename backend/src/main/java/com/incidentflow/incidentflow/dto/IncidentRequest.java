package com.incidentflow.incidentflow.dto;

import com.incidentflow.incidentflow.entity.Incident;

public class IncidentRequest {

    private String title;
    private String description;
    private Incident.Severity severity;
    private Incident.Status status;

    public IncidentRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Incident.Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Incident.Severity severity) {
        this.severity = severity;
    }

    public Incident.Status getStatus() {
        return status;
    }

    public void setStatus(Incident.Status status) {
        this.status = status;
    }
}