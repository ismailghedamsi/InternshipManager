package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.model.dto.PasswordDTO;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import com.power222.tuimspfcauppbj.util.PasswordUpdateStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("noBootstrappingTests")
@SpringBootTest
public class AuthenticationServiceTests {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private AuthenticationService authSvc;

    private User expectedUser;

    @BeforeEach
    void beforeEach() {
        userRepo.deleteAll();
        expectedUser = userRepo.saveAndFlush(
                User.builder()
                        .username("admin")
                        .role("admin")
                        .password(encoder.encode("password"))
                        .passwordExpired(true)
                        .build());
    }

    @Test
    @WithMockUser("fk_etudiant")
    void invalidUser() {
        assertThat(authSvc.getCurrentUser()).isEqualTo(new User());
    }

    @Test
    @WithMockUser("admin")
    void validUser() {
        User actual = authSvc.getCurrentUser();

        assertThat(actual).isEqualTo(expectedUser);
    }

    @Test
    void updatePasswordTest() {
        var dto = PasswordDTO.builder()
                .oldPassword("password")
                .newPassword("motdepasse")
                .username(expectedUser.getUsername())
                .build();

        var actual = authSvc.updateUserPassword(dto);

        assertThat(actual).isEqualTo(PasswordUpdateStatus.SUCCESS);
    }

    @Test
    void updatePasswordOfInvalidUserTest() {
        var dto = PasswordDTO.builder()
                .oldPassword("password")
                .newPassword("motdepasse")
                .username("bozo")
                .build();

        var actual = authSvc.updateUserPassword(dto);

        assertThat(actual).isEqualTo(PasswordUpdateStatus.USER_NOT_FOUND);
    }

    @Test
    void updatePasswordWithSamePasswordTest() {
        var dto = PasswordDTO.builder()
                .oldPassword("password")
                .newPassword("password")
                .username(expectedUser.getUsername())
                .build();

        var actual = authSvc.updateUserPassword(dto);

        assertThat(actual).isEqualTo(PasswordUpdateStatus.OLD_AND_NEW_EQUAL);
    }

    @Test
    void updatePasswordWithWrongOldPasswordTest() {
        var dto = PasswordDTO.builder()
                .oldPassword("bad_pass")
                .newPassword("motdepasse")
                .username(expectedUser.getUsername())
                .build();

        var actual = authSvc.updateUserPassword(dto);

        assertThat(actual).isEqualTo(PasswordUpdateStatus.OLD_WRONG);
    }
}
