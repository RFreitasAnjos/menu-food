package br.com.menufood.api.application.usecases.userUseCases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.UserRepository;
import br.com.menufood.api.domain.entities.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserResponseUseCase {
   private final UserRepository userRepository;

   public User execute(UUID userId){
      return userRepository.findById(userId)
         .orElseThrow(() -> new RuntimeException("User not found"));
   }

   public User executeByEmail(String email){
      return userRepository.findByEmail(email)
         .orElseThrow(() -> new RuntimeException("User not found"));
   }
}
