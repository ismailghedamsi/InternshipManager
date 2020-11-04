package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.*;
import com.power222.tuimspfcauppbj.model.*;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import com.power222.tuimspfcauppbj.util.ContractDTO;
import com.power222.tuimspfcauppbj.util.ContractSignatureDTO;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.io.*;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
        private final ContractGenerationService contractGenerationService;
        private final ContractRepository contractRepo;

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder, ResumeRepository resumeRepo, InternshipOfferRepository internshipRepo, StudentApplicationRepository appliRepo, ContractGenerationService contractGenerationService, ContractRepository contractRepo) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
            this.resumeRepo = resumeRepo;
            this.internshipRepo = internshipRepo;
            this.appliRepo = appliRepo;
            this.contractGenerationService = contractGenerationService;
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

            var contractDto = ContractDTO.builder()
                    .studentApplicationId(studentApplication.getId())
                    .adminName("Jacob Blake")
                    .engagementStudent("Je m'engage à procrastiner, à ne rien faire et à énerver mon employeur et mes collègues.")
                    .engagementCompany("Nous nous engageons à exploiter le stagiaire et de le placer dans des conditions d'esclavage.")
                    .engagementCollege("Le Collège s'engage à ignorer toutes les plaintes du stagiaire.")
                    .totalHoursPerWeek(39)
                    .build();

            contractGenerationService.generateContract(contractDto);

            var contract = contractRepo.findById(1L).get();

            var signatureDto = ContractSignatureDTO.builder()
                    .contractId(contract.getId())
                    .isApproved(true)
                    .nomSignataire("Andrei Belkin")
                    .signatureTimestamp(LocalDateTime.now())
                    .imageSignature("data:image/jpeg;base64,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ei+Gb3VGBkRkGe/Fek6P4asdPQb41aQd+K5a2JjT03ZjOqonKaF4LkLxz3QyhwcGvRLWztrRBHCgUAAVMAFAAGAOgFLXkVa0qruzjlNy3CiiisSAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqrcWFlcqwkhQlgecc1aopptbAefar4FjkaW4hI7naK4a70nVLaV08ltik84Ne9VWuLG0uEZHiT5h1wM120sZKOktTojWa3PAGOw7X4IoBB6V6nf+BrKYySxkbjk4ri9S8L6pbSEQRsVB7CvRp4inPZnRGpGRg0VLNZ3lt/rkYY68VXEin1ro32NR9FAOaKACiiigAooooAKKKKACiiigAooooAKKKKACiikJAoAWimBwTtGc1ci0vU7gAwxsQfak2luLbcqllHWnIks5xCpY+1dZpPg+7utv2lCufUV2Wm+D9PsGVztYjqMVzVMVCGnUylVjE850rw7qN/IEliZVPciu/wBG8GWmnlXl2v3IPNdXHBBEAI40XHoBUledVxc56LRHNOtKRFFb28AxFGqDp8oqWiiuMxCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAprJG2QyKc+oFOooAx77w9pl9nzEAz6AVg3PgSwKsYGGecZGK7aito1px2ZanJbM8dvPBmsJI3lY2ZqhL4b1aAEvjivbX6GsDU+jV208ZN6NG8azZ5BLbSwHDkZqPHuK6+9/1h+tVK61X8jX2vkc3j3FGPcV0lFP2/kHtfI5vHuKMe4rpKKPb+Qe18jm8e4ox7iukoo9v5B7XyObx7ijHuK6Sij2/kHtfI5vHuKsw6fc3OPLxzW3Wvpn3l+opPEaaIPa+RzieFdZlGUArY0vwRqEjD7VtA969Asfuj8K1RXDPGT2RjKvLY5K38DaVGVaQgsPQf410FppVjZqFjjU49QKvUVxyqznuzBzk92IFUdAB9ABS0UVmSFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/Z")
                    .build();

            contractGenerationService.signContract(signatureDto);

            ByteArrayInputStream pdfIn = new ByteArrayInputStream(java.util.Base64.getMimeDecoder().decode(contract.getFile().split(",")[1]));
            FileOutputStream pdfOut = new FileOutputStream("pdf/generatedPdf.pdf");
            pdfOut.write(pdfIn.readAllBytes());

            ByteArrayInputStream signatureIn = new ByteArrayInputStream(java.util.Base64.getMimeDecoder().decode(signatureDto.getImageSignature().split(",")[1]));
            FileOutputStream signatureOut = new FileOutputStream("pdf/savedSignature.jpeg");
            signatureOut.write(signatureIn.readAllBytes());

            userRepo.flush();
            resumeRepo.flush();
            internshipRepo.flush();
            appliRepo.flush();
        }
    }
}
