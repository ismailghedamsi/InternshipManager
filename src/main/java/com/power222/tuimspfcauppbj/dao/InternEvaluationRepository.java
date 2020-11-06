package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.InternEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InternEvaluationRepository extends JpaRepository<InternEvaluation, Long> {
}
