package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternEvaluationRepository;
import com.power222.tuimspfcauppbj.model.InternEvaluation;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class InternEvaluationService {

    private final InternEvaluationRepository InterEvaluationRepo;
    private final NotificationService notifSvc;

    public InternEvaluationService(InternEvaluationRepository interEvaliationRepo, final NotificationService notifSvc) {
        this.InterEvaluationRepo = interEvaliationRepo;
        this.notifSvc = notifSvc;
    }

    public InternEvaluation createAndSaveNewInternEvaluation(InternEvaluation internEvaluation) {
        var save = InterEvaluationRepo.saveAndFlush(internEvaluation);
        System.err.println(save);
        notifSvc.notifyInternEvaluationCreation(save);
        return save;
    }

    public List<InternEvaluation> getAllInternEvaluation() {
        return InterEvaluationRepo.findAll();
    }


    public Optional<InternEvaluation> getInternEvaluationById(long id) {
        return InterEvaluationRepo.findById(id);
    }

    @Transactional
    public void deleteInternEvaluationById(long id) {
        InterEvaluationRepo.deleteById(id);
    }
}
