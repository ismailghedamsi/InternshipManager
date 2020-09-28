package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Resume;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.User;
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

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder, ResumeRepository resumeRepo) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
            this.resumeRepo = resumeRepo;
        }

        @Override
        public void run(String... args) throws IOException {
            userRepo.saveAndFlush(User.builder()
                    .enabled(true)
                    .username("admin")
                    .role("admin")
                    .password(passwordEncoder.encode("password"))
                    .build());

            var u = userRepo.saveAndFlush(Student.builder()
                    .username("student")
                    .password(passwordEncoder.encode("password"))
                    .role("student")
                    .enabled(true)
                    .firstName("Simon")
                    .lastName("Longpré")
                    .studentId("1386195")
                    .email("simon@cal.qc.ca")
                    .phoneNumber("5144816959")
                    .address("6600 St-Jacques Ouest")
                    .build());

            resumeRepo.saveAndFlush(Resume.builder()
                    .name("testResumeFileName")
                    .file(new String(Base64.encodeBase64(new FileInputStream(new File("designpatternscard.pdf")).readAllBytes())))
                    .owner(u)
                    .build());

            userRepo.saveAndFlush(User.builder()
                    .enabled(true)
                    .username("employeur")
                    .role("employer")
                    .password(passwordEncoder.encode("password"))
                    .build());
        }
    }
}
