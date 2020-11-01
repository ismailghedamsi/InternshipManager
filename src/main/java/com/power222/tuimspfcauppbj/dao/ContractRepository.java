package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
}
