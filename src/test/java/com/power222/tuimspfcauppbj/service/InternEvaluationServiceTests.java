package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternEvaluationRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternEvaluation;
import com.power222.tuimspfcauppbj.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class InternEvaluationServiceTests {

    @Mock
    private InternEvaluationRepository internRepo;

    @Mock
    private AuthenticationService authSvc;

    @InjectMocks
    private InternEvaluationService internSvc;

    private User expectedUser;
    private Contract expectedContract;
    private InternEvaluation expectedInternEvaluation;

    @BeforeEach
    void setUp() {
        expectedUser = User.builder()
                .id(1L)
                .role("admin")
                .build();

        expectedContract = Contract.builder()
                .id(1L)
                .build();

        expectedInternEvaluation = InternEvaluation.builder()
                .id(1L)
                .contract(expectedContract)
                .phoneNumber("121314")
                .build();
    }

    @Test
    void createAndSaveInternEvaluationTest() {
        when(internRepo.saveAndFlush(expectedInternEvaluation)).thenReturn(expectedInternEvaluation);

        var actual = internSvc.createAndSaveNewInternEvaluation(expectedInternEvaluation);

        assertThat(actual).isNotNull();
        assertThat(actual).isEqualTo(expectedInternEvaluation);
    }


    @Test
    void createAndSaveNoInternEvaluationTest() {
        when(internRepo.saveAndFlush(expectedInternEvaluation)).thenReturn(new InternEvaluation());

        var actual = internSvc.createAndSaveNewInternEvaluation(expectedInternEvaluation);

        assertThat(actual).isNotNull();
        assertThat(actual).isNotEqualTo(expectedInternEvaluation);
    }
}
