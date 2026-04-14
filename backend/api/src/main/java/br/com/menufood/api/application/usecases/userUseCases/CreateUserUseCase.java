package br.com.menufood.api.application.usecases.userUseCases;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.UserRepository;
import br.com.menufood.api.application.dto.user.CreateUserRequest;
import br.com.menufood.api.domain.entities.User;
import br.com.menufood.api.domain.enums.UserRole;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateUserUseCase {
   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;

   public User execute(CreateUserRequest request){
      User user = User.builder()
         .name(request.getName())
         .email(request.getEmail())
         .phoneNumber(request.getPhoneNumber())
         .password(passwordEncoder.encode(request.getPassword()))
         .role(UserRole.CLIENT)
         .createdAt(LocalDateTime.now())
         .build();
      return userRepository.save(user);
   }
}
