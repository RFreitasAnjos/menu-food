package br.com.menufood.api.application.usecases.productUseCases;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.application.dto.product.UpdateProductRequest;
import br.com.menufood.api.domain.entities.Product;
import br.com.menufood.api.domain.enums.Category;

@ExtendWith(MockitoExtension.class)
class UpdateProductUseCaseTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private UpdateProductUseCase useCase;

    @Test
    void deveAtualizarApenasNomeQuandoSomenteNomeForFornecido() {
        UUID id = UUID.randomUUID();
        Product existing = Product.builder()
                .name("Antigo")
                .description("Descrição velha")
                .basePrice(new BigDecimal("10.00"))
                .isActive(true)
                .build();

        UpdateProductRequest request = new UpdateProductRequest();
        request.setName("Novo Nome");

        when(productRepository.findById(id)).thenReturn(Optional.of(existing));
        when(productRepository.save(existing)).thenReturn(existing);

        Product result = useCase.execute(id, request);

        assertThat(result.getName()).isEqualTo("Novo Nome");
        assertThat(result.getDescription()).isEqualTo("Descrição velha");
        assertThat(result.getBasePrice()).isEqualByComparingTo(new BigDecimal("10.00"));
        assertThat(result.isActive()).isTrue();
    }

    @Test
    void naoDeveAlterarCamposQuandoRequestForTudoNull() {
        UUID id = UUID.randomUUID();
        Product existing = Product.builder()
                .name("Original")
                .description("Desc original")
                .basePrice(new BigDecimal("20.00"))
                .isActive(false)
                .build();

        when(productRepository.findById(id)).thenReturn(Optional.of(existing));
        when(productRepository.save(existing)).thenReturn(existing);

        Product result = useCase.execute(id, new UpdateProductRequest());

        assertThat(result.getName()).isEqualTo("Original");
        assertThat(result.getDescription()).isEqualTo("Desc original");
        assertThat(result.getBasePrice()).isEqualByComparingTo(new BigDecimal("20.00"));
        assertThat(result.isActive()).isFalse();
    }

    @Test
    void deveAtualizarTodosOsCamposQuandoFornecidos() {
        UUID id = UUID.randomUUID();
        Product existing = Product.builder()
                .name("Antigo")
                .description("Desc antiga")
                .imageUrl("http://antigo.jpg")
                .basePrice(new BigDecimal("10.00"))
                .isActive(false)
                .build();

        UpdateProductRequest request = new UpdateProductRequest();
        request.setName("Novo");
        request.setDescription("Nova desc");
        request.setImageUrl("http://novo.jpg");
        request.setCategory(Category.FOOD);
        request.setPrice(new BigDecimal("50.00"));
        request.setIsActive(true);

        when(productRepository.findById(id)).thenReturn(Optional.of(existing));
        when(productRepository.save(existing)).thenReturn(existing);

        Product result = useCase.execute(id, request);

        assertThat(result.getName()).isEqualTo("Novo");
        assertThat(result.getDescription()).isEqualTo("Nova desc");
        assertThat(result.getImageUrl()).isEqualTo("http://novo.jpg");
        assertThat(result.getCategory()).isEqualTo(Category.FOOD);
        assertThat(result.getBasePrice()).isEqualByComparingTo(new BigDecimal("50.00"));
        assertThat(result.isActive()).isTrue();
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoEncontrado() {
        UUID id = UUID.randomUUID();
        when(productRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.execute(id, new UpdateProductRequest()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Produto não encontrado");
    }

    @Test
    void devePersistirProdutoAposAtualizacao() {
        UUID id = UUID.randomUUID();
        Product existing = Product.builder()
                .name("Produto")
                .build();

        when(productRepository.findById(id)).thenReturn(Optional.of(existing));
        when(productRepository.save(existing)).thenReturn(existing);

        useCase.execute(id, new UpdateProductRequest());

        verify(productRepository).save(existing);
    }
}
