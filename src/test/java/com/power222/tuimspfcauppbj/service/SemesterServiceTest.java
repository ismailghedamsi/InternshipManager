package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.LinkedList;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SemesterServiceTest {

    @Mock
    StudentRepository studentRepo;

    @Mock
    EmployerRepository employerRepo;

    @Mock
    AuthenticationService authSvc;

    @InjectMocks
    SemesterService semesterSvc;

    @Test
    void unaffectedUserTest() {
        var u = new User();
        semesterSvc.checkIfUserIsInSemester(u);

        verify(studentRepo, times(0)).saveAndFlush(any());
        verify(employerRepo, times(0)).saveAndFlush(any());
    }

    @Test
    void studentUpdateTest() {
        User u = Student.builder()
                .semesters(new LinkedList<>(Collections.singletonList("a2019h2020")))
                .build();

        semesterSvc.checkIfUserIsInSemester(u);

        verify(studentRepo, times(1)).saveAndFlush(any());
        verify(employerRepo, times(0)).saveAndFlush(any());
    }

    @Test
    void studentNoUpdateTest() {
        User u = Student.builder()
                .semesters(new LinkedList<>(Collections.singletonList(SemesterContext.getPresentSemester())))
                .build();

        semesterSvc.checkIfUserIsInSemester(u);

        verify(studentRepo, times(0)).saveAndFlush(any());
        verify(employerRepo, times(0)).saveAndFlush(any());
    }

    @Test
    void employerUpdateTest() {
        User u = Employer.builder()
                .semesters(new LinkedList<>(Collections.singletonList("a2019h2020")))
                .build();

        semesterSvc.checkIfUserIsInSemester(u);

        verify(studentRepo, times(0)).saveAndFlush(any());
        verify(employerRepo, times(1)).saveAndFlush(any());
    }

    @Test
    void employerNoUpdateTest() {
        User u = Employer.builder()
                .semesters(new LinkedList<>(Collections.singletonList(SemesterContext.getPresentSemester())))
                .build();

        semesterSvc.checkIfUserIsInSemester(u);

        verify(studentRepo, times(0)).saveAndFlush(any());
        verify(employerRepo, times(0)).saveAndFlush(any());
    }
}
