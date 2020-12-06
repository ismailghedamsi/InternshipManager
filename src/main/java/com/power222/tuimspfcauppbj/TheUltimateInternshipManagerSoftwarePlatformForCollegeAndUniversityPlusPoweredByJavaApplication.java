package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Admin;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.reactive.ReactiveSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Hooks;

import javax.transaction.Transactional;
import java.util.List;

@SpringBootApplication(exclude = {ReactiveSecurityAutoConfiguration.class, ReactiveUserDetailsServiceAutoConfiguration.class})
@Slf4j
public class TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplication {

    public static void main(String[] args) {
        Hooks.onErrorDropped(ex -> log.info("Caught exception in Publisher: " + ex.getLocalizedMessage()));
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
        @Transactional
        public void run(String... args) {
            if (userRepo.count() == 0)
                userRepo.saveAndFlush(Admin.builder()
                        .email("root@local.host")
                        .password(passwordEncoder.encode("password"))
                        .name("Default Admin")
                        .passwordExpired(true)
                        .build());

            for (int i = 0; i < 30; i++) {
                userRepo.saveAndFlush(Student.builder()
                        .firstName("Prénom" + i)
                        .lastName("Nom" + i)
                        .studentId(String.valueOf(i))
                        .phoneNumber("1234567890")
                        .address("1234 rue Boulette")
                        .email("etudiant" + i + "@gmail.com")
                        .password(passwordEncoder.encode("password"))
                        .semesters(List.of(((i % 3) == 0) ? SemesterContext.getPresentSemester() : "a2019h2020"))
                        .build());
            }
        }
    }
}
