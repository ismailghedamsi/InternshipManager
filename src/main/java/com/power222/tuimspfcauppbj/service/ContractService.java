package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ContractRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ContractService {

    private final ContractRepository contractRepo;

    public ContractService(ContractRepository contractRepo) {
        this.contractRepo = contractRepo;
    }

    public Contract createAndSaveNewContract(Contract contract) {
        return contractRepo.saveAndFlush(contract);
    }

    public List<Contract> getAllContract() {
        return contractRepo.findAll();
    }

    public Optional<Contract> getContractById(long id) {
        return contractRepo.findById(id);
    }

    public Optional<Contract> updateContract(long id, Contract contract) {
        return contractRepo.findById(id)
                .map(oldContract -> {
                    contract.setId(oldContract.getId());
                    return Optional.of(contractRepo.saveAndFlush(contract));
                })
                .orElse(Optional.empty());
    }

    public Optional<Contract> updateContractSignatureState(long id, boolean isApproved) {
        return contractRepo.findById(id)
                .map(contract -> {
                    contract.setSignatureState(ContractSignatureState.getNextState(contract.getSignatureState(), isApproved));
                    return contractRepo.saveAndFlush(contract);
                });
    }

    @Transactional
    public void deleteContractById(long id) {
        contractRepo.deleteById(id);
    }
}
