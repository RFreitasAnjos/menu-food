package br.com.menufood.api.application.dto.user;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.menufood.api.domain.entities.User;
import br.com.menufood.api.domain.enums.UserRole;
import lombok.Getter;

@Getter
public class UserResponse {
   private final UUID id;
   private final String name;
   private final String email;
   private final String phone;
   private final UserRole role;
   private final LocalDateTime createdAt;

   public UserResponse(User user) {
      this.id = user.getId();
      this.name = user.getName();
      this.email = user.getEmail();
      this.phone = user.getPhoneNumber();
      this.role = user.getRole();
      this.createdAt = user.getCreatedAt();
   }
}
