package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class AuthenticationServiceTests {

    @Mock
    private UserRepository userRepo;

    @MockBean
    private AuthenticationService authSvc;

    @Test
    @WithMockUser(value = "admin", password = "password", )
    void invalidUser() {
        when(userRepo.findByUsername(any())).thenReturn(Optional.empty());

        assertThat(authSvc.getCurrentUser(), is(equalTo(new User())));
    }
}
