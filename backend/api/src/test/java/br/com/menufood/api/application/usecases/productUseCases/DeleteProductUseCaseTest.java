package br.com.menufood.api.application.usecases.productUseCases;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;

@ExtendWith(MockitoExtension.class)
class DeleteProductUseCaseTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private DeleteProductUseCase useCase;

    @Test
    void deveDeletarProdutoExistente() {
        UUID id = UUID.randomUUID();
        when(productRepository.existsById(id)).thenReturn(true);

        useCase.execute(id);

        verify(productRepository).deleteById(id);
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoExiste() {
        UUID id = UUID.randomUUID();
        when(productRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> useCase.execute(id))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Produto não encontrado");
    }

    @Test
    void naoDeveChamarDeleteQuandoProdutoNaoExiste() {
        UUID id = UUID.randomUUID();
        when(productRepository.existsById(id)).thenReturn(false);

        try {
            useCase.execute(id);
        } catch (RuntimeException ignored) {
        }

        verify(productRepository, never()).deleteById(any());
    }
}
