package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ContractRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.util.ContractSignatureDTO;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ContractService {
    private final ContractRepository contractRepo;
    private final ContractGenerationService contractGenSvc;

    public ContractService(ContractRepository contractRepo, ContractGenerationService contractGenSvc) {
        this.contractRepo = contractRepo;
        this.contractGenSvc = contractGenSvc;
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

    public Optional<Contract> updateContractSignature(long id, ContractSignatureDTO contractSignatureDTO) {
        return contractRepo.findById(id)
                .map(contract -> {
                    if (contract.getSignatureState() != ContractSignatureState.PENDING_FOR_ADMIN_REVIEW) {
                        if (contractSignatureDTO.isApproved())
                            contractGenSvc.signContract(contractSignatureDTO);
                        else
                            contract.setReasonForRejection(contractSignatureDTO.getReasonForRejection());
                    }
                    contract.setSignatureState(ContractSignatureState.getNextState(contract.getSignatureState(), contractSignatureDTO.isApproved()));

                    return contractRepo.saveAndFlush(contract);
                });
    }

    @Transactional
    public void deleteContractById(long id) {
        contractRepo.deleteById(id);
    }
}
