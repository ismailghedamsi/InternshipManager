package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.*;
import com.power222.tuimspfcauppbj.model.*;
import com.power222.tuimspfcauppbj.model.InternshipOffer.InternshipOfferDetails;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import com.power222.tuimspfcauppbj.util.ReviewState;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.Collections;

@SpringBootApplication
public class TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplication {

    public static void main(String[] args) {
        SpringApplication.run(TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplication.class, args);
    }

    @SuppressWarnings({"MagicNumber", "ConstructorWithTooManyParameters", "OverlyCoupledClass", "OverlyLongMethod"})
    @Profile("!noBootstrappingTests")
    @Component
    public static class BootstrapConfig implements CommandLineRunner {

        private final UserRepository userRepo;
        private final PasswordEncoder passwordEncoder;
        private final ResumeRepository resumeRepo;
        private final InternshipOfferRepository internshipRepo;
        private final StudentApplicationRepository appliRepo;
        private final ContractGenerationService contractGenSvc;
        private final ContractRepository contractRepo;
        private final InterviewRepository interviewRepo;

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder, ResumeRepository resumeRepo,
                               InternshipOfferRepository internshipRepo, StudentApplicationRepository appliRepo,
                               ContractGenerationService contractGenSvc, ContractRepository contractRepo,
                               InterviewRepository interviewRepo) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
            this.resumeRepo = resumeRepo;
            this.internshipRepo = internshipRepo;
            this.appliRepo = appliRepo;
            this.contractGenSvc = contractGenSvc;
            this.contractRepo = contractRepo;
            this.interviewRepo = interviewRepo;
        }

        @Override
        @Transactional
        public void run(String... args) {
            var admin = Admin.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("password"))
                    .email("projetemployeur@gmail.com")
                    .name("Jacob Blake")
                    .build();

            userRepo.save(admin);

            var employer = userRepo.save(Employer.builder()
                    .username("employeur")
                    .password(passwordEncoder.encode("password"))
                    .companyName("Dacima")
                    .contactName("Zack")
                    .phoneNumber("5144317713")
                    .address("1300 rue ducas")
                    .email("projetemployeur@gmail.com")
                    .build());

            var student = userRepo.save(Student.builder()
                    .username("etudiant")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Bob")
                    .lastName("Brutus")
                    .studentId("1234567")
                    .email("projetemployeur@gmail.com")
                    .phoneNumber("911")
                    .address("9310 Lasalle")
                    .build());

            var student2 = userRepo.save(Student.builder()
                    .username("etudiant2")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Roméo")
                    .lastName("Latullipe")
                    .studentId("1234567")
                    .email("projetemployeur@gmail.com")
                    .phoneNumber("911")
                    .address("9310 Lasalle")
                    .build());

            var student3 = userRepo.save(Student.builder()
                    .username("etudiant3")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Bob")
                    .lastName("Lamisère")
                    .studentId("1234567")
                    .email("projetemployeur@gmail.com")
                    .phoneNumber("911")
                    .address("9310 Lasalle")
                    .semesters(Collections.singletonList(SemesterContext.getPresentSemester()))
                    .build());

            var student4 = userRepo.save(Student.builder()
                    .username("etudiant4")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Gaston")
                    .lastName("Lagaffe")
                    .studentId("1234567")
                    .email("projetemployeur@gmail.com")
                    .phoneNumber("911")
                    .address("9310 Lasalle")
                    .semesters(Collections.singletonList("a2021h2022"))
                    .build());

            var resume = resumeRepo.save(Resume.builder()
                    .name("Résumé bootstrappé")
                    .reviewState(ReviewState.APPROVED)
                    .owner(student)
                    .build());

            var resume2 = resumeRepo.save(Resume.builder()
                    .name("Résumé bootstrappé 2")
                    .reviewState(ReviewState.PENDING)
                    .owner(student2)
                    .build());

            var resume3 = resumeRepo.save(Resume.builder()
                    .name("Résumé bootstrappé 3")
                    .reviewState(ReviewState.PENDING)
                    .owner(student3)
                    .build());

            var internshipOffer = internshipRepo.save(InternshipOffer.builder()
                    .semester("a2020h2021")
                    .title("Offre de stage bootstrappée")
                    .details(InternshipOfferDetails.builder()
                            .description("Description bootstrappée - Développement d'applications Web trois tiers.")
                            .salary(15.98)
                            .creationDate(LocalDate.now())
                            .limitDateToApply(LocalDate.now().plusWeeks(1))
                            .internshipStartDate(LocalDate.now().plusWeeks(2))
                            .internshipEndDate(LocalDate.now().plusWeeks(9))
                            .nbStudentToHire(25)
                            .build())
                    .reviewState(ReviewState.APPROVED)
                    .employer(employer)
                    .allowedStudents(Collections.singletonList(student))
                    .build());

            var internshipOffer2 = internshipRepo.save(InternshipOffer.builder()
                    .semester("a2021h2022")
                    .title("Offre de stage bootstrappée 2022")
                    .details(InternshipOfferDetails.builder()
                            .description("Description bootstrappée - Développement d'applications Web trois tiers.")
                            .salary(15.98)
                            .creationDate(LocalDate.now())
                            .limitDateToApply(LocalDate.now().plusWeeks(1))
                            .internshipStartDate(LocalDate.now().plusWeeks(2))
                            .internshipEndDate(LocalDate.now().plusWeeks(9))
                            .nbStudentToHire(25)
                            .build())
                    .reviewState(ReviewState.APPROVED)
                    .employer(employer)
                    .allowedStudents(Collections.singletonList(student))
                    .build());

            var studentApplication = appliRepo.save(StudentApplication.builder()
                    .offer(internshipOffer)
                    .student(student)
                    .resume(resume)
                    .state(StudentApplicationState.WAITING_FOR_STUDENT_HIRING_FINAL_DECISION)
                    .build());

            var studentApplication2 = appliRepo.save(StudentApplication.builder()
                    .offer(internshipOffer)
                    .student(student2)
                    .resume(resume2)
                    .state(StudentApplicationState.STUDENT_INVITED_FOR_INTERVIEW_BY_EMPLOYER)
                    .build());

            var studentApplication3 = appliRepo.save(StudentApplication.builder()
                    .offer(internshipOffer2)
                    .student(student3)
                    .resume(resume3)
                    .state(StudentApplicationState.STUDENT_HIRED_BY_EMPLOYER)
                    .build());

            userRepo.flush();
            resumeRepo.flush();
            internshipRepo.flush();
            appliRepo.flush();
            interviewRepo.flush();
        }
    }
}
