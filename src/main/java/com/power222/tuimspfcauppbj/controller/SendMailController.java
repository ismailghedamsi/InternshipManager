package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.ContractService;
import com.power222.tuimspfcauppbj.service.MailSendingService;
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
public class SendMailController {
    private final MailSendingService mailService;

    public SendMailController(MailSendingService mailService, ContractService contractService) {
        this.mailService = mailService;
    }

    @PostMapping("/contract")
    public ResponseEntity SendContractByMail(@RequestBody MailContractDto contract) {
        Optional<StudentApplication> optionalStudentApplication = mailService.getStudentApplication(contract);
        if (optionalStudentApplication.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        System.out.println(contract.getFile());
        mailService.sendEmail(optionalStudentApplication.get().getOffer().getEmployer(), "contract" + contract + ".pdf", contract.getFile());
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
