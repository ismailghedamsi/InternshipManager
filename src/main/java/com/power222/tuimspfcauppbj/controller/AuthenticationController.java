package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.PasswordDTO;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authSvc;

    public AuthenticationController(AuthenticationService authSvc) {
        this.authSvc = authSvc;
    }

    @GetMapping("/user")
    public User getCurrentUser() {
        return authSvc.getCurrentUser();
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updateUserPassword(@RequestBody PasswordDTO dto) {
        switch (authSvc.updateUserPassword(dto)) {
            case SUCCESS:
                return ResponseEntity.ok().build();
            case OLD_AND_NEW_EQUAL:
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            case OLD_WRONG:
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            case USER_NOT_FOUND:
            default:
                return ResponseEntity.notFound().build();
        }
    }


}
