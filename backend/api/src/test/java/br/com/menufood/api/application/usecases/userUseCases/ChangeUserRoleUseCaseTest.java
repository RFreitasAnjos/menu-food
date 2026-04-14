package br.com.menufood.api.application.usecases.userUseCases;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
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
class ChangeUserRoleUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ChangeUserRoleUseCase useCase;

    @Test
    void deveAlterarRoleDoUsuario() {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .name("João")
                .email("joao@email.com")
                .role(UserRole.CLIENT)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        User result = useCase.execute(userId, UserRole.ADMIN);

        assertThat(result.getRole()).isEqualTo(UserRole.ADMIN);
        verify(userRepository).save(user);
    }

    @Test
    void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.execute(userId, UserRole.ADMIN))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Usuário não encontrado");
    }

    @Test
    void devePersistirUsuarioAposAlteracaoDeRole() {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .name("Maria")
                .email("maria@email.com")
                .role(UserRole.CLIENT)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        useCase.execute(userId, UserRole.ADMIN);

        verify(userRepository).save(user);
    }
}
