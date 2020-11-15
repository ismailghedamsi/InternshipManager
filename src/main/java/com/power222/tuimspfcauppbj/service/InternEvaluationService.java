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
    private final MailSendingService mailSvc;

    public InternEvaluationService(InternEvaluationRepository interEvaliationRepo, final MailSendingService mailSvc) {
        this.InterEvaluationRepo = interEvaliationRepo;
        this.mailSvc = mailSvc;
    }

    public InternEvaluation createAndSaveNewInternEvaluation(InternEvaluation internEvaluation) {
        var save = InterEvaluationRepo.saveAndFlush(internEvaluation);
//        mailSvc.notifyAboutCreation(save);
        return save;
    }

    public List<InternEvaluation> getAllInternEvaluation() {
        return InterEvaluationRepo.findAll();
    }


    public Optional<InternEvaluation> getInternEvaluationById(long id) {
        return InterEvaluationRepo.findById(id);
    }

    public Optional<InternEvaluation> updateInternEvaluation(long id, InternEvaluation internEvaluation) {
        return InterEvaluationRepo.findById(id)
                .map(oldInternEvaluation -> {
                    internEvaluation.setId(oldInternEvaluation.getId());
                    internEvaluation.setSemester(oldInternEvaluation.getSemester());
                    return Optional.of(InterEvaluationRepo.saveAndFlush(internEvaluation));
                })
                .orElse(Optional.empty());
    }

    @Transactional
    public void deleteInternEvaluationById(long id) {
        InterEvaluationRepo.deleteById(id);
    }
}
