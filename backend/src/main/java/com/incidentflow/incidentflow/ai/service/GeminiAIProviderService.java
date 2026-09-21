package com.incidentflow.incidentflow.ai.service;

import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;

@Service
public class GeminiAIProviderService implements AIProviderService {

    private final Client geminiClient;

    public GeminiAIProviderService() {
        String apiKey = System.getenv("GEMINI_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "GEMINI_API_KEY environment variable is not configured."
            );
        }

        this.geminiClient = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    @Override
    public String analyzeIncident(
            String title,
            String description,
            String severity,
            String status) {

        String prompt = """
                You are an AI incident analysis assistant for an IT incident management platform.

                Analyze the following software/IT incident.

                Incident Title:
                %s

                Incident Description:
                %s

                Severity:
                %s

                Status:
                %s

                Provide a practical engineering-oriented analysis.

                Return the response in this exact JSON structure:

                {
                  "summary": "A concise professional summary of the incident.",
                  "rootCauseSuggestions": [
                    "Possible root cause 1",
                    "Possible root cause 2",
                    "Possible root cause 3"
                  ],
                  "impactAssessment": "Describe the likely technical or business impact.",
                  "recommendedActions": [
                    "Recommended investigation or action 1",
                    "Recommended investigation or action 2",
                    "Recommended investigation or action 3"
                  ]
                }

                Important:
                - Treat root causes as suggestions, not confirmed facts.
                - Do not invent logs, metrics, systems, or evidence that were not provided.
                - Keep the recommendations practical for an engineering team.
                - Return valid JSON only.
                """.formatted(
                title,
                description == null ? "No description provided." : description,
                severity,
                status
        );

        Content content = Content.builder()
                .parts(Part.fromText(prompt))
                .build();

        GenerateContentConfig config = GenerateContentConfig.builder()
                .responseMimeType("application/json")
                .build();

        GenerateContentResponse response = geminiClient.models.generateContent(
                "gemini-3.6-flash",
                content,
                config
        );

        return response.text();
    }

    @Override
    public String chat(
            String userMessage,
            String incidentContext) {

        String context = incidentContext == null || incidentContext.isBlank()
                ? "No specific IncidentFlow incident has been selected."
                : incidentContext;

        String prompt = """
                You are IncidentFlow AI, an AI developer copilot for an IT incident management platform.

                Your role is to help software developers and engineering teams:
                - diagnose technical problems
                - debug application errors
                - investigate incidents
                - identify possible root causes
                - suggest practical fixes
                - explain technical concepts
                - improve reliability, performance, security, and deployment practices

                Be practical, technically accurate, and engineering-oriented.

                IMPORTANT:
                - Do not claim that a possible root cause is confirmed unless the provided evidence confirms it.
                - Do not invent logs, metrics, configuration, infrastructure, database state, or other evidence.
                - Clearly distinguish assumptions from facts.
                - When debugging, give a logical sequence of checks.
                - When suggesting code, keep it focused and explain where it belongs.
                - If important information is missing, ask a concise follow-up question.
                - Prefer actionable guidance over generic explanations.

                INCIDENT CONTEXT:
                %s

                DEVELOPER QUESTION:
                %s

                Provide a helpful response for the developer.
                """.formatted(
                context,
                userMessage
        );

        Content content = Content.builder()
                .parts(Part.fromText(prompt))
                .build();

        GenerateContentConfig config = GenerateContentConfig.builder()
                .responseMimeType("text/plain")
                .build();

        GenerateContentResponse response = geminiClient.models.generateContent(
                "gemini-3.6-flash",
                content,
                config
        );

        return response.text();
    }
}