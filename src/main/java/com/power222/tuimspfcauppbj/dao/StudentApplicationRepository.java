package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.StudentApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentApplicationRepository extends JpaRepository<StudentApplication, Long> {
}
