package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) {
            userRepo.saveAndFlush(User.builder()
                    .enabled(true)
                    .username("admin")
                    .role("admin")
                    .password(passwordEncoder.encode("password"))
                    .build());

            studentRepo.saveAndFlush(Student.builder()
                    .username("student")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Simon")
                    .lastName("Longpré")
                    .studentId("1386195")
                    .email("simon@cal.qc.ca")
                    .phoneNumber("5144816959")
                    .address("6600 St-Jacques Ouest")
                    .resumes(Collections.emptySet())
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
