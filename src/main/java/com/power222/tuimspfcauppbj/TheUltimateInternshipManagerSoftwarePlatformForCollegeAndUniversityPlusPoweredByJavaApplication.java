package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.*;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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
        private final InterviewRepository interviewRepo;

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder, ResumeRepository resumeRepo, InternshipOfferRepository internshipRepo, StudentApplicationRepository appliRepo, InterviewRepository interviewRepo) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
            this.resumeRepo = resumeRepo;
            this.internshipRepo = internshipRepo;
            this.appliRepo = appliRepo;
            this.interviewRepo = interviewRepo;
        }

        @Override
        public void run(String... args) throws IOException {
            userRepo.saveAndFlush(User.builder()
                    .username("admin")
                    .role("admin")
                    .password(passwordEncoder.encode("password"))
                    .passwordExpired(true)
                    .build());

            userRepo.saveAndFlush(User.builder()
                    .username("admin2")
                    .role("admin")
                    .password(passwordEncoder.encode("password"))
                    .build());

            var s = userRepo.saveAndFlush(Student.builder()
                    .username("etudiant")
                    .role("student")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Bob")
                    .lastName("Brutus")
                    .studentId("1234")
                    .email("power@gmail.ca")
                    .phoneNumber("911")
                    .address("9310 Lasalle")
                    .resumes(Collections.singletonList(Resume.builder()
                            .name("testResumeFileName XX")
                            .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/1.pdf")).readAllBytes())))
                            .reviewed(true)
                            .approuved(true)
                            .build()))
                    .build());

            var e = userRepo.saveAndFlush(Employer.builder()
                    .companyName("Dacima")
                    .contactName("Zack")
                    .username("employeur")
                    .phoneNumber("5144317713")
                    .address("1300 rue ducas")
                    .email("employer@gmail.com")
                    .role("employer")
                    .password(passwordEncoder.encode("password"))
                    .build());

            //Generating resumes for live testing of resume services
            for (int i = 1; i < 7; i++) {
                resumeRepo.saveAndFlush(Resume.builder()
                        .name("testResumeFileName " + i)
                        .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/" + i + ".pdf")).readAllBytes())))
                        .approuved(i == 3)
                        .reviewed(i == 4)
                        .reasonForRejection(i == 4 ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in " +
                                "faucibus tortor. Fusce vitae bibendum nibh. Nulla tristique sapien erat, nec tincidunt " +
                                "nunc bibendum vel. Nulla facilisi. Donec aliquet fringilla ante sit amet pretium. " : null)
                        .owner(s)
                        .build());
            }

            //Generating students for offer assignement live testing
            List<Student> students = new ArrayList<>();

            for (int i = 0; i < 7; i++) {
                students.add(userRepo.saveAndFlush(Student.builder()
                        .username("etudiant" + i)
                        .password(passwordEncoder.encode("password"))
                        .role("student")
                        .firstName("Bob " + i)
                        .lastName("Brutus")
                        .studentId("1234")
                        .email("power@gmail.ca")
                        .phoneNumber("911")
                        .address("9310 Lasalle")
                        .build()));

            }

//            Generating offers for offer assignement live testing

            List<InternshipOffer> offers = new ArrayList<>();
            for (int i = 1; i < 14; i++) {
                offers.add(internshipRepo.saveAndFlush(InternshipOffer.builder()
                        .title("testInternship " + i)
                        .description("Some basic description " + i)
                        .salary(15.98)
                        .creationDate(Date.from(Instant.now()))
                        .limitDateToApply(i == 6 ? Date.valueOf(LocalDate.now().minusDays(5)) : Date.valueOf(LocalDate.now().plusWeeks(1)))
                        .internshipStartDate(Date.valueOf(LocalDate.now().plusWeeks(2)))
                        .internshipEndDate(Date.valueOf(LocalDate.now().plusWeeks(9)))
                        .nbStudentToHire(25)
                        .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/" + (i > 6 ? i / 2 : i) + ".pdf")).readAllBytes())))
                        .employer(e)
                        .allowedStudents(i % 2 == 0 ? Collections.singletonList(s) : Collections.emptyList())
                        .reviewState(i == 5 ? ReviewState.APPROVED : ReviewState.PENDING)
                        .build()));
            }

            userRepo.saveAndFlush(s.toBuilder()
                    .applications(Collections.singletonList(StudentApplication.builder()
                            .resume(s.getResumes().get(0))
                            .offer(offers.get(0))
                            .student(s)
                            .build())).build());

            appliRepo.saveAndFlush(StudentApplication.builder()
                    .student(s)
                    .build()
            );

//            interviewRepo.saveAndFlush(Interview.builder()
//                    .date(new java.util.Date())
//                    .build());
        }
    }
}
