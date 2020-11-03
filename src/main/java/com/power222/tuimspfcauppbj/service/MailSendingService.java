package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.User;
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

    public void sendEmail(User user) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        String sendTo = getUserEmail(user);
        setMailContent(mimeMessage, sendTo);
        javaMailSender.send(mimeMessage);
    }

    public MimeMessageHelper setMailContent(MimeMessage mimeMessage, String sendTo) {
        MimeMessageHelper helper = null;
        try {
            helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            String htmlMsg = "<h1> This is your contract </h1>";
            helper.setTo(sendTo);
            helper.setSubject("Internship contract");
            helper.setText(htmlMsg, true);
        } catch (MessagingException e) {
            log.error("Imposible d'envoyer un email ", e.getMessage());
        }
        return helper;
    }

    private String getUserEmail(User user) {
        String sentTo = "";
        if (user instanceof Employer) {
            sentTo = ((Employer) user).getEmail();
        }
        return sentTo;
    }
}
