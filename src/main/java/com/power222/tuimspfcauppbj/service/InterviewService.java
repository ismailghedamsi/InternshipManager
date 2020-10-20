package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InterviewRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Interview;
import com.power222.tuimspfcauppbj.model.ReviewState;
import com.power222.tuimspfcauppbj.model.User;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.DoubleStream;

@Service
public class InterviewService {
    private final InterviewRepository interviewRepo;
    private final AuthenticationService authSvc;

    public InterviewService(InterviewRepository interviewRepo, AuthenticationService authSvc) {
        this.interviewRepo = interviewRepo;
        this.authSvc = authSvc;
    }

    public List<Interview> getAllInterviews() {
        return interviewRepo.findAll();
    }

    public List<Interview> getAllInterviewByEmployerId(long id) {
        return interviewRepo.findAllByEmployer_id(id);
    }

    public Optional<Interview> getInterviewById(long id) {
        return interviewRepo.findById(id);
    }

    public Optional<Interview> persistNewInterview(Interview interview) {
        User currentUser = authSvc.getCurrentUser();
        if (currentUser instanceof Employer) {
            return Optional.of(interviewRepo.saveAndFlush(interview));
        } else
            return Optional.empty();
    }

    public Optional<Interview> updateInterview(long id, Interview interview) {
        return interviewRepo.findById(id)
                .map(oldInterview -> interview.toBuilder().id(oldInterview.getId()).build())
                .map(newInterview -> interviewRepo.saveAndFlush(interview));
    }

    public Optional<Interview> updateInterviewState(long id, ReviewState newState) {
        return interviewRepo.findById(id)
                .map(interview -> interview.toBuilder().reviewState(newState).build())
                .map(interviewRepo::saveAndFlush);
    }

    @Transactional
    public void deleteInterviewById(long id) {
        interviewRepo.deleteById(id);
    }
}
