package com.power222.tuimspfcauppbj.model;

import lombok.Data;

@Data
public class AuthenticationDTO {
    private Long id;
    private String username;
    private String role;

    public static AuthenticationDTO fromUser(User user) {
        var dto = new AuthenticationDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        return dto;
    }
}
