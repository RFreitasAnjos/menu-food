package br.com.menufood.api.application.usecases.userUseCases;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.com.menufood.api.adapters.out.persistence.UserRepository;
import br.com.menufood.api.application.dto.user.CreateUserRequest;
import br.com.menufood.api.domain.entities.User;
import br.com.menufood.api.domain.enums.UserRole;

@ExtendWith(MockitoExtension.class)
class CreateUserUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CreateUserUseCase useCase;

    private CreateUserRequest buildRequest() {
        CreateUserRequest request = new CreateUserRequest();
        request.setName("João");
        request.setEmail("joao@email.com");
        request.setPassword("senha123");
        return request;
    }

    @Test
    void deveSempreAtribuirRoleClient() {
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = useCase.execute(buildRequest());

        assertThat(result.getRole()).isEqualTo(UserRole.CLIENT);
    }

    @Test
    void deveCodificarSenhaComPasswordEncoder() {
        when(passwordEncoder.encode("senha123")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = useCase.execute(buildRequest());

        assertThat(result.getPassword()).isEqualTo("hashed_password");
        verify(passwordEncoder).encode("senha123");
    }

    @Test
    void devePreencherCreatedAt() {
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = useCase.execute(buildRequest());

        assertThat(result.getCreatedAt()).isNotNull();
    }

    @Test
    void devePersistirUsuarioNoRepositorio() {
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(buildRequest());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void deveManterdadosDoRequest() {
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = useCase.execute(buildRequest());

        assertThat(result.getName()).isEqualTo("João");
        assertThat(result.getEmail()).isEqualTo("joao@email.com");
    }
}
