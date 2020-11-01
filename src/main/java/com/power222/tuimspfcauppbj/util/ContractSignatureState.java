package com.power222.tuimspfcauppbj.util;

public enum ContractSignatureState {
    PENDING_FOR_ADMIN_REVIEW,
    WAITING_FOR_EMPLOYER_SIGNATURE,
    REJECTED_BY_EMPLOYER,
    WAITING_FOR_STUDENT_SIGNATURE;

    public static ContractSignatureState getNextState(ContractSignatureState signatureState, boolean isApproved) {
        switch (signatureState) {
            case PENDING_FOR_ADMIN_REVIEW:
                return WAITING_FOR_EMPLOYER_SIGNATURE;
            case WAITING_FOR_EMPLOYER_SIGNATURE:
                if (isApproved)
                    return WAITING_FOR_STUDENT_SIGNATURE;
                else
                    return REJECTED_BY_EMPLOYER;
            default:
                return signatureState;
        }
    }
}
