package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

}
