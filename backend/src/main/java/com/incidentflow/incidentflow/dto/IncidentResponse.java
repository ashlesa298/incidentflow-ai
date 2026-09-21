package com.incidentflow.incidentflow.dto;

import java.time.LocalDateTime;

import com.incidentflow.incidentflow.entity.Incident;

public class IncidentResponse {

    private Long id;
    private String title;
    private String description;
    private Incident.Severity severity;
    private Incident.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;

    public IncidentResponse() {
    }

    public IncidentResponse(
            Long id,
            String title,
            String description,
            Incident.Severity severity,
            Incident.Status status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            String createdBy) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Incident.Severity getSeverity() {
        return severity;
    }

    public Incident.Status getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }
}