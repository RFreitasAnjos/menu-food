package br.com.menufood.api.application.usecases.userUseCases;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.menufood.api.adapters.out.persistence.UserRepository;
import br.com.menufood.api.domain.entities.User;
import br.com.menufood.api.domain.enums.UserRole;

@ExtendWith(MockitoExtension.class)
class UserResponseUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserResponseUseCase useCase;

    @Test
    void deveRetornarUsuarioPorId() {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .name("João")
                .email("joao@email.com")
                .role(UserRole.CLIENT)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        User result = useCase.execute(userId);

        assertThat(result).isEqualTo(user);
    }

    @Test
    void deveLancarExcecaoQuandoIdNaoEncontrado() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.execute(userId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void deveRetornarUsuarioPorEmail() {
        String email = "joao@email.com";
        User user = User.builder()
                .name("João")
                .email(email)
                .role(UserRole.CLIENT)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        User result = useCase.executeByEmail(email);

        assertThat(result).isEqualTo(user);
        assertThat(result.getEmail()).isEqualTo(email);
    }

    @Test
    void deveLancarExcecaoQuandoEmailNaoEncontrado() {
        String email = "naoexiste@email.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.executeByEmail(email))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }
}
