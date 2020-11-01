package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import com.power222.tuimspfcauppbj.util.ContractDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contractGeneration")
public class ContractGenerationController {

    private final ContractGenerationService service;

    public ContractGenerationController(ContractGenerationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> generateContract(@RequestBody ContractDto contract) {
        return ResponseEntity.status(service.generateContract(contract) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST).build();
    }
}
