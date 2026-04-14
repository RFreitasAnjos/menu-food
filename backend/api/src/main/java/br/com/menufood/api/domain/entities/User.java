package br.com.menufood.api.domain.entities;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.menufood.api.domain.enums.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class User {
   @Id
   @GeneratedValue
   private UUID id;

   @NonNull
   @Column(nullable = false, length = 50)
   private String name;

   @NonNull
   @Column(nullable = false, unique = true, length = 50)
   private String email;

   private String password;

   private String phoneNumber;

   @Enumerated(EnumType.STRING)
   private UserRole role;

   private LocalDateTime createdAt;

   private LocalDateTime updatedAt;
}
