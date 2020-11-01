package com.power222.tuimspfcauppbj.util;

import com.power222.tuimspfcauppbj.model.Contract;

import java.util.Arrays;

public enum ContractSignatureState {
    PENDING_FOR_ADMIN_REVIEW,
    WAITING_FOR_EMPLOYER_SIGNATURE,
    REJECTED_BY_EMPLOYER,
    WAITING_FOR_STUDENT_SIGNATURE;

    public void advanceState(Contract contract, boolean isApproved) {
        switch (contract.getSignatureState()) {
            case PENDING_FOR_ADMIN_REVIEW:
                contract.setSignatureState(WAITING_FOR_EMPLOYER_SIGNATURE);
                break;
            case WAITING_FOR_EMPLOYER_SIGNATURE:
                if (isApproved)
                    contract.setSignatureState(WAITING_FOR_STUDENT_SIGNATURE);
                else
                    contract.setSignatureState(REJECTED_BY_EMPLOYER);

        }
    }
}
