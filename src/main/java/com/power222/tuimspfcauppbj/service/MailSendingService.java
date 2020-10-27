package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.User;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.Authenticator;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Service
public class MailSendingService {
    private JavaMailSender javaMailSender;

    public MailSendingService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public Properties setEmailProperties() {
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "mail.smtp.gmail.com");
        properties.put("mail.smtp.port", "587");
        return properties;
    }

    public Session setMailSession(Properties properties, User user) {
        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                if (user instanceof Employer) {
                    Employer employer = (Employer) user;
                    return new PasswordAuthentication(employer.getEmail(), employer.getPassword());
                } else if (user instanceof Student) {
                    Student student = (Student) user;
                    return new PasswordAuthentication(student.getEmail(), student.getPassword());
                }
                return null;
            }
        });
        return session;
    }

    public void sendEmail(User user, final String fileName, final String fileContent) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper;
        Map<String, Object> map = new HashMap<>();
        try {
            helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            String sendTo = "projetemployeur@gmail.com";
            if (user instanceof Employer) {
                sendTo = ((Employer) user).getEmail();
            }
            String htmlMsg = "<h1> This is your contract </h1>";

            // add attachment encode in base64
            byte[] decodedPdfContent = Base64.getDecoder().decode(fileContent);
            helper.addAttachment("contract.pdf", new ByteArrayResource(decodedPdfContent));

            helper.setTo(sendTo);
            helper.setSubject("Subject");
            helper.setText("", true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

}
