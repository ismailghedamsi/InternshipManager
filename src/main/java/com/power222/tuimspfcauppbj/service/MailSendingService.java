package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.util.MailContractDto;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.Authenticator;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import java.util.Optional;
import java.util.Properties;

@Service
public class MailSendingService {
    private JavaMailSender javaMailSender;
    private StudentApplicationService applicationService;

    public MailSendingService(JavaMailSender javaMailSender, StudentApplicationService applicationService) {
        this.javaMailSender = javaMailSender;
        this.applicationService = applicationService;
    }


    public Session setMailSession(Properties properties, User user) {
        return Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                if (user instanceof Employer) {
                    Employer employer = (Employer) user;
                    return new PasswordAuthentication(employer.getEmail(), employer.getPassword());
                } else if (user instanceof Student) {
                    Student student = (Student) user;
                    return new PasswordAuthentication(student.getEmail(), student.getPassword());
                }
                return new PasswordAuthentication("projetemployeur@gmail.com", "Projet_employeur1");
            }
        });
    }

    public void sendEmail(User user, final String fileName, final String fileContent) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            String sendTo = "projetemployeur@gmail.com";
            if (user instanceof Employer) {
                sendTo = ((Employer) user).getEmail();
            }
            String htmlMsg = "<h1> This is your contract </h1>";

            // add attachment encode in base64

            byte[] decodedPdfContent = com.itextpdf.io.codec.Base64.decode(fileContent);
            helper.addAttachment(fileName, new ByteArrayResource(decodedPdfContent));
            helper.setTo(sendTo);
            helper.setSubject("Internship contract");
            helper.setText(htmlMsg, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public Optional<StudentApplication> getStudentApplication(MailContractDto mailContractDto) {
        return applicationService.getApplicationById(mailContractDto.getStudentApplicationId());
    }


}
