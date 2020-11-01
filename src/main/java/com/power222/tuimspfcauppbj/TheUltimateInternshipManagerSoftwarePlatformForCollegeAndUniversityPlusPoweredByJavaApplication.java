package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.dao.StudentApplicationRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.*;
import com.power222.tuimspfcauppbj.service.MailSendingService;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;

@SpringBootApplication
public class TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplication {
    public static void main(String[] args) {
        SpringApplication.run(TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplication.class, args);
    }

    @Profile("!noBootstrappingTests")
    @Component
    public static class BootstrapConfig implements CommandLineRunner {
        private final MailSendingService mailService;
        private final UserRepository userRepo;
        private final PasswordEncoder passwordEncoder;
        private final ResumeRepository resumeRepo;
        private final InternshipOfferRepository internshipRepo;
        private final StudentApplicationRepository appliRepo;

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder, ResumeRepository resumeRepo, InternshipOfferRepository internshipRepo, StudentApplicationRepository appliRepo, MailSendingService mailService) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
            this.resumeRepo = resumeRepo;
            this.internshipRepo = internshipRepo;
            this.appliRepo = appliRepo;
            this.mailService = mailService;
        }

        @Override
        @Transactional
        public void run(String... args) throws IOException {
            userRepo.save(User.builder()
                    .username("admin")
                    .role("admin")
                    .password(passwordEncoder.encode("password"))
                    .build());

            var employer = userRepo.save(Employer.builder()
                    .role("employer")
                    .username("employeur")
                    .password(passwordEncoder.encode("password"))
                    .companyName("Dacima")
                    .contactName("Zack")
                    .phoneNumber("5144317713")
                    .address("1300 rue ducas")
                    .email("projetemployeur@gmail.com")
                    .build());

            var student = userRepo.save(Student.builder()
                    .role("student")
                    .username("etudiant")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Bob")
                    .lastName("Brutus")
                    .studentId("1234")
                    .email("projetemployeur@gmail.com")
                    .phoneNumber("911")
                    .address("9310 Lasalle")
                    .build());

            var resume = resumeRepo.save(Resume.builder()
                    .name("Résumé bootstrappé")
                    .reviewState(ReviewState.APPROVED)
                    .owner(student)
                    .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/1.pdf")).readAllBytes())))
                    .build());

            var internshipOffer = internshipRepo.save(InternshipOffer.builder()
                    .title("Offre de stage bootstrappée")
                    .description("Description bootstrappée - Développement d'applications Web trois tiers.")
                    .salary(15.98)
                    .creationDate(Date.from(Instant.now()))
                    .limitDateToApply(Date.valueOf(LocalDate.now().plusWeeks(1)))
                    .internshipStartDate(Date.valueOf(LocalDate.now().plusWeeks(2)))
                    .internshipEndDate(Date.valueOf(LocalDate.now().plusWeeks(9)))
                    .nbStudentToHire(25)
                    .reviewState(ReviewState.APPROVED)
                    .employer(employer)
                    .allowedStudents(Collections.singletonList(student))
                    .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/6.pdf")).readAllBytes())))
                    .build());

            var internshipOffer2 = internshipRepo.save(InternshipOffer.builder()
                    .semester("a2021h2022")
                    .title("Offre de stage bootstrappée de l'an prochain")
                    .description("Description bootstrappée - Écriture de scripts en Python.")
                    .salary(18.98)
                    .creationDate(Date.from(Instant.now()))
                    .limitDateToApply(Date.valueOf(LocalDate.now().plusWeeks(1)))
                    .internshipStartDate(Date.valueOf(LocalDate.now().plusWeeks(4)))
                    .internshipEndDate(Date.valueOf(LocalDate.now().plusWeeks(11)))
                    .nbStudentToHire(15)
                    .reviewState(ReviewState.APPROVED)
                    .employer(employer)
                    .allowedStudents(Collections.singletonList(student))
                    .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/4.pdf")).readAllBytes())))
                    .build());

            var studentApplication = appliRepo.save(StudentApplication.builder()
                    .offer(internshipOffer)
                    .student(student)
                    .resume(resume)
                    .build());

            userRepo.flush();
            resumeRepo.flush();
            internshipRepo.flush();
            appliRepo.flush();
        }
    }
}
