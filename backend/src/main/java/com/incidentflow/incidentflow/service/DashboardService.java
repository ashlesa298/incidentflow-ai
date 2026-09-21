package com.incidentflow.incidentflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.incidentflow.incidentflow.dto.DashboardResponse;
import com.incidentflow.incidentflow.entity.Incident;
import com.incidentflow.incidentflow.repository.IncidentRepository;

@Service
public class DashboardService {

    private final IncidentRepository incidentRepository;

    public DashboardService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public DashboardResponse getDashboardStatistics() {

        List<Incident> incidents = incidentRepository.findAll();

        long totalIncidents = incidents.size();

        long openIncidents = incidents.stream()
                .filter(incident -> incident.getStatus() == Incident.Status.OPEN)
                .count();

        long inProgressIncidents = incidents.stream()
                .filter(incident -> incident.getStatus() == Incident.Status.IN_PROGRESS)
                .count();

        long resolvedIncidents = incidents.stream()
                .filter(incident -> incident.getStatus() == Incident.Status.RESOLVED)
                .count();

        long closedIncidents = incidents.stream()
                .filter(incident -> incident.getStatus() == Incident.Status.CLOSED)
                .count();

        long criticalIncidents = incidents.stream()
                .filter(incident -> incident.getSeverity() == Incident.Severity.CRITICAL)
                .count();

        long highIncidents = incidents.stream()
                .filter(incident -> incident.getSeverity() == Incident.Severity.HIGH)
                .count();

        long mediumIncidents = incidents.stream()
                .filter(incident -> incident.getSeverity() == Incident.Severity.MEDIUM)
                .count();

        long lowIncidents = incidents.stream()
                .filter(incident -> incident.getSeverity() == Incident.Severity.LOW)
                .count();

        return new DashboardResponse(
                totalIncidents,
                openIncidents,
                inProgressIncidents,
                resolvedIncidents,
                closedIncidents,
                criticalIncidents,
                highIncidents,
                mediumIncidents,
                lowIncidents
        );
    }
}