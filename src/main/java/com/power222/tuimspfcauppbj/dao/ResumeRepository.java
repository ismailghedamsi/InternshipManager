package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByReviewedFalse();
    List<Resume> findAllByOwner_Id(long owner_id);
}
