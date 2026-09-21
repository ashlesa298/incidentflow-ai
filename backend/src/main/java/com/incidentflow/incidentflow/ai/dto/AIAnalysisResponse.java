package com.incidentflow.incidentflow.ai.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AIAnalysisResponse {

    private Long id;
    private Long incidentId;
    private String summary;
    private List<String> rootCauseSuggestions;
    private String impactAssessment;
    private List<String> recommendedActions;
    private LocalDateTime createdAt;

    public AIAnalysisResponse() {
    }

    public AIAnalysisResponse(
            Long id,
            Long incidentId,
            String summary,
            List<String> rootCauseSuggestions,
            String impactAssessment,
            List<String> recommendedActions,
            LocalDateTime createdAt) {

        this.id = id;
        this.incidentId = incidentId;
        this.summary = summary;
        this.rootCauseSuggestions = rootCauseSuggestions;
        this.impactAssessment = impactAssessment;
        this.recommendedActions = recommendedActions;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getIncidentId() {
        return incidentId;
    }

    public String getSummary() {
        return summary;
    }

    public List<String> getRootCauseSuggestions() {
        return rootCauseSuggestions;
    }

    public String getImpactAssessment() {
        return impactAssessment;
    }

    public List<String> getRecommendedActions() {
        return recommendedActions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public void setRootCauseSuggestions(List<String> rootCauseSuggestions) {
        this.rootCauseSuggestions = rootCauseSuggestions;
    }

    public void setImpactAssessment(String impactAssessment) {
        this.impactAssessment = impactAssessment;
    }

    public void setRecommendedActions(List<String> recommendedActions) {
        this.recommendedActions = recommendedActions;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}