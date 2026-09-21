package com.incidentflow.incidentflow.ai.service;

public interface AIProviderService {

    String analyzeIncident(
            String title,
            String description,
            String severity,
            String status
    );

    String chat(
            String userMessage,
            String incidentContext
    );
}