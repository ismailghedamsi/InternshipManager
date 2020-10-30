package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SemesterService {

    private final StudentRepository studentRepo;
    private final EmployerRepository employerRepo;

    public SemesterService(StudentRepository studentRepo, AuthenticationService authSvc, EmployerRepository employerRepo) {
        this.studentRepo = studentRepo;
        this.employerRepo = employerRepo;
        authSvc.registerEventListeners(this::checkIfUserIsInSemester);
    }

    private void checkIfUserIsInSemester(User user) {
        log.info("User is connecting: " + user);
        if (user instanceof Student) {
            Student student = (Student) user;
            if (!student.getSemesters().contains(SemesterContext.getPresentSemester())) {
                student.getSemesters().add(SemesterContext.getPresentSemester());
                studentRepo.saveAndFlush(student);
            }
        } else if (user instanceof Employer) {
            Employer employer = (Employer) user;
            if (!employer.getSemesters().contains(SemesterContext.getPresentSemester())) {
                employer.getSemesters().add(SemesterContext.getPresentSemester());
                employerRepo.saveAndFlush(employer);
            }
        }
    }
}
