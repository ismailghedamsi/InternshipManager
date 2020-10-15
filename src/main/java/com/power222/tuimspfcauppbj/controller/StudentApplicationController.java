package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class StudentApplicationController {

    private final StudentApplicationService svc;

    public StudentApplicationController(StudentApplicationService svc) {
        this.svc = svc;
    }

    @PostMapping("/api/application/{offerId}/{resumeId}")
    public ResponseEntity<StudentApplication> createStudentApplication(
            @PathVariable long offerId, @PathVariable long resumeId) {
        return svc.createAndSaveNewApplication(offerId, resumeId)
                .map(resume -> ResponseEntity.status(HttpStatus.CREATED).body(resume))
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @PutMapping("/api/application/{id}")
    public StudentApplication updateStudentApplication(@RequestBody StudentApplication studentApplication, @PathVariable long id) {
        return svc.updateStudentApplication(id, studentApplication);
    }
}
