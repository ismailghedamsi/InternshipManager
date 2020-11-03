package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import com.power222.tuimspfcauppbj.util.ContractDTO;
import com.power222.tuimspfcauppbj.util.ContractSignatureDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contractGeneration")
public class ContractGenerationController {

    private final ContractGenerationService service;

    public ContractGenerationController(ContractGenerationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity generateContract(@RequestBody ContractDTO contract) {
        return service.generateContract(contract) ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PutMapping("/sign")
    public ResponseEntity<Contract> updateContractSignature(@RequestBody ContractSignatureDTO contractSignatureDTO) {
        return service.signContract(contractSignatureDTO).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
