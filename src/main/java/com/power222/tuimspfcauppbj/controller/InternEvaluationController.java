package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.InternEvaluation;
import com.power222.tuimspfcauppbj.service.InternEvaluationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/internEvaluation")
public class InternEvaluationController {

    private final InternEvaluationService svc;

    public InternEvaluationController(InternEvaluationService svc) {
        this.svc = svc;
    }

    @PostMapping
    public InternEvaluation createInternEvaluation(@RequestBody InternEvaluation newInternEvaluation) {
        return svc.createAndSaveNewInternEvaluation(newInternEvaluation);
    }
}
