package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ContractRepository;
import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private final StudentRepository studentRepo;
    private final InternshipOfferRepository offerRepo;
    private final ContractRepository contractRepo;

    public ReportService(StudentRepository studentRepo, InternshipOfferRepository offerRepo, ContractRepository contractRepo) {
        this.studentRepo = studentRepo;
        this.offerRepo = offerRepo;
        this.contractRepo = contractRepo;
    }

    public Page<Student> registeredStudents(int page, int itemPerPage) {
        return studentRepo.findAll(PageRequest.of(page, itemPerPage));
    }

    public Page<Student> studentsWithoutResume(int page, int itemPerPage) {
        return studentRepo.findAllByResumesIsEmpty(PageRequest.of(page, itemPerPage));
    }

    public Page<Student> studentsPendingResumes(int page, int itemPerPage) {
        return studentRepo.findAllByResumesReviewStatePending(PageRequest.of(page, itemPerPage));
    }

    public Page<Student> studentsNotHired(int page, int itemPerPage) {
        return studentRepo.findAllByApplications_ContractIsNull(PageRequest.of(page, itemPerPage));
    }

    public Page<Student> studentsScheduledInterview(int page, int itemPerPage) {
        return studentRepo.findAllByApplications_InterviewIsNotNull(PageRequest.of(page, itemPerPage));
    }

    public Page<InternshipOffer> allOffers(int page, int itemPerPage) {
        return offerRepo.findAll(PageRequest.of(page, itemPerPage));
    }

    public Page<InternshipOffer> offersPendingApprobation(int page, int itemPerPage) {
        return offerRepo.findAllByReviewStatePending(PageRequest.of(page, itemPerPage));
    }

    public Page<InternshipOffer> offersWithoutHired(int page, int itemPerPage) {
        final var offerPage = offerRepo.findAll(PageRequest.of(page, itemPerPage));
        var itr = offerPage.iterator();
        while (itr.hasNext()) {
            var o = itr.next();
            if (o.getApplications().stream().anyMatch(appli -> appli.getState().equals(StudentApplicationState.JOB_OFFER_ACCEPTED_BY_STUDENT))) {
                itr.remove();
                break;
            }
        }
        return offerPage;
    }

    public Page<Contract> contractsWaitingStudent(int page, int itemPerPage) {
        return contractRepo.findAllBySignatureState(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE, PageRequest.of(page, itemPerPage));
    }

    public Page<Contract> contractsWaitingEmployer(int page, int itemPerPage) {
        return contractRepo.findAllBySignatureState(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE, PageRequest.of(page, itemPerPage));
    }

    public Page<Contract> contractsWaitingAdmin(int page, int itemPerPage) {
        return contractRepo.findAllBySignatureState(ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE, PageRequest.of(page, itemPerPage));
    }
}
