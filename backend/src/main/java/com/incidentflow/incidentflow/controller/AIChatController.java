package com.incidentflow.incidentflow.controller;

import com.incidentflow.incidentflow.dto.AIChatRequest;
import com.incidentflow.incidentflow.dto.AIChatResponse;
import com.incidentflow.incidentflow.ai.service.AIChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    private final AIChatService aiChatService;

    public AIChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AIChatResponse> chat(
            @RequestBody AIChatRequest request) {

        return ResponseEntity.ok(
                aiChatService.chat(
                        request.getMessage(),
                        request.getIncidentContext()
                )
        );
    }
}