package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InternshipOfferService {

    private InternshipOfferRepository internshipOfferRepository;
    private EmployerRepository employerRepository;
    private AuthenticationService authenticationService;
    private final StudentRepository studentRepo;

    public InternshipOfferService(InternshipOfferRepository internshipOfferRepository, EmployerRepository employerRepository, AuthenticationService authenticationService, StudentRepository studentRepo) {
        this.internshipOfferRepository = internshipOfferRepository;
        this.employerRepository = employerRepository;
        this.authenticationService = authenticationService;
        this.studentRepo = studentRepo;
    }

    public Optional<InternshipOffer> uploadInternshipOffer(InternshipOffer offer){
        Employer employer = OfferUploader();
        if(employer == null)
            return  Optional.empty();
        employer.getOffers().add(offer);
        offer.setEmployer(employer);
        offer.setReviewState(InternshipOffer.ReviewState.PENDING);
        return Optional.of(internshipOfferRepository.saveAndFlush(offer));
    }

    private Employer OfferUploader() {
        Employer employer = null;
        if(authenticationService.getCurrentUser() instanceof Employer){
            employer =(Employer) authenticationService.getCurrentUser();
        }
        return employer;
    }

    public List<InternshipOffer> getAllInternshipOffers() {
        return internshipOfferRepository.findAll();
    }

    public List<InternshipOffer> getInternshipOffersWithPendingApproval() {
        return internshipOfferRepository.findAllByReviewStatePending();
    }

    public Optional<InternshipOffer> getInternshipOfferById(long id) {
        return internshipOfferRepository.findById(id);
    }

    public List<InternshipOffer> getInternshipOffersOfEmployer(String username){
        return internshipOfferRepository.findByEmployerUsername(username);
    }

    public Optional<InternshipOffer> updateInternshipOffer(long id, InternshipOffer offer) {
        return internshipOfferRepository.findById(id)
                .map(oldOffer -> offer.toBuilder().id(oldOffer.getId()).build())
                .filter(this::isOfferStateValid)
                .map(newOffer -> internshipOfferRepository.saveAndFlush(newOffer));
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

    private boolean isOfferStateValid(InternshipOffer offer) {
        if (offer.getReviewState() == InternshipOffer.ReviewState.DENIED) {
            if (offer.getReasonForRejection() == null)
                return false;
            return !offer.getReasonForRejection().isBlank();
        }

        return true;
    }
}
