package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.PasswordDTO;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authSvc;

    public AuthenticationController(AuthenticationService authSvc) {
        this.authSvc = authSvc;
    }

    @GetMapping("/user")
    public User getCurrentUser() {
        return authSvc.getCurrentUser();
    }

    //todo: test
    @PutMapping("/user")
    public ResponseEntity<Void> updateUserPassword(@RequestBody PasswordDTO dto) {
        return authSvc.updateUserPassword(dto)
                .map(u -> ResponseEntity.ok().<Void>build())
                .orElse(ResponseEntity.badRequest().build());
    }


}
