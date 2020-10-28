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

import javax.mail.MessagingException;
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

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder, ResumeRepository resumeRepo, InternshipOfferRepository internshipRepo, StudentApplicationRepository appliRepo, MailSendingService mailService) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
            this.resumeRepo = resumeRepo;
            this.internshipRepo = internshipRepo;
            this.mailService = mailService;
        }

        @Override
        public void run(String... args) throws IOException, MessagingException {
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
                            .reviewState(ReviewState.APPROVED)
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

            for (int i = 1; i < 7; i++) {
                resumeRepo.saveAndFlush(Resume.builder()
                        .name("testResumeFileName " + i)
                        .file("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("pdf/" + i + ".pdf")).readAllBytes())))
                        .reviewState(i == 3 ? ReviewState.APPROVED : i == 4 ? ReviewState.DENIED : ReviewState.PENDING)
                        .reasonForRejection(i == 4 ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in " +
                                "faucibus tortor. Fusce vitae bibendum nibh. Nulla tristique sapien erat, nec tincidunt " +
                                "nunc bibendum vel. Nulla facilisi. Donec aliquet fringilla ante sit amet pretium. " : null)
                        .owner(s)
                        .build());
            }

            for (int i = 0; i < 7; i++) {
                userRepo.saveAndFlush(Student.builder()
                        .username("etudiant" + i)
                        .password(passwordEncoder.encode("password"))
                        .role("student")
                        .firstName("Bob " + i)
                        .lastName("Brutus")
                        .studentId("1234")
                        .email("power@gmail.ca")
                        .phoneNumber("911")
                        .address("9310 Lasalle")
                        .build());
            }

            InternshipOffer o = null;
            for (int i = 1; i < 14; i++) {
                o = internshipRepo.saveAndFlush(InternshipOffer.builder()
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
                        .reviewState(i == 5 || i == 2 ? ReviewState.APPROVED : ReviewState.PENDING)
                        .build());
            }

            userRepo.saveAndFlush(s.toBuilder()
                    .applications(Collections.singletonList(StudentApplication.builder()
                            .resume(s.getResumes().get(0))
                            .offer(o)
                            .student(s)
                            .build())).build());

            var employerToSendMail = userRepo.saveAndFlush(Employer.builder()
                    .companyName("Ubisoft")
                    .contactName("Simon")
                    .username("projetemployeur")
                    .phoneNumber("5144317713")
                    .address("1300 rue ducas")
                    .email("projetemployeur@gmail.com")
                    .role("employer")
                    .password(passwordEncoder.encode("Projet_employeur1"))
                    .build());

            mailService.sendEmail(employerToSendMail, "contract.pdf", "JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDc5Pj5z" +
                    "dHJlYW0KeJwr5HIK4dJ3M1QwMlAISeMytDTVM7FUMLa01LOwUAhJ4TJSCCniMtAzAwJzhXIuDWd/" +
                    "v5AgxxAFF1eF4BBHd1fNkCwu1xCuQC4AR7gQRgplbmRzdHJlYW0KZW5kb2JqCjQgMCBvYmoKPDwv" +
                    "Q29udGVudHMgNSAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhcmVudCAyIDAgUi9SZXNvdXJj" +
                    "ZXM8PC9Gb250PDwvRjEgNiAwIFI+Pj4+L1RyaW1Cb3hbMCAwIDU5NSA4NDJdL1R5cGUvUGFnZT4+" +
                    "CmVuZG9iago4IDAgb2JqCjw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggNzMxPj5zdHJlYW0K" +
                    "eJyVVUtu2zAQ3esUsyhQB3Bo8SdK3im1mhgwklaWsyiyYWw6UWtLiT4ueo3eMrfoSHLaxI4dFhJE" +
                    "UJwh37yZeXx0zhJn8JkCZZAsncAnAQMlA8I5JAsHfxaOSwT8dHrRZdK8MIpgmoTnEYxxFl9Hl7MI" +
                    "cCGOYBJN4UsYJ2Mcp7PxdYgG05Pku9OD5hslzlfn8fWBLFCEgxKUcLl74EEnyl2iFCjGCVeNV2+k" +
                    "sxJWBuZ6URhYGFhpWObFusZ/YRL1ca2EB11UKY7ztHpqh9OFKcu8LofvY5SgXEm43552GJgvCKXg" +
                    "+QojaCwnBu5MWaV5lum0Q1ZW+s704Zue/9gCLfL5vbaB4HkBEew4BBYwJNSTlAixS6ipbJLhcU6E" +
                    "Z52MrROVRCh7pybhAiT6iqBj6qNZP6zyX6Yu+jDS83RtRYlUAZHUhhLpUSL3itqOEik4kfb1uXVi" +
                    "ksj/4JEjJQyki2H5W0qeqnqR6qy66Zmbkz6c5bdwVtRVXdpQI/yAeO/Uq+cT5YFQlHhdXX3Ks01q" +
                    "ssxkFVYnNkmeLdKmfsu/tQtlnW4QFK7uN45LfI8pCbtjcedgqwohmxhF4APWC34L4yz3YbWWCP4N" +
                    "CRrFV+MERrNOgg7F1WyAVey1KeuFqAllaWAIKBwuFDX2YT3XpT1syht5soFNFfH22mA0i6PICrSL" +
                    "ifC3ila1crF4uq0rhO4GA0oHzD2eedyD+5KoV1ss02wIzB9QZuWPIqO6jrrM17coWlVe6VWbfrPW" +
                    "adbkHU6VNXtctKplwR6XnKi9pF9cxeE4bu+dJA6vw/HkGHquiOrSfpEXz5pbFXqj0xXi9t+Pn9Gm" +
                    "J/bj/32P2tRdI89M4H739jxgclEibXjAq0b5uzxMw0nDwxHoDDtedXI61as2+GF31oeXKKF54nOH" +
                    "Y+ejKPoU1o78N1k50z07hhcbIu7stpM37BrVed6xnR0ylVy+tO2mr4z/ABYy/yMKZW5kc3RyZWFt" +
                    "CmVuZG9iago3IDAgb2JqCjw8L0NvbnRlbnRzIDggMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Q" +
                    "YXJlbnQgMiAwIFIvUmVzb3VyY2VzPDwvRm9udDw8L0YxIDYgMCBSPj4+Pi9UcmltQm94WzAgMCA1" +
                    "OTUgODQyXS9UeXBlL1BhZ2U+PgplbmRvYmoKMTAgMCBvYmoKPDwvRmlsdGVyL0ZsYXRlRGVjb2Rl" +
                    "L0xlbmd0aCA3Nzg+PnN0cmVhbQp4nJVW227aQBB991fMW4hUbb03r903ktCUCqUtOE9NFTmwQa6w" +
                    "TWyjqvmMfGEem7/oLOBkbWMgAsmM2XNm5pzxwINzFjofP1OgDMJ7h3ug/IBwDuHMwTu54xIBf5xe" +
                    "2D//MpjAIITxYPL929WkfzYcDUO8dXENk7B/OewPx4PT8LczCJ0fzkOD1icSlCeILw1xb5IlGu6i" +
                    "Ip7CTBfTPF6WcZYC5RaBC+Y1vsQKJFZgKlMBUQoSRyKTS6t44Uy6AFIRFliATdwJIEy+JdmGeyHS" +
                    "40TVCtvEdVBNCiYo8bAU4RKumio3tG3KySyXqCCBbOJHGs6zxeLfXEPxpNN5hB+e4ZPh6cEeNi/g" +
                    "RGys+aohOdlCZxpyXRTZapZrWOgClnl2t9AJftJpae6drK/LPC406NLE5WoWR2l5IKWiRAkrrd3E" +
                    "3kIRGHittu0y3te4RAqv1XgE91me6NxqaN3eKoZplhbRNMfvoqLQj0ajUifL4kAqHhAmrHRHN8x8" +
                    "ErTmZHTyUpX1vnZdRYTa5XOqYRmtDcbHMSrjVOf2s0h8jykJzWs+N6xS4tPlg2QchIsT49zv2AB4" +
                    "TGFy2mxlMry86ofX4/a0V1BJQfJd0JGZyCgvY7xWMqAiz2Zol3paokdTXZbaDKt5mz6LEg/t1sku" +
                    "lQZEtHbgIMWxiA3LwwqvCyt9ZpyI5+nLhy5WxjihqoN5by0uJUK0en+qJuCmp29Ou7y3NBS4pLaj" +
                    "/tOUGpWrXN9W4/2rs27lYUYbPItKfbuf4XVNCkqJz9ZwfGyTRtzaqtiuUJx40uxSGVTBzkVqzkpG" +
                    "hL+pKs2SI5rxcOv6NdwFdtN9PmCm+dfjx3omuPl9eA+AMiLZjr2WLBfZX73KDxmMHNz3iOQtgyuG" +
                    "7iYl/nqxGrxp8S4O2zSOQ4IUG9O2QZdpXEoipWXa4QJxClQNt9c0k4Ph2fbW1DDXhfmnkUZx/rYO" +
                    "Ntp2ULEAqYKmqjbPnmkLiFtnaAjbRWNry3xJlL/Vdht0acvwf45H37Q9rkyfE1fWsHV9/wNEiohh" +
                    "CmVuZHN0cmVhbQplbmRvYmoKOSAwIG9iago8PC9Db250ZW50cyAxMCAwIFIvTWVkaWFCb3hbMCAw" +
                    "IDU5NSA4NDJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNiAwIFIvRjIgMTEg" +
                    "MCBSPj4+Pi9UcmltQm94WzAgMCA1OTUgODQyXS9UeXBlL1BhZ2U+PgplbmRvYmoKMSAwIG9iago8" +
                    "PC9QYWdlcyAyIDAgUi9UeXBlL0NhdGFsb2c+PgplbmRvYmoKMyAwIG9iago8PC9DcmVhdGlvbkRh" +
                    "dGUoRDoyMDIwMTAyNzEzMDgzMS0wNCcwMCcpL01vZERhdGUoRDoyMDIwMTAyNzEzMDgzMS0wNCcw" +
                    "MCcpL1Byb2R1Y2VyKGlUZXh0riA3LjEuMTMgqTIwMDAtMjAyMCBpVGV4dCBHcm91cCBOViBcKEFH" +
                    "UEwtdmVyc2lvblwpKT4+CmVuZG9iagoxMSAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1Sb21hbi9F" +
                    "bmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvU3VidHlwZS9UeXBlMS9UeXBlL0ZvbnQ+PgplbmRvYmoK" +
                    "NiAwIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nL1N1" +
                    "YnR5cGUvVHlwZTEvVHlwZS9Gb250Pj4KZW5kb2JqCjIgMCBvYmoKPDwvQ291bnQgMy9LaWRzWzQg" +
                    "MCBSIDcgMCBSIDkgMCBSXS9UeXBlL1BhZ2VzPj4KZW5kb2JqCnhyZWYKMCAxMgowMDAwMDAwMDAw" +
                    "IDY1NTM1IGYgCjAwMDAwMDIyMTQgMDAwMDAgbiAKMDAwMDAwMjU5NiAwMDAwMCBuIAowMDAwMDAy" +
                    "MjU5IDAwMDAwIG4gCjAwMDAwMDAxNjAgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAw" +
                    "MDAyNTA4IDAwMDAwIG4gCjAwMDAwMDEwOTEgMDAwMDAgbiAKMDAwMDAwMDI5MyAwMDAwMCBuIAow" +
                    "MDAwMDAyMDcwIDAwMDAwIG4gCjAwMDAwMDEyMjQgMDAwMDAgbiAKMDAwMDAwMjQxNyAwMDAwMCBu" +
                    "IAp0cmFpbGVyCjw8L0lEIFs8MmQzNDM2NmY2NmU3YmE0ZGU4ZGJmN2NlZjhmYTFiYWY+PDJkMzQz" +
                    "NjZmNjZlN2JhNGRlOGRiZjdjZWY4ZmExYmFmPl0vSW5mbyAzIDAgUi9Sb290IDEgMCBSL1NpemUg" +
                    "MTI+PgolaVRleHQtNy4xLjEzCnN0YXJ0eHJlZgoyNjU5CiUlRU9GCg==");

            userRepo.saveAndFlush(Employer.builder()
                    .companyName("Desjardins")
                    .contactName("Robert Lafondue")
                    .username("employeur2")
                    .phoneNumber("5144317713")
                    .address("1300 rue ducas")
                    .email("employer@gmail.com")
                    .role("employer")
                    .password(passwordEncoder.encode("password"))
                    .build());
        }
    }
}
