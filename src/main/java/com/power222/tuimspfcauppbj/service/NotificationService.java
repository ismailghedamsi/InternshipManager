package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternEvaluation;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final MailSendingService mailSvc;
    private final RsocketNotificationService notifSvc;

    public NotificationService(MailSendingService mailSvc, RsocketNotificationService notifSvc) {
        this.mailSvc = mailSvc;
        this.notifSvc = notifSvc;
    }

    public void notifyContractCreation(Contract contract) {
        final var msg = "Un nouveau contrat vous concernant vient d'être créer";

        mailSvc.notifyAboutCreation(contract);
        notifSvc.notify(contract.getStudentApplication().getStudent().getId(), msg);
        notifSvc.notify(contract.getStudentApplication().getOffer().getEmployer().getId(), msg);
    }

    public void notifyContractUpdate(Contract contract) {
        mailSvc.notifyConcernedUsers(contract);
        notifyConcernedUsers(contract);
    }

    public void notifyContractDeletion(Contract contract) {
        final var tmp = "Votre contrat pour l'offre %s vient d'être supprimer par un gestionnaire de stage";
        final var msg = String.format(tmp, contract.getStudentApplication().getOffer().getTitle());

        mailSvc.notifyAboutDeletion(contract);
        notifSvc.notify(contract.getStudentApplication().getStudent().getId(), msg);
        notifSvc.notify(contract.getStudentApplication().getOffer().getEmployer().getId(), msg);
    }

    public void notifyInternEvaluationCreation(InternEvaluation eval) {
        final var tmp = "Vous avez recu l'évaluation de %s %s pour son stage chez %s";
        final var msg = String.format(tmp, eval.getContract().getStudentApplication().getStudent().getFirstName(),
                eval.getContract().getStudentApplication().getStudent().getLastName(),
                eval.getContract().getStudentApplication().getOffer().getEmployer().getCompanyName());

        mailSvc.notifyAboutCreation(eval);
        notifSvc.notify(eval.getContract().getAdmin().getId(), msg);
    }

    private void notifyConcernedUsers(Contract contract) {
        final var signTmp = "Votre signature est requise sur le contrat de l'offre %s pour l'étudiant %s %s";
        final var signMsg = String.format(signTmp, contract.getStudentApplication().getOffer().getTitle(),
                contract.getStudentApplication().getStudent().getFirstName(),
                contract.getStudentApplication().getStudent().getLastName());

        final var signStudentTmp = "Votre signature est requise sur le contrat de l'offre %s";
        final var signStudentMsg = String.format(signStudentTmp, contract.getStudentApplication().getOffer().getTitle());

        final var rejectTmp = "Le contrat de l'offre %s à été rejeté par %s de %s";
        final var rejectMsg = String.format(rejectTmp, contract.getStudentApplication().getOffer().getTitle(),
                contract.getStudentApplication().getOffer().getEmployer().getContactName(),
                contract.getStudentApplication().getOffer().getEmployer().getCompanyName());

        final var signedTmp = "Le contrat de l'offre %s pour l'étudiant %s %s à été signé par tous les parties";
        final var signedMsg = String.format(signedTmp, contract.getStudentApplication().getOffer().getTitle(),
                contract.getStudentApplication().getStudent().getFirstName(),
                contract.getStudentApplication().getStudent().getLastName());

        switch (contract.getSignatureState()) {
            case WAITING_FOR_EMPLOYER_SIGNATURE:
                notifSvc.notify(contract.getStudentApplication().getOffer().getEmployer().getId(), signMsg);
                break;
            case REJECTED_BY_EMPLOYER:
                notifSvc.notify(contract.getStudentApplication().getStudent().getId(), rejectMsg);
                notifSvc.notify(contract.getAdmin().getId(), rejectMsg);
                break;
            case WAITING_FOR_STUDENT_SIGNATURE:
                notifSvc.notify(contract.getStudentApplication().getStudent().getId(), signStudentMsg);
                break;
            case WAITING_FOR_ADMIN_SIGNATURE:
                notifSvc.notify(contract.getAdmin().getId(), signMsg);
                break;
            case SIGNED:
                notifSvc.notify(contract.getAdmin().getId(), signedMsg);
                notifSvc.notify(contract.getStudentApplication().getStudent().getId(), signedMsg);
                notifSvc.notify(contract.getStudentApplication().getOffer().getEmployer().getId(), signedMsg);
                break;
            default:
                throw new IllegalStateException("State of contract not part of ContractSignatureState: " + contract.getSignatureState());
        }
    }
}
