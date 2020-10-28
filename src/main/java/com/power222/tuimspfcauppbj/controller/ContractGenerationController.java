package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;
import java.io.IOException;

@RestController
@RequestMapping("/api/contractGeneration")
public class ContractGenerationController {
    private final ContractGenerationService service;

    public ContractGenerationController(ContractGenerationService service) {
        this.service = service;
    }

    @PostMapping
    public void generateContract(@RequestBody Contract contract) {
        try {
            service.generateContract(contract);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
