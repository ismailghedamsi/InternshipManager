package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.util.EmailContentsType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

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
                sendEmail(EmailContentsType.NEW_SIGNATURE_NOTIF, contract.getStudentApplication(), contract.getStudentApplication().getOffer().getEmployer().getEmail());
                break;
            case REJECTED_BY_EMPLOYER:
                sendEmail(EmailContentsType.REJECTION_NOTIF, contract.getStudentApplication(), contract.getAdmin().getEmail());
                sendEmail(EmailContentsType.REJECTION_NOTIF, contract.getStudentApplication(), contract.getStudentApplication().getStudent().getEmail());
                break;
            case WAITING_FOR_STUDENT_SIGNATURE:
                sendEmail(EmailContentsType.NEW_SIGNATURE_NOTIF, contract.getStudentApplication(), contract.getStudentApplication().getStudent().getEmail());
                break;
            case WAITING_FOR_ADMIN_SIGNATURE:
                sendEmail(EmailContentsType.NEW_SIGNATURE_NOTIF, contract.getStudentApplication(), contract.getAdmin().getEmail());
                break;
            case SIGNED:
            default:
                sendEmail(EmailContentsType.SIGNED_CONTRACT, contract.getStudentApplication(), contract.getAdmin().getEmail());
                sendEmail(EmailContentsType.SIGNED_CONTRACT, contract.getStudentApplication(), contract.getStudentApplication().getOffer().getEmployer().getEmail());
                sendEmail(EmailContentsType.SIGNED_CONTRACT, contract.getStudentApplication(), contract.getStudentApplication().getStudent().getEmail());
                break;
        }
    }

    public void notifyAboutCreation(final StudentApplication application) {
        sendEmail(EmailContentsType.CREATION_NOTIF, application, application.getStudent().getEmail());
        sendEmail(EmailContentsType.CREATION_NOTIF, application, application.getOffer().getEmployer().getEmail());
    }

    public void notifyAboutDeletion(final StudentApplication application) {
        sendEmail(EmailContentsType.DELETION_NOTIF, application, application.getStudent().getEmail());
        sendEmail(EmailContentsType.DELETION_NOTIF, application, application.getOffer().getEmployer().getEmail());
    }

    public void sendEmail(EmailContentsType emailContentsType, StudentApplication studentApplication, String recipientEmail) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        setMailContent(emailContentsType, studentApplication, mimeMessage, recipientEmail);
        javaMailSender.send(mimeMessage);
    }

    private void setMailContent(EmailContentsType emailContentsType, StudentApplication studentApplication, MimeMessage mimeMessage, String sendTo) {
        MimeMessageHelper helper;
        String htmlMsg = "";

        try {
            switch (emailContentsType) {
                case CREATION_NOTIF:
                    htmlMsg = "Un contrat a été généré pour l'offre de stage \"" + studentApplication.getOffer().getTitle() + "\" "
                            + "pour l'étudiant " + studentApplication.getStudent().getLastName() + " " + studentApplication.getStudent().getFirstName();
                    break;
                case DELETION_NOTIF:
                    htmlMsg = "Un contrat a été généré pour votre offre " + studentApplication.getOffer().getTitle() + " "
                            + "pour l'étudiant " + studentApplication.getStudent().getLastName() + " " + studentApplication.getStudent().getFirstName()
                            + "<br/>Veuillez consulter le contract sur notre application";
                    break;
                case NEW_SIGNATURE_NOTIF:
                    htmlMsg = "";
                    break;
                case REJECTION_NOTIF:
                    htmlMsg = "";
                    break;
                case SIGNED_CONTRACT:
                    htmlMsg = "";
                    break;
            }

            helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            helper.setTo(sendTo);
            helper.setSubject("Contrat généré");
            helper.setText(htmlMsg, true);
        }
        catch (MessagingException e) {
            log.error("Impossible d'envoyer l'email: {}", e.getMessage());
        }
    }
}
