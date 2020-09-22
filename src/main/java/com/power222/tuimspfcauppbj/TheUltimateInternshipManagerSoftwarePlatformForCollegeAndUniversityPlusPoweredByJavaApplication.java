package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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

            userRepo.saveAndFlush(User.builder()
                    .enabled(true)
                    .username("etudiant")
                    .role("student")
                    .password(passwordEncoder.encode("password"))
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
