package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ContractRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ContractService {

    private final ContractRepository contractRepo;
    private final AuthenticationService authSvc;

    public ContractService(ContractRepository contractRepo, AuthenticationService authSvc) {
        this.contractRepo = contractRepo;
        this.authSvc = authSvc;
    }

    public Optional<Contract> createAndSaveNewContract(Contract contract) {
        return Optional.of(contractRepo.saveAndFlush(contract));
    }
}
