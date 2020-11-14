package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Page<Student> findAllByResumesIsEmpty(Pageable pageable);

    Page<Student> findAllByResumes_ReviewState(ReviewState reviewState, Pageable pageable);

    Page<Student> findAllByApplications_ContractIsNull(Pageable pageable);

    Page<Student> findAllByApplications_InterviewIsNotNull(Pageable pageable);

    default Page<Student> findAllByResumesReviewStatePending(Pageable pageable) {
        return findAllByResumes_ReviewState(ReviewState.PENDING, pageable);
    }
}
