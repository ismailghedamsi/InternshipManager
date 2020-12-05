package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.AdminRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Resume;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final MailSendingService mailSvc;
    private final RsocketNotificationService notifSvc;
    private final AdminRepository adminRepo;

    public NotificationService(MailSendingService mailSvc, RsocketNotificationService notifSvc, AdminRepository adminRepo) {
        this.mailSvc = mailSvc;
        this.notifSvc = notifSvc;
        this.adminRepo = adminRepo;
    }

    public void notifyContractCreation(Contract contract) {
        final var msg = "Un nouveau contrat vous concernant vient d'être créé";

        mailSvc.notifyAboutCreation(contract);
        notifSvc.notify(contract.getStudentApplication().getStudent().getId(), msg);
        notifSvc.notify(contract.getStudentApplication().getOffer().getEmployer().getId(), msg);
    }

    public void notifyContractUpdate(Contract contract) {
        mailSvc.notifyConcernedUsers(contract);
        notifyConcernedUsers(contract);
    }

    public void notifyContractDeletion(Contract contract) {
        final var tmp = "Votre contrat pour l'offre %s vient d'être supprimé par un gestionnaire de stage";
        final var msg = String.format(tmp, contract.getStudentApplication().getOffer().getTitle());

        mailSvc.notifyAboutDeletion(contract);
        notifSvc.notify(contract.getStudentApplication().getStudent().getId(), msg);
        notifSvc.notify(contract.getStudentApplication().getOffer().getEmployer().getId(), msg);
    }

    public void notifyResumeCreation(Resume resume) {
        final var tmp = "%s %s vient de téléverser un nouveau CV : %s. Veuillez le réviser";
        final var msg = String.format(tmp, resume.getOwner().getFirstName(),
                resume.getOwner().getLastName(), resume.getName());

        adminRepo.findAll().forEach(admin -> notifSvc.notify(admin.getId(), msg));
    }

    public void notifyResumeUpdate(Resume resume) {
        final var tmp = "Votre CV %s a été %s";
        final var msg = String.format(tmp, resume.getName(), resume.getReviewState().getValue());

        notifSvc.notify(resume.getOwner().getId(), msg);
    }

    public void notifyOfferCreation(InternshipOffer offer) {
        final var tmp = "%s vient de téléverser une nouvelle offre : %s. Veuillez la réviser";
        final var msg = String.format(tmp, offer.getEmployer().getCompanyName(), offer.getTitle());

        adminRepo.findAll().forEach(admin -> notifSvc.notify(admin.getId(), msg));
    }

    public void notifyOfferUpdate(InternshipOffer offer) {
        final var tmp = "Votre offre %s a été %se";
        final var msg = String.format(tmp, offer.getTitle(), offer.getReviewState().getValue());

        notifSvc.notify(offer.getEmployer().getId(), msg);
    }

    public void notifyOfferAssigned(InternshipOffer offer, long studentId) {
        final var tmp = "Une nouvelle offre est disponible pour vous : %s";
        final var msg = String.format(tmp, offer.getTitle());

        notifSvc.notify(studentId, msg);
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

        final var signedTmp = "Le contrat de l'offre %s pour l'étudiant %s %s à été signé par toutes les parties";
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
