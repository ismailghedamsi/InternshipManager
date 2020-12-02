package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternEvaluation;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import com.power222.tuimspfcauppbj.util.EmailContentsType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayInputStream;
import java.util.Base64;

@Service
@Slf4j
public class MailSendingService {

    private final JavaMailSender javaMailSender;

    public MailSendingService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void notifyConcernedUsers(final Contract contract) {
        final var signatureState = contract.getSignatureState();

        switch (signatureState) {
            case WAITING_FOR_EMPLOYER_SIGNATURE:
                sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_SIGNATURE, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
                break;
            case REJECTED_BY_EMPLOYER:
                sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_REJECTION, contract, contract.getAdmin().getEmail());
                sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_REJECTION, contract, contract.getStudentApplication().getStudent().getEmail());
                break;
            case WAITING_FOR_STUDENT_SIGNATURE:
                sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_SIGNATURE, contract, contract.getStudentApplication().getStudent().getEmail());
                break;
            case WAITING_FOR_ADMIN_SIGNATURE:
                sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_SIGNATURE, contract, contract.getAdmin().getEmail());
                break;
            case SIGNED:
            default:
                sendEmail(EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT, contract, contract.getAdmin().getEmail());
                sendEmail(EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
                sendEmail(EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT, contract, contract.getStudentApplication().getStudent().getEmail());
                break;
        }
    }

    public void notifyAboutCreation(final Contract contract) {
        sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_CONTRACT, contract, contract.getStudentApplication().getStudent().getEmail());
        sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_CONTRACT, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
    }

    public void notifyAboutCreation(final InternEvaluation internEvaluation) {
        sendEmail(EmailContentsType.NOTIFY_ABOUT_EVALUATION_CREATED, internEvaluation.getContract(), internEvaluation.getContract().getAdmin().getEmail());
    }

    public void notifyAboutDeletion(final Contract contract) {
        sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_DELETION, contract, contract.getStudentApplication().getStudent().getEmail());
        sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_DELETION, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
    }

    public void sendEmail(EmailContentsType emailContentsType, Contract contract, String recipientEmail) {
        MimeMessage mimeMessage = prepareMimeMessage(emailContentsType, contract, recipientEmail);
        javaMailSender.send(mimeMessage);
    }

    private MimeMessage prepareMimeMessage(EmailContentsType emailType, Contract contract, String recipientEmail) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        String messageSubject = getAppropriateEmailSubject(contract, emailType);
        String messageContents = getAppropriateEmailTextContent(contract, emailType);

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            helper.setTo(recipientEmail);
            helper.setSubject(messageSubject);
            helper.setText(messageContents, true);

            if (emailType == EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT) {
                final InputStreamSource inSrc = () -> new ByteArrayInputStream(Base64.getMimeDecoder().decode(contract.getFile().split(",")[1]));
                helper.addAttachment("Contrat " + contract.getStudentApplication().getOffer().getTitle() + " - "
                                             + contract.getStudentApplication().getStudent().getFirstName() + " "
                                             + contract.getStudentApplication().getStudent().getLastName(), inSrc);
            }
        } catch (MessagingException e) {
            log.error("Impossible d'envoyer l'email: {}", e.getMessage());
        }
        return mimeMessage;
    }

    public String getAppropriateEmailSubject(final Contract contract, final EmailContentsType emailType) {
        String subjectSuffix = (emailType == EmailContentsType.NOTIFY_ABOUT_EVALUATION_CREATED) ? "" :
                (" - Offre \"" + contract.getStudentApplication().getOffer().getTitle() + "\"" + " - "
                        + contract.getStudentApplication().getStudent().getFirstName() + " "
                        + contract.getStudentApplication().getStudent().getLastName());
        switch (emailType) {
            case NOTIFY_ABOUT_NEW_CONTRACT:
                return "NOUVEAU CONTRAT" + subjectSuffix;
            case NOTIFY_ABOUT_CONTRACT_DELETION:
                return "CONTRAT SUPPRIMÉ" + subjectSuffix;
            case NOTIFY_ABOUT_NEW_SIGNATURE:
                if (contract.getSignatureState() == ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE)
                    return "CONTRAT APPROUVÉ - " + subjectSuffix;
                return "NOUVELLE SIGNATURE POUR UN CONTRAT" + subjectSuffix;
            case NOTIFY_ABOUT_CONTRACT_REJECTION:
                return "CONTRAT REJETÉ" + subjectSuffix;
            case NOTIFY_AND_ATTACH_SIGNED_CONTRACT:
                return "CONTRAT SIGNÉ" + subjectSuffix;
            case NOTIFY_ABOUT_EVALUATION_CREATED:
            default:
                return "NOUVELLE ÉVALUATION DE STAGE";
        }
    }

    public String getAppropriateEmailTextContent(final Contract contract, final EmailContentsType emailType) {
        switch (emailType) {
            case NOTIFY_ABOUT_NEW_CONTRACT:
                return "Un contrat a été généré pour l'offre de stage \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "avec l'étudiant " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName() + "."
                        + "<br/>Veuillez consulter le contract sur notre application.";
            case NOTIFY_ABOUT_CONTRACT_DELETION:
                return "Le contrat pour l'offre de stage \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "avec l'étudiant " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName() + " "
                        + "a été supprimé par l'administrateur.";
            case NOTIFY_ABOUT_NEW_SIGNATURE:
                if (contract.getSignatureState() == ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE)
                    return "Le contrat pour l'offre de stage \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                            + "avec l'étudiant " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName() + " "
                            + "a été approuvé par l'administrateur.";
                return "Une signature a été apposée sur le contrat pour l'offre de stage \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "avec l'étudiant " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName() + "."
                        + "<br/>Veuillez consulter le contract sur notre application.";
            case NOTIFY_ABOUT_CONTRACT_REJECTION:
                return "Le contrat pour l'offre de stage \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "avec l'étudiant " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName()
                        + "a été rejeté par l'employeur pour la raison suivante :"
                        + "<br/>    " + contract.getReasonForRejection();
            case NOTIFY_AND_ATTACH_SIGNED_CONTRACT:
                return "Le contrat pour l'offre de stage \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "avec l'étudiant " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName()
                        + "a été signé par tous les partis et est prêt."
                        + "<br/>Vous le trouverez ci-joint.";
            case NOTIFY_ABOUT_EVALUATION_CREATED:
            default:
                return "Une évaluation a été remplie pour l'étudiant."
                        + "<br/>Veuillez consulter l'évaluation sur notre application.";

        }
    }
}
