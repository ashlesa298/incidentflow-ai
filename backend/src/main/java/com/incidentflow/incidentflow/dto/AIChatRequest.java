package com.incidentflow.incidentflow.dto;

public class AIChatRequest {

    private String message;
    private String incidentContext;

    public AIChatRequest() {
    }

    public AIChatRequest(String message, String incidentContext) {
        this.message = message;
        this.incidentContext = incidentContext;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getIncidentContext() {
        return incidentContext;
    }

    public void setIncidentContext(String incidentContext) {
        this.incidentContext = incidentContext;
    }
}