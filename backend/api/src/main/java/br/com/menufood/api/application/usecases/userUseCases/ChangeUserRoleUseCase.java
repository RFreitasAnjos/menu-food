package br.com.menufood.api.application.usecases.userUseCases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.UserRepository;
import br.com.menufood.api.domain.entities.User;
import br.com.menufood.api.domain.enums.UserRole;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChangeUserRoleUseCase {

    private final UserRepository userRepository;

    public User execute(UUID userId, UserRole newRole) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + userId));
        user.setRole(newRole);
        return userRepository.save(user);
    }
}
