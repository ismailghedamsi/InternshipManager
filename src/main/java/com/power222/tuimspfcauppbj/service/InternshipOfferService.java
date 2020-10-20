package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.ReviewState;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class InternshipOfferService {

    private final InternshipOfferRepository internshipOfferRepository;
    private final AuthenticationService authenticationService;
    private final StudentRepository studentRepo;

    public InternshipOfferService(InternshipOfferRepository internshipOfferRepository, AuthenticationService authenticationService, StudentRepository studentRepo) {
        this.internshipOfferRepository = internshipOfferRepository;
        this.authenticationService = authenticationService;
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
        return Optional.of(internshipOfferRepository.saveAndFlush(offer));
    }

    private Employer offerUploader() {
        Employer employer = null;
        if (authenticationService.getCurrentUser() instanceof Employer) {
            employer = (Employer) authenticationService.getCurrentUser();
        }
        return employer;
    }

    public List<InternshipOffer> getAllInternshipOffers() {
        return internshipOfferRepository.findAll();
    }

    public List<InternshipOffer> getOfferByAllowedStudentId(long studentId) {
        return internshipOfferRepository.findAllByAllowedStudentsId(studentId);
    }

    public List<InternshipOffer> getInternshipOffersWithPendingApproval() {
        return internshipOfferRepository.findAllByReviewStatePending();
    }

    public List<InternshipOffer> getApprovedInternshipOffers() {
        return internshipOfferRepository.findAllByReviewStateApproved();
    }

    public Optional<InternshipOffer> getInternshipOfferById(long id) {
        return internshipOfferRepository.findById(id);
    }

    public List<InternshipOffer> getInternshipOffersOfEmployer(String username) {
        return internshipOfferRepository.findByEmployerUsername(username);
    }

    public Optional<InternshipOffer> updateInternshipOffer(long id, InternshipOffer offer) {
        return internshipOfferRepository.findById(id)
                .map(oldOffer -> offer.toBuilder().id(oldOffer.getId()).build())
                .filter(this::isOfferStateValid)
                .map(internshipOfferRepository::saveAndFlush);
    }

    public Optional<InternshipOffer> addOrRemoveStudentFromOffer(long offerId, long studentId) {
        return internshipOfferRepository.findById(offerId)
                .flatMap(offer -> studentRepo.findById(studentId)
                        .map(student -> {
                            if (offer.getAllowedStudents().contains(student))
                                offer.getAllowedStudents().remove(student);
                            else
                                offer.getAllowedStudents().add(student);

                            return internshipOfferRepository.saveAndFlush(offer);
                        }));
    }

    public void deleteOfferById(long id) {
        internshipOfferRepository.deleteById(id);
    }

    @SuppressWarnings("SimplifiableConditionalExpression")
    private boolean isOfferStateValid(InternshipOffer offer) {
        if (offer.getReviewState() == ReviewState.DENIED)
            return offer.getReasonForRejection() == null ? false : !offer.getReasonForRejection().isBlank();

        return true;
    }
}
