package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Interview;
import com.power222.tuimspfcauppbj.model.ReviewState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findAllByEmployer_id(long id);
    List<Interview> findAllByStudentApplication_Student_Id(long id);
}
