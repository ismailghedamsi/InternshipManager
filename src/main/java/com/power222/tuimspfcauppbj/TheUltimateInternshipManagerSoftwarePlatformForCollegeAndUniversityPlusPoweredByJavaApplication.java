package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.dao.StudentApplicationRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.*;
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

        private final UserRepository userRepo;
        private final PasswordEncoder passwordEncoder;
        private final ResumeRepository resumeRepo;
        private final InternshipOfferRepository internshipRepo;
        private final StudentApplicationRepository appliRepo;

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder, ResumeRepository resumeRepo, InternshipOfferRepository internshipRepo, StudentApplicationRepository appliRepo) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
            this.resumeRepo = resumeRepo;
            this.internshipRepo = internshipRepo;
            this.appliRepo = appliRepo;
        }

        @Override
        @Transactional
        public void run(String... args) throws IOException {
            userRepo.saveAndFlush(User.builder()
                    .username("admin")
                    .role("admin")
                    .password(passwordEncoder.encode("password"))
                    .build());

            var employer = userRepo.saveAndFlush(Employer.builder()
                    .companyName("Dacima")
                    .contactName("Zack")
                    .username("employeur")
                    .phoneNumber("5144317713")
                    .address("1300 rue ducas")
                    .email("employer@gmail.com")
                    .role("employer")
                    .password(passwordEncoder.encode("password"))
                    .build());

            var student = userRepo.saveAndFlush(Student.builder()
                    .username("etudiant")
                    .role("student")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Bob")
                    .lastName("Brutus")
                    .studentId("1234")
                    .email("power@gmail.ca")
                    .phoneNumber("911")
                    .address("9310 Lasalle")
                    .build());

            var resume = resumeRepo.saveAndFlush(Resume.builder()
                    .name("Bootstrapped Resume")
                    .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/1.pdf")).readAllBytes())))
                    .reviewed(true)
                    .approuved(true)
                    .owner(student)
                    .build());


            var offer = internshipRepo.saveAndFlush(InternshipOffer.builder()
                    .title("Bootstrapped Internship")
                    .description("Some basic description ")
                    .salary(15.98)
                    .creationDate(Date.from(Instant.now()))
                    .limitDateToApply(Date.valueOf(LocalDate.now().plusWeeks(1)))
                    .internshipStartDate(Date.valueOf(LocalDate.now().plusWeeks(2)))
                    .internshipEndDate(Date.valueOf(LocalDate.now().plusWeeks(9)))
                    .nbStudentToHire(5)
                    .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/6.pdf")).readAllBytes())))
                    .employer(employer)
                    .allowedStudents(Collections.singletonList(student))
                    .reviewState(ReviewState.APPROVED)
                    .build());


            var application = appliRepo.saveAndFlush(StudentApplication.builder()
                    .reviewState(ReviewState.APPROVED)
                    .offer(offer)
                    .student(student)
                    .resume(resume)
                    .build());

            resumeRepo.findById(1L);
            resumeRepo.findAll();
            resumeRepo.findByReviewedFalse();
            resumeRepo.findAllByOwner_Id(1L);

        }
    }
}