package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ContractRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
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

    public List<Contract> getAllContract() {
        return contractRepo.findAll();
    }

    public Optional<Contract> getContractById(long id) {
        return contractRepo.findById(id);
    }

    public Contract updateContract(long id, Contract contract) {
        return contractRepo.findById(id)
                .map(oldContract -> {
                    contract.setId(oldContract.getId());
                    contract.setSemester(oldContract.getSemester());
                    return contractRepo.saveAndFlush(contract);
                })
                .orElse(contract);
    }


    @Transactional
    public void deleteContractById(long id) {
        contractRepo.deleteById(id);
    }
}
