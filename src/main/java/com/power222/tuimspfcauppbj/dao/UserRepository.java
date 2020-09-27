package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Resume;
import com.power222.tuimspfcauppbj.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<Resume> findResumeByCreationDate(String timestamp);
}
