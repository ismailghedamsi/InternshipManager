package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.service.ContractService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contract")
public class ContractController {

    private final ContractService svc;

    public ContractController(ContractService svc) {
        this.svc = svc;
    }

    @PostMapping
    public ResponseEntity<Contract> createEmployer(@RequestBody Contract contract) {
        return svc.createAndSaveNewContract(contract)
                .map(employer -> ResponseEntity.status(HttpStatus.CREATED).body(contract))
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());
    }
}
