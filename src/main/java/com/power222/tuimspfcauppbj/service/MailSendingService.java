package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.util.UserTypes;
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

    public void sendEmail(StudentApplication studentApplication, UserTypes userTypes) {
        String sendTo = "";
        if ((userTypes == userTypes.EMPLOYER) || (userTypes == userTypes.STUDENT)) {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            sendTo = getUserEmail(studentApplication.getOffer().getEmployer());
            setMailContent(studentApplication, mimeMessage, sendTo);
            javaMailSender.send(mimeMessage);
        }
    }

    private void setMailContent(StudentApplication studentApplication, MimeMessage mimeMessage, String sendTo) {
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            String htmlMsg = "Un contrat a été généré pour l'offre " + studentApplication.getOffer().getTitle()
                    + "<br/>Veuillez consulter le contract sur notre application";

            helper.setTo(sendTo);
            helper.setSubject("Contrat généré");
            helper.setText(htmlMsg, true);
        }
        catch (MessagingException e) {
            log.error("Impossible d'envoyer l'email: {}", e.getMessage());
        }
    }

    private String getUserEmail(User user) {
        String sentTo = null;
        if (user instanceof Employer)
            sentTo = ((Employer) user).getEmail();
        else if (user instanceof Student)
            sentTo = ((Student) user).getEmail();
        return sentTo;
    }
}
