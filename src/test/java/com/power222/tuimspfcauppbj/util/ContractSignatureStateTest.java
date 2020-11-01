package com.power222.tuimspfcauppbj.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ContractSignatureStateTest {

    @Test
    void getNextStatefromPENDING_FOR_ADMIN_REVIEW() {
        assertThat(
                ContractSignatureState.getNextState(
                        ContractSignatureState.PENDING_FOR_ADMIN_REVIEW,
                        true
                )
        ).isEqualTo(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE);

        assertThat(
                ContractSignatureState.getNextState(
                        ContractSignatureState.PENDING_FOR_ADMIN_REVIEW,
                        false
                )
        ).isEqualTo(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE);
    }

    @Test
    void getNextStatefromWAITING_FOR_EMPLOYER_SIGNATURE_approved() {
        assertThat(
                ContractSignatureState.getNextState(
                        ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE,
                        true
                )
        ).isEqualTo(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE);
    }

    @Test
    void getNextStatefromWAITING_FOR_EMPLOYER_SIGNATURE_rejected() {
        assertThat(
                ContractSignatureState.getNextState(
                        ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE,
                        false
                )
        ).isEqualTo(ContractSignatureState.REJECTED_BY_EMPLOYER);
    }

    @Test
    void getNextStatefromWAITING_FOR_STUDENT_SIGNATURE() {
        assertThat(
                ContractSignatureState.getNextState(
                        ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE,
                        true
                )
        ).isEqualTo(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE);

        assertThat(
                ContractSignatureState.getNextState(
                        ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE,
                        false
                )
        ).isEqualTo(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE);
    }
}
