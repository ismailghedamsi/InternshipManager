package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.ContractService;
import com.power222.tuimspfcauppbj.service.MailSendingService;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import com.power222.tuimspfcauppbj.util.MailContractDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/sendMail")
public class MailSendingController {
    private final MailSendingService mailService;
    private final StudentApplicationService applicationService;

    public MailSendingController(MailSendingService mailService, ContractService contractService, StudentApplicationService applicationService) {
        this.mailService = mailService;
        this.applicationService = applicationService;
    }

    @PostMapping("/contract")
    public ResponseEntity SendContractByMail(@RequestBody MailContractDto contract) {
        Optional<StudentApplication> optionalStudentApplication = applicationService.getApplicationById(contract.getStudentApplicationId());
        if (optionalStudentApplication.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        mailService.sendEmail(optionalStudentApplication.get().getOffer().getEmployer());
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
