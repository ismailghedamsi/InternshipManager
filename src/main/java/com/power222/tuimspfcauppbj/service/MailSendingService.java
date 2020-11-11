package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.util.EmailContentsType;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.util.UserTypes;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayInputStream;
import java.util.Base64;

import static com.power222.tuimspfcauppbj.util.EmailContentsType.*;

@Service
@Slf4j
public class MailSendingService {

    private final JavaMailSender javaMailSender;

    public MailSendingService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void notifyConcernedUsers(final Contract contract) {
        final var application = contract.getStudentApplication();
        final var signatureState = contract.getSignatureState();

        switch (signatureState) {
            case WAITING_FOR_EMPLOYER_SIGNATURE:
                sendEmail(NOTIFY_ABOUT_NEW_SIGNATURE, application, application.getOffer().getEmployer().getEmail());
                break;
            case REJECTED_BY_EMPLOYER:
                sendEmail(NOTIFY_ABOUT_CONTRACT_REJECTION, application, contract.getAdmin().getEmail());
                sendEmail(NOTIFY_ABOUT_CONTRACT_REJECTION, application, application.getStudent().getEmail());
                break;
            case WAITING_FOR_STUDENT_SIGNATURE:
                sendEmail(NOTIFY_ABOUT_NEW_SIGNATURE, application, application.getStudent().getEmail());
                break;
            case WAITING_FOR_ADMIN_SIGNATURE:
                sendEmail(NOTIFY_ABOUT_NEW_SIGNATURE, application, contract.getAdmin().getEmail());
                break;
            case SIGNED:
                sendEmail(NOTIFY_AND_ATTACH_SIGNED_CONTRACT, application, contract.getAdmin().getEmail());
                sendEmail(NOTIFY_AND_ATTACH_SIGNED_CONTRACT, application, application.getOffer().getEmployer().getEmail());
                sendEmail(NOTIFY_AND_ATTACH_SIGNED_CONTRACT, application, application.getStudent().getEmail());
                break;
            default:
                break;
        }
    }

    public void notifyAboutCreation(final StudentApplication application) {
        sendEmail(NOTIFY_ABOUT_NEW_CONTRACT, application, application.getStudent().getEmail());
        sendEmail(NOTIFY_ABOUT_NEW_CONTRACT, application, application.getOffer().getEmployer().getEmail());
    }

    public void notifyAboutDeletion(final StudentApplication application) {
        sendEmail(NOTIFY_ABOUT_CONTRACT_DELETION, application, application.getStudent().getEmail());
        sendEmail(NOTIFY_ABOUT_CONTRACT_DELETION, application, application.getOffer().getEmployer().getEmail());
    }

    public void sendEmail(EmailContentsType emailContentsType, StudentApplication studentApplication, String recipientEmail) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        prepareMimeMessage(emailContentsType, studentApplication, mimeMessage, recipientEmail);
        javaMailSender.send(mimeMessage);
    }

    private void prepareMimeMessage(EmailContentsType emailType, StudentApplication application, MimeMessage mimeMessage, String recipientEmail) {
        String messageSubject = getAppropriateEmailSubject(application, emailType);
        String messageContents = getAppropriateEmailTextContent(application, emailType);

        try {
            if (messageContents == null)
                throw new MessagingException("Message contents are null.");
            if (messageSubject == null)
                throw new MessagingException("Message subject is null.");

            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            helper.setTo(recipientEmail);
            helper.setSubject(messageSubject);
            helper.setText(messageContents, true);

            if (emailType == NOTIFY_AND_ATTACH_SIGNED_CONTRACT) {
                InputStreamSource inSrc = () -> new ByteArrayInputStream(Base64.getMimeDecoder().decode(application.getContract().getFile().split(",")[1]));
                helper.addAttachment("Contrat " + application.getOffer().getTitle() + " - "
                                             + application.getStudent().getLastName() + " "
                                             + application.getStudent().getFirstName(), inSrc);
            }
        } catch (MessagingException e) {
            log.error("Impossible d'envoyer l'email: {}", e.getMessage());
        }
    }

    private String getAppropriateEmailSubject(final StudentApplication application, final EmailContentsType emailType) {
        String subjectSuffix = " - Offre " + application.getOffer().getTitle() + " - " + application.getStudent().getLastName() + " " + application.getStudent().getLastName();

        switch (emailType) {
            case NOTIFY_ABOUT_NEW_CONTRACT:
                return "NOUVEAU CONTRAT" + subjectSuffix;
            case NOTIFY_ABOUT_CONTRACT_DELETION:
                return "CONTRAT SUPPRIMÉ" + subjectSuffix;
            case NOTIFY_ABOUT_NEW_SIGNATURE:
                return "NOUVELLE SIGNATURE POUR UN CONTRAT" + subjectSuffix;
            case NOTIFY_ABOUT_CONTRACT_REJECTION:
                return "CONTRAT REJETÉ" + subjectSuffix;
            case NOTIFY_AND_ATTACH_SIGNED_CONTRACT:
                return "CONTRAT SIGNÉ" + subjectSuffix;
            default:
                return null;
        }
    }

    private String getAppropriateEmailTextContent(final StudentApplication application, final EmailContentsType emailType) {
        switch (emailType) {
            case NOTIFY_ABOUT_NEW_CONTRACT:
                return "Un contrat a été généré pour l'offre de stage \"" + application.getOffer().getTitle() + "\" "
                        + "avec l'étudiant " + application.getStudent().getLastName() + " " + application.getStudent().getFirstName()
                        + "<br/>Veuillez consulter le contract sur notre application.";
            case NOTIFY_ABOUT_CONTRACT_DELETION:
                return "Le contrat pour l'offre de stage \"" + application.getOffer().getTitle() + "\" "
                        + "avec l'étudiant " + application.getStudent().getLastName() + " " + application.getStudent().getFirstName() + " "
                        + "a été supprimé par l'administrateur.";
            case NOTIFY_ABOUT_NEW_SIGNATURE:
                return "Une signature a été apposée sur le contrat pour l'offre de stage \"" + application.getOffer().getTitle() + "\" "
                        + "avec l'étudiant " + application.getStudent().getLastName() + " " + application.getStudent().getFirstName()
                        + "<br/>Veuillez consulter le contract sur notre application.";
            case NOTIFY_ABOUT_CONTRACT_REJECTION:
                return "Le contrat pour l'offre de stage \"" + application.getOffer().getTitle() + "\" "
                        + "pour l'étudiant " + application.getStudent().getLastName() + " " + application.getStudent().getFirstName()
                        + "a été rejeté par l'employeur pour la raison suivante :"
                        + "<br/>    " + application.getContract().getReasonForRejection();
            case NOTIFY_AND_ATTACH_SIGNED_CONTRACT:
                return "Le contrat pour l'offre de stage \"" + application.getOffer().getTitle() + "\" "
                        + "pour l'étudiant " + application.getStudent().getLastName() + " " + application.getStudent().getFirstName()
                        + "a été signé par tous les partis et est prêt."
                        + "<br/>Vous le trouverez ci-joint.";
            default:
                return null;
        }
    }
}
