package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.PasswordDTO;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.util.PasswordUpdateStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

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

    public PasswordUpdateStatus updateUserPassword(PasswordDTO dto) {
        return userRepo.findByUsername(dto.getUsername())
                .map(user -> {
                    if (encoder.matches(dto.getOldPassword(), user.getPassword())
                            && !encoder.matches(dto.getNewPassword(), user.getPassword())) {
                        user.setPassword(encoder.encode(dto.getNewPassword()));
                        user.setPasswordExpired(false);
                        userRepo.saveAndFlush(user);
                        return PasswordUpdateStatus.SUCCESS;
                    } else if (encoder.matches(dto.getNewPassword(), user.getPassword()))
                        return PasswordUpdateStatus.OLD_AND_NEW_EQUAL;
                    else
                        return PasswordUpdateStatus.OLD_WRONG;

                }).orElse(PasswordUpdateStatus.USER_NOT_FOUND);
    }
}
