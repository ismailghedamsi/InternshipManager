package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.*;
import com.power222.tuimspfcauppbj.model.*;
import com.power222.tuimspfcauppbj.model.InternshipOffer.InternshipOfferDetails;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import com.power222.tuimspfcauppbj.util.ContractDTO;
import com.power222.tuimspfcauppbj.util.ContractSignatureDTO;
import com.power222.tuimspfcauppbj.util.ReviewState;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

@SpringBootApplication
public class TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplication {

    public static void main(String[] args) {
        SpringApplication.run(TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplication.class, args);
    }

    @SuppressWarnings("MagicNumber")
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

        @SuppressWarnings("ConstructorWithTooManyParameters")
        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder, ResumeRepository resumeRepo, InternshipOfferRepository internshipRepo, StudentApplicationRepository appliRepo, ContractGenerationService contractGenSvc, ContractRepository contractRepo) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
            this.resumeRepo = resumeRepo;
            this.internshipRepo = internshipRepo;
            this.appliRepo = appliRepo;
            this.contractGenSvc = contractGenSvc;
            this.contractRepo = contractRepo;
        }

        @Override
        @Transactional
        public void run(String... args) throws IOException {
            User admin = User.builder()
                    .username("admin")
                    .role("admin")
                    .password(passwordEncoder.encode("password"))
                    .build();

            userRepo.save(admin);

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
                    .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/6.pdf")).readAllBytes())))
                    .build());

            internshipRepo.save(InternshipOffer.builder()
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
                    .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/6.pdf")).readAllBytes())))
                    .build());

            var studentApplication = appliRepo.save(StudentApplication.builder()
                    .state(StudentApplicationState.JOB_OFFER_ACCEPTED_BY_STUDENT)
                    .offer(internshipOffer)
                    .student(student)
                    .resume(resume)
                    .build());

            var contractDto = ContractDTO.builder()
                    .studentApplicationId(studentApplication.getId())
                    .adminName("Jacob Blake")
                    .engagementStudent("Je m'engage à procrastiner, à ne rien faire et à énerver mon employeur et mes collègues.")
                    .engagementCompany("Nous nous engageons à exploiter le stagiaire et de le placer dans des conditions d'esclavage.")
                    .engagementCollege("Le Collège s'engage à ignorer toutes les plaintes du stagiaire.")
                    .totalHoursPerWeek(39)
                    .build();


            contractGenSvc.generateContract(contractDto);
            var contract = contractRepo.findById(1L);

            if (contract.isPresent()) {
                var signatureDto = ContractSignatureDTO.builder()
                        .contractId(contract.get().getId())
                        .isApproved(true)
                        .nomSignataire("Andrei Belkin")
                        .signatureTimestamp(LocalDateTime.now())
                        .imageSignature("data:image/png;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("bootstrapFiles/sign.png")).readAllBytes())))
                        .build();

                contractGenSvc.signContract(signatureDto);
            }

            userRepo.flush();
            resumeRepo.flush();
            internshipRepo.flush();
            appliRepo.flush();
        }
    }
}
