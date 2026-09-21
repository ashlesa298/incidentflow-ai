package com.incidentflow.incidentflow.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.incidentflow.incidentflow.dto.IncidentRequest;
import com.incidentflow.incidentflow.dto.IncidentResponse;
import com.incidentflow.incidentflow.service.IncidentService;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(
            @RequestBody IncidentRequest request,
            Authentication authentication) {

        IncidentResponse response =
                incidentService.createIncident(
                        request,
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getAllIncidents() {

        return ResponseEntity.ok(
                incidentService.getAllIncidents()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(
            @PathVariable Long id) {

        return incidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentResponse> updateIncident(
            @PathVariable Long id,
            @RequestBody IncidentRequest request) {

        return ResponseEntity.ok(
                incidentService.updateIncident(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(
            @PathVariable Long id) {

        incidentService.deleteIncident(id);

        return ResponseEntity.noContent().build();
    }
}