package com.incidentflow.incidentflow.ai.repository;

import com.incidentflow.incidentflow.ai.entity.AIAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Long> {

    Optional<AIAnalysis> findByIncidentId(Long incidentId);
}