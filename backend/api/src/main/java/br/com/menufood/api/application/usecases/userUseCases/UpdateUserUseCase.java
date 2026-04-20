package br.com.menufood.api.application.usecases.userUseCases;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.UserRepository;
import br.com.menufood.api.application.dto.user.UpdateUserRequest;
import br.com.menufood.api.domain.entities.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateUserUseCase {

    private final UserRepository userRepository;

    public User execute(User user, UpdateUserRequest request) {
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhoneNumber(request.getPhone().isBlank() ? null : request.getPhone());
        }
        return userRepository.save(user);
    }
}
