package com.incidentflow.incidentflow.controller;

import com.incidentflow.incidentflow.ai.dto.AIAnalysisResponse;
import com.incidentflow.incidentflow.ai.service.AIAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/incidents/{incidentId}/ai-analysis")
public class AIAnalysisController {

    private final AIAnalysisService aiAnalysisService;

    public AIAnalysisController(AIAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    @PostMapping
    public ResponseEntity<AIAnalysisResponse> generateAnalysis(
            @PathVariable Long incidentId) {

        return ResponseEntity.ok(
                aiAnalysisService.generateAnalysis(incidentId)
        );
    }

    @GetMapping
    public ResponseEntity<AIAnalysisResponse> getAnalysis(
            @PathVariable Long incidentId) {

        return ResponseEntity.ok(
                aiAnalysisService.getAnalysis(incidentId)
        );
    }
}