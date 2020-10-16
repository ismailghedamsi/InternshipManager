package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
}
