package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.BusinessEvaluationRepository;
import com.power222.tuimspfcauppbj.model.BusinessEvaluation;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BusinessEvaluationService {

    private final BusinessEvaluationRepository businessEvaluationRepo;

    public BusinessEvaluationService(BusinessEvaluationRepository businessEvaluationRepository) {
        this.businessEvaluationRepo = businessEvaluationRepository;
    }

    public BusinessEvaluation createAndSaveNewBusinessEvaluation(BusinessEvaluation businessEvaluation) {
        businessEvaluation.getSignature().setDate(LocalDate.now());
        businessEvaluation.getInternInfos().setInternDate(
                businessEvaluation.getContract().getStudentApplication()
                        .getOffer().getDetails().getInternshipStartDate());
        return businessEvaluationRepo.saveAndFlush(businessEvaluation);
    }

    public List<BusinessEvaluation> getAllBusinessEvaluation() {
        return businessEvaluationRepo.findAll();
    }


    public Optional<BusinessEvaluation> getBusinessEvaluationById(long id) {
        return businessEvaluationRepo.findById(id);
    }

    public Optional<BusinessEvaluation> updateBusinessEvaluation(long id, BusinessEvaluation businessEvaluation) {
        return businessEvaluationRepo.findById(id)
                .map(oldBusinessEvaluation -> {
                    businessEvaluation.setId(oldBusinessEvaluation.getId());
                    businessEvaluation.getSignature().setDate(oldBusinessEvaluation.getSignature().getDate());
                    businessEvaluation.setSemester(businessEvaluation.getSemester());
                    return Optional.of(businessEvaluationRepo.saveAndFlush(businessEvaluation));
                })
                .orElse(Optional.empty());
    }

    @Transactional
    public void deleteBusinessEvaluationById(long id) {
        businessEvaluationRepo.deleteById(id);
    }
}
