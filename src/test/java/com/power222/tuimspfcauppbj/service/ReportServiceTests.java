package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ContractRepository;
import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SuppressWarnings({"rawtypes", "unchecked"})
@ExtendWith(MockitoExtension.class)
public class ReportServiceTests {

    public static final int PAGE = 0;
    public static final int PAGE_SIZE = 10;

    @Mock
    private Page page;

    @Mock
    private StudentRepository studentRepo;

    @Mock
    private InternshipOfferRepository offerRepo;

    @Mock
    private ContractRepository contractRepo;

    @InjectMocks
    private ReportService svc;

    private final PageRequest pageRequest = PageRequest.of(PAGE, PAGE_SIZE);

    @Test
    void registeredStudentsTest() {
        when(studentRepo.findAll(pageRequest)).thenReturn(page);

        var actual = svc.registeredStudents(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void studentsWithoutResumeTest() {
        when(studentRepo.findAllByResumesIsEmpty(pageRequest)).thenReturn(page);

        var actual = svc.studentsWithoutResume(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void studentsPendingResumesTest() {
        when(studentRepo.findAllByResumesReviewStatePending(pageRequest)).thenReturn(page);

        var actual = svc.studentsPendingResumes(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void studentsNotHiredTest() {
        when(studentRepo.findAllByApplications_ContractIsNull(pageRequest)).thenReturn(page);

        var actual = svc.studentsNotHired(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void studentsScheduledInterviewTest() {
        when(studentRepo.findAllByApplications_InterviewIsNotNull(pageRequest)).thenReturn(page);

        var actual = svc.studentsScheduledInterview(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void allOffersTest() {
        when(offerRepo.findAll(pageRequest)).thenReturn(page);

        var actual = svc.allOffers(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void offersPendingApprobationTest() {
        when(offerRepo.findAllByReviewStatePending(pageRequest)).thenReturn(page);

        var actual = svc.offersPendingApprobation(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void offersWithoutHiredTest() {
        var hired = StudentApplication.builder()
                .state(StudentApplicationState.JOB_OFFER_ACCEPTED_BY_STUDENT)
                .build();
        var pendingStudent = StudentApplication.builder()
                .state(StudentApplicationState.WAITING_FOR_STUDENT_HIRING_FINAL_DECISION)
                .build();
        var rejected = StudentApplication.builder()
                .state(StudentApplicationState.APPLICATION_REJECTED_BY_EMPLOYER)
                .build();

        List<InternshipOffer> offers = new ArrayList<>(3);
        offers.add(InternshipOffer.builder()
                .applications(Arrays.asList(hired, rejected))
                .build());
        offers.add(InternshipOffer.builder()
                .applications(Arrays.asList(rejected, pendingStudent))
                .build());
        offers.add(InternshipOffer.builder()
                .applications(Collections.singletonList(pendingStudent))
                .build());

        when(offerRepo.findAll(pageRequest)).thenReturn(page);
        when(page.iterator()).thenReturn(offers.iterator());
        when(page.get()).thenReturn(offers.stream());

        var actual = svc.offersWithoutHired(PAGE, PAGE_SIZE);

        assertThat(actual.get()).hasSize(2);
    }

    @Test
    void offersWithoutHiredEmptyListTest() {
        List<InternshipOffer> offers = new ArrayList<>(1);

        when(offerRepo.findAll(pageRequest)).thenReturn(page);
        when(page.iterator()).thenReturn(offers.iterator());
        when(page.get()).thenReturn(offers.stream());

        var actual = svc.offersWithoutHired(PAGE, PAGE_SIZE);

        assertThat(actual.get()).hasSize(0);
    }

    @Test
    void offersWithoutHiredNullItrTest() {
        List<InternshipOffer> offers = new ArrayList<>(1);

        when(offerRepo.findAll(pageRequest)).thenReturn(page);
        when(page.iterator()).thenReturn(offers.iterator());
        when(page.get()).thenReturn(offers.stream());

        var actual = svc.offersWithoutHired(PAGE, PAGE_SIZE);

        assertThat(actual.get()).hasSize(0);
    }

    @Test
    void contractsWaitingStudentTest() {
        when(contractRepo.findAllBySignatureState(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE, pageRequest)).thenReturn(page);

        var actual = svc.contractsWaitingStudent(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void contractsWaitingEmployerTest() {
        when(contractRepo.findAllBySignatureState(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE, pageRequest)).thenReturn(page);

        var actual = svc.contractsWaitingEmployer(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void contractsWaitingAdminTest() {
        when(contractRepo.findAllBySignatureState(ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE, pageRequest)).thenReturn(page);

        var actual = svc.contractsWaitingAdmin(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }
}
