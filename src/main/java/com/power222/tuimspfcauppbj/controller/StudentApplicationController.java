package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class StudentApplicationController {

    private final StudentApplicationService svc;

    public StudentApplicationController(StudentApplicationService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<StudentApplication> getAllApplications() {
        return svc.getAllApplication();
    }

    @PostMapping("/{offerId}/{resumeId}")
    public ResponseEntity<StudentApplication> createStudentApplication(
            @PathVariable long offerId, @PathVariable long resumeId) {
        return svc.createAndSaveNewApplication(offerId, resumeId)
                .map(resume -> ResponseEntity.status(HttpStatus.CREATED).body(resume))
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @PutMapping("/hire/{id}")
    public ResponseEntity<StudentApplication> updateStudentApplicationIsHired(@PathVariable long id) {
        return svc.updateStudentApplicationIsHired(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());

    }

    @PutMapping("/{id}")
    public StudentApplication updateStudentApplication(@RequestBody StudentApplication studentApplication, @PathVariable long id) {
        return svc.updateStudentApplication(id, studentApplication);
    }

    @PutMapping("/decision/{id}")
    public ResponseEntity<StudentApplication> updateStudentApplicatioDecision(@RequestBody StudentApplication studentApplication, @PathVariable long id) {
        return svc.updateStudentApplicationStudentDecision(id, studentApplication).map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
