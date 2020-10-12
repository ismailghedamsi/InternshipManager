package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudentApplicationController {

    private final StudentApplicationService svc;

    public StudentApplicationController(StudentApplicationService svc) {
        this.svc = svc;
    }

    @PostMapping("/application/{offerId}/{resumeId}")
    public ResponseEntity<StudentApplication> createStudentApplication(
            @PathVariable long offerId, @PathVariable long resumeId) {
        return svc.createAndSaveNewApplication(offerId, resumeId)
                .map(resume -> ResponseEntity.status(HttpStatus.CREATED).body(resume))
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @PutMapping("/application/isHired/{id}")
    public ResponseEntity<StudentApplication> updateIsHiredStudentApplication(@PathVariable long id) {
        return svc.updateStudentApplicationIsHired(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());

    }


}
