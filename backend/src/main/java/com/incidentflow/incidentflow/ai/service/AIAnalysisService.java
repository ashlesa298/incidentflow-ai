package com.incidentflow.incidentflow.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.incidentflow.incidentflow.ai.dto.AIAnalysisResponse;
import com.incidentflow.incidentflow.ai.entity.AIAnalysis;
import com.incidentflow.incidentflow.ai.repository.AIAnalysisRepository;
import com.incidentflow.incidentflow.entity.Incident;
import com.incidentflow.incidentflow.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIAnalysisService {

    private final AIAnalysisRepository aiAnalysisRepository;
    private final IncidentRepository incidentRepository;
    private final AIProviderService aiProviderService;
    private final ObjectMapper objectMapper;

    public AIAnalysisService(
            AIAnalysisRepository aiAnalysisRepository,
            IncidentRepository incidentRepository,
            AIProviderService aiProviderService,
            ObjectMapper objectMapper) {

        this.aiAnalysisRepository = aiAnalysisRepository;
        this.incidentRepository = incidentRepository;
        this.aiProviderService = aiProviderService;
        this.objectMapper = objectMapper;
    }

    public AIAnalysisResponse generateAnalysis(Long incidentId) {

        AIAnalysis existingAnalysis =
                aiAnalysisRepository.findByIncidentId(incidentId)
                        .orElse(null);

        if (existingAnalysis != null) {
            return toResponse(existingAnalysis);
        }

        Incident incident =
                incidentRepository.findById(incidentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Incident not found: " + incidentId
                                )
                        );

        String aiResponse =
                aiProviderService.analyzeIncident(
                        incident.getTitle(),
                        incident.getDescription(),
                        incident.getSeverity().name(),
                        incident.getStatus().name()
                );

        try {

            JsonNode jsonNode =
                    objectMapper.readTree(aiResponse);

            AIAnalysis analysis = new AIAnalysis();

            analysis.setIncident(incident);

            analysis.setSummary(
                    jsonNode.path("summary").asText("")
            );

            analysis.setRootCauseSuggestions(
                    convertJsonArrayToText(
                            jsonNode.path("rootCauseSuggestions")
                    )
            );

            analysis.setImpactAssessment(
                    jsonNode.path("impactAssessment").asText("")
            );

            analysis.setRecommendedActions(
                    convertJsonArrayToText(
                            jsonNode.path("recommendedActions")
                    )
            );

            AIAnalysis savedAnalysis =
                    aiAnalysisRepository.save(analysis);

            return toResponse(savedAnalysis);

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to process AI analysis response.",
                    exception
            );
        }
    }

    public AIAnalysisResponse getAnalysis(Long incidentId) {

        AIAnalysis analysis =
                aiAnalysisRepository.findByIncidentId(incidentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "AI analysis not found for incident: "
                                                + incidentId
                                )
                        );

        return toResponse(analysis);
    }

    private AIAnalysisResponse toResponse(AIAnalysis analysis) {

        return new AIAnalysisResponse(
                analysis.getId(),
                analysis.getIncident().getId(),
                analysis.getSummary(),
                parseList(
                        analysis.getRootCauseSuggestions()
                ),
                analysis.getImpactAssessment(),
                parseList(
                        analysis.getRecommendedActions()
                ),
                analysis.getCreatedAt()
        );
    }

    private String convertJsonArrayToText(
            JsonNode arrayNode) {

        if (!arrayNode.isArray()) {
            return "";
        }

        StringBuilder result =
                new StringBuilder();

        for (JsonNode item : arrayNode) {

            if (result.length() > 0) {
                result.append("\n");
            }

            result.append(
                    item.asText("")
            );
        }

        return result.toString();
    }

    private List<String> parseList(String value) {

        if (value == null || value.isBlank()) {
            return List.of();
        }

        return List.of(
                value.split("\\n")
        );
    }
}