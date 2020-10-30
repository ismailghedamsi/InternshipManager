package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.ContractDto;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contractGeneration")
public class ContractGenerationController {
    private ContractGenerationService service;

    public ContractGenerationController(ContractGenerationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ContractDto> generateContract(@RequestBody ContractDto contract) {
        if (contract == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if (!service.generateContract(contract)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(contract);
    }
}
