package com.incidentflow.incidentflow.ai.service;

import org.springframework.stereotype.Service;

import com.incidentflow.incidentflow.dto.AIChatResponse;

@Service
public class AIChatService {

    private final AIProviderService aiProviderService;

    public AIChatService(AIProviderService aiProviderService) {
        this.aiProviderService = aiProviderService;
    }

    public AIChatResponse chat(
            String message,
            String incidentContext) {

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException(
                    "AI chat message cannot be empty."
            );
        }

        String response =
                aiProviderService.chat(
                        message.trim(),
                        incidentContext
                );

        return new AIChatResponse(response);
    }
}