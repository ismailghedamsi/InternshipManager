package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findAllByStudentApplication_Offer_Employer_Id(long id);
}
