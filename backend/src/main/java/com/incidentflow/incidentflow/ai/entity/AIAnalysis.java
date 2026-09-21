package com.incidentflow.incidentflow.ai.entity;

import com.incidentflow.incidentflow.entity.Incident;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses")
public class AIAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "incident_id", nullable = false, unique = true)
    private Incident incident;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String rootCauseSuggestions;

    @Column(columnDefinition = "TEXT")
    private String impactAssessment;

    @Column(columnDefinition = "TEXT")
    private String recommendedActions;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AIAnalysis() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Incident getIncident() {
        return incident;
    }

    public void setIncident(Incident incident) {
        this.incident = incident;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getRootCauseSuggestions() {
        return rootCauseSuggestions;
    }

    public void setRootCauseSuggestions(String rootCauseSuggestions) {
        this.rootCauseSuggestions = rootCauseSuggestions;
    }

    public String getImpactAssessment() {
        return impactAssessment;
    }

    public void setImpactAssessment(String impactAssessment) {
        this.impactAssessment = impactAssessment;
    }

    public String getRecommendedActions() {
        return recommendedActions;
    }

    public void setRecommendedActions(String recommendedActions) {
        this.recommendedActions = recommendedActions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}