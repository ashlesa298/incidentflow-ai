package com.incidentflow.incidentflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.incidentflow.incidentflow.entity.Incident;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
}