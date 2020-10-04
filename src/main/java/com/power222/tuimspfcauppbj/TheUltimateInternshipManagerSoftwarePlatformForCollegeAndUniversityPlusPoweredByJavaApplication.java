package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.*;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder, ResumeRepository resumeRepo, InternshipOfferRepository internshipRepo) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
            this.resumeRepo = resumeRepo;
            this.internshipRepo = internshipRepo;
        }

        @Override
        public void run(String... args) throws IOException {
            userRepo.saveAndFlush(User.builder()
                    .enabled(true)
                    .username("admin")
                    .role("admin")
                    .password(passwordEncoder.encode("password"))
                    .build());

            var s = userRepo.saveAndFlush(Student.builder()
                    .enabled(true)
                    .username("etudiant")
                    .role("student")
                    .firstName("Bob")
                    .lastName("Brutus")
                    .studentId("1234")
                    .email("power@gmail.ca")
                    .phoneNumber("911")
                    .address("9310 Lasalle")
                    .build());

            for (int i = 1; i < 7; i++) {

                resumeRepo.saveAndFlush(Resume.builder()
                        .name("testResumeFileName " + i)
                        .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/" + i + ".pdf")).readAllBytes())))
                        .reviewed(i == 4)
                        .reasonForRejection(i == 4 ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in " +
                                "faucibus tortor. Fusce vitae bibendum nibh. Nulla tristique sapien erat, nec tincidunt " +
                                "nunc bibendum vel. Nulla facilisi. Donec aliquet fringilla ante sit amet pretium. " : null)
                        .owner(s)
                        .build());
            }

            var e = userRepo.saveAndFlush(Employer.builder()
                    .enabled(true)
                    .companyName("Dacima")
                    .contactName("Zack")
                    .username("employeur")
                    .phoneNumber("5144317713")
                    .address("1300 rue ducas")
                    .email("employer@gmail.com")
                    .role("employer")
                    .password(passwordEncoder.encode("password"))
                    .build());

            for (int i = 0; i < 7; i++) {
                userRepo.saveAndFlush(Student.builder()
                        .enabled(true)
                        .username("etudiant" + i)
                        .role("student")
                        .firstName("Bob " + i)
                        .lastName("Brutus")
                        .studentId("1234")
                        .email("power@gmail.ca")
                        .phoneNumber("911")
                        .address("9310 Lasalle")
                        .build());

            }

            for (int i = 1; i < 7; i++) {
                internshipRepo.saveAndFlush(InternshipOffer.builder()
                        .title("testInternship " + i)
                        .description("Some basic description " + i)
                        .nbOfWeeks(15)
                        .salary(15.98)
                        .beginHour(8)
                        .endHour(18)
                        .creationDate(Date.from(Instant.now()))
                        .limitDateToApply(Date.valueOf(LocalDate.now().plusWeeks(1)))
                        .joinedFile(new String(Base64.encodeBase64(new FileInputStream(new File("pdf/" + i + ".pdf")).readAllBytes())))
                        .employer(e)
                        .allowedStudents(i % 2 == 0 ? Collections.singletonList(s) : Collections.emptyList())
                        .build());
            }

        }
    }
}
