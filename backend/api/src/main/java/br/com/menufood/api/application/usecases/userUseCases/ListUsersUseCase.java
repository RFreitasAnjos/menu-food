package br.com.menufood.api.application.usecases.userUseCases;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.UserRepository;
import br.com.menufood.api.domain.entities.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListUsersUseCase {
    private final UserRepository userRepository;

    public List<User> execute() {
        return userRepository.findAll();
    }
}
