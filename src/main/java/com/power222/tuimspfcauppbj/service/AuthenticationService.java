package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.PasswordDTO;
import com.power222.tuimspfcauppbj.model.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import java.util.Optional;

@Service
@SessionScope
public class AuthenticationService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public AuthenticationService(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    private UserDetails getPrincipal() {
        var detail = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (UserDetails) detail;
    }

    public User getCurrentUser() {
        return userRepo.findByUsername(getPrincipal().getUsername()).orElse(new User());
    }

    //todo: test
    public Optional<User> updateUserPassword(PasswordDTO dto) {
        return userRepo.findById(dto.getUserId()).map(user -> {
            if (encoder.matches(dto.getOldPassword(), user.getPassword())) {
                user.setPassword(encoder.encode(dto.getNewPassword()));
                return userRepo.saveAndFlush(user);
            } else
                return null;
        });
    }
}
