package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Interview;
import com.power222.tuimspfcauppbj.service.InterviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interviews")
public class InterviewController {
    private final InterviewService svc;

    public InterviewController(InterviewService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<Interview> getAllInterviews() {
        return svc.getAllInterviews();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getResume(@PathVariable long id) {
        return svc.getInterviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Interview> createResume(@RequestBody Interview newInterview) {
        return svc.persistNewInterview(newInterview)
                .map(resume -> ResponseEntity.status(HttpStatus.CREATED).body(resume))
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Interview> updateResume(@RequestBody Interview requestBody, @PathVariable long id) {
        return svc.updateInterview(id, requestBody)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());
    }
}
