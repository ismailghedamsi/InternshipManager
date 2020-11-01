package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.util.ContractSignatureDTO;
import org.springframework.stereotype.Service;

@Service
public class ContractSignatureService {
    public Contract signContract(Contract contract, ContractSignatureDTO contractSignatureDTO) {
        return contract;
    }
}
