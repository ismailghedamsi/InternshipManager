package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.model.Resume;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.User;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ResumeService {
    private final ResumeRepository resumeRepo;
    private final AuthenticationService authSvc;

    public ResumeService(ResumeRepository resumeRepo, AuthenticationService authSvc) {
        this.resumeRepo = resumeRepo;
        this.authSvc = authSvc;
    }

    public List<Resume> getAllResumes() {
        return resumeRepo.findAll();
    }

    public List<Resume> getResumeWithPendingApproval() {
        return resumeRepo.findAllByReviewStatePending();
    }

    public Optional<Resume> getResumeById(long id) {
        return resumeRepo.findById(id);
    }

    public List<Resume> getResumesByOwnerId(long id) {
        return resumeRepo.findAllByOwner_Id(id);
    }

    public Optional<Resume> persistNewResume(Resume resume) {
        User currentUser = authSvc.getCurrentUser();
        if (currentUser instanceof Student) {
            resume.setOwner((Student) currentUser);
            return Optional.of(resumeRepo.saveAndFlush(resume));
        } else
            return Optional.empty();
    }

    public Optional<Resume> updateResume(long id, Resume resume) {
        return resumeRepo.findById(id)
                .map(oldResume -> resume.toBuilder().id(oldResume.getId()).build())
                .map(newResume -> resumeRepo.saveAndFlush(resume));
    }

    @Transactional
    public void deleteResumeById(long id) {
        resumeRepo.deleteById(id);
    }
}
