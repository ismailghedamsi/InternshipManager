package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
}
