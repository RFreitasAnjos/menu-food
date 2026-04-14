package br.com.menufood.api.application.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateUserRequest {
   private String name;
   private String email;
   private String phoneNumber;
   private String password;
}
