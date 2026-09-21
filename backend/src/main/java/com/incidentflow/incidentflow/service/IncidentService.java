package com.incidentflow.incidentflow.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.incidentflow.incidentflow.dto.IncidentRequest;
import com.incidentflow.incidentflow.dto.IncidentResponse;
import com.incidentflow.incidentflow.entity.Incident;
import com.incidentflow.incidentflow.repository.IncidentRepository;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public IncidentResponse createIncident(
            IncidentRequest request,
            String createdBy) {

        Incident incident = new Incident();

        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(request.getStatus());
        incident.setCreatedBy(createdBy);

        Incident savedIncident = incidentRepository.save(incident);

        return mapToResponse(savedIncident);
    }

    public List<IncidentResponse> getAllIncidents() {

        return incidentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Optional<IncidentResponse> getIncidentById(Long id) {

        return incidentRepository.findById(id)
                .map(this::mapToResponse);
    }

    public IncidentResponse updateIncident(
            Long id,
            IncidentRequest request) {

        Incident existingIncident = incidentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Incident not found with id: " + id));

        existingIncident.setTitle(request.getTitle());
        existingIncident.setDescription(request.getDescription());
        existingIncident.setSeverity(request.getSeverity());
        existingIncident.setStatus(request.getStatus());

        Incident updatedIncident =
                incidentRepository.save(existingIncident);

        return mapToResponse(updatedIncident);
    }

    public void deleteIncident(Long id) {

        if (!incidentRepository.existsById(id)) {
            throw new RuntimeException(
                    "Incident not found with id: " + id);
        }

        incidentRepository.deleteById(id);
    }

    private IncidentResponse mapToResponse(Incident incident) {

        return new IncidentResponse(
                incident.getId(),
                incident.getTitle(),
                incident.getDescription(),
                incident.getSeverity(),
                incident.getStatus(),
                incident.getCreatedAt(),
                incident.getUpdatedAt(),
                incident.getCreatedBy()
        );
    }
}