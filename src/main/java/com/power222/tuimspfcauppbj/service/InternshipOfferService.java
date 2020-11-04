package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class InternshipOfferService {

    private final InternshipOfferRepository offerRepo;
    private final AuthenticationService authSvc;
    private final StudentRepository studentRepo;

    public InternshipOfferService(InternshipOfferRepository offerRepo, AuthenticationService authSvc, StudentRepository studentRepo) {
        this.offerRepo = offerRepo;
        this.authSvc = authSvc;
        this.studentRepo = studentRepo;
    }

    public Optional<InternshipOffer> uploadInternshipOffer(InternshipOffer offer) {
        Employer employer = offerUploader();
        if (employer == null) {
            return Optional.empty();
        }
        employer.getOffers().add(offer);
        offer.setEmployer(employer);
        offer.setReviewState(ReviewState.PENDING);
        offer.setAllowedStudents(Collections.emptyList());
        return Optional.of(offerRepo.saveAndFlush(offer));
    }

    private Employer offerUploader() {
        Employer employer = null;
        if (authSvc.getCurrentUser() instanceof Employer) {
            employer = (Employer) authSvc.getCurrentUser();
        }
        return employer;
    }

    public List<InternshipOffer> getAllInternshipOffers() {
        return offerRepo.findAll();
    }

    public List<InternshipOffer> getOfferByAllowedStudentId(long studentId) {
        return offerRepo.findAllByAllowedStudentsId(studentId);
    }

    public List<InternshipOffer> getInternshipOffersWithPendingApproval() {
        return offerRepo.findAllByReviewStatePending();
    }

    public List<InternshipOffer> getApprovedInternshipOffers() {
        return offerRepo.findAllByReviewStateApproved();
    }

    public Optional<InternshipOffer> getInternshipOfferById(long id) {
        return offerRepo.findById(id);
    }

    public List<InternshipOffer> getInternshipOffersOfEmployer(String username) {
        return offerRepo.findByEmployerUsername(username);
    }

    public Optional<InternshipOffer> updateInternshipOffer(long id, InternshipOffer offer) {
        return offerRepo.findById(id)
                .map(oldOffer -> offer.toBuilder()
                        .id(oldOffer.getId())
                        .semester(oldOffer.getSemester())
                        .build())
                .filter(this::isOfferStateValid)
                .map(offerRepo::saveAndFlush);
    }

    public Optional<InternshipOffer> switchOfferVisibilityForStudent(long offerId, long studentId) {
        return offerRepo.findById(offerId)
                .flatMap(offer -> studentRepo.findById(studentId)
                        .map(student -> getStudentInternshipOfferFunction(student, offer)));
    }

    private InternshipOffer getStudentInternshipOfferFunction(Student student, InternshipOffer offer) {
        if (offer.getAllowedStudents().contains(student))
            offer.getAllowedStudents().remove(student);
        else
            offer.getAllowedStudents().add(student);

        return offerRepo.saveAndFlush(offer);
    }

    public void deleteOfferById(long id) {
        offerRepo.deleteById(id);
    }

    @SuppressWarnings("SimplifiableConditionalExpression")
    private boolean isOfferStateValid(InternshipOffer offer) {
        if (offer.getReviewState() == ReviewState.DENIED)
            return (offer.getReasonForRejection() == null) ? false : !offer.getReasonForRejection().isBlank();

        return true;
    }
}
