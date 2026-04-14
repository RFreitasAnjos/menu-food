package br.com.menufood.api.application.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String id;
    private String name;
    private String role;
}
