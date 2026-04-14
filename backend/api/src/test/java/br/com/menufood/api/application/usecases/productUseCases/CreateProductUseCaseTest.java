package br.com.menufood.api.application.usecases.productUseCases;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.application.dto.product.CreateProductRequest;
import br.com.menufood.api.domain.entities.Product;

@ExtendWith(MockitoExtension.class)
class CreateProductUseCaseTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CreateProductUseCase useCase;

    private CreateProductRequest buildRequest() {
        CreateProductRequest request = new CreateProductRequest();
        request.setName("X-Bacon");
        request.setDescription("Hambúrguer artesanal");
        request.setImageUrl("http://img.jpg");
        request.setPrice(new BigDecimal("30.00"));
        return request;
    }

    @Test
    void deveCriarProdutoComIsActiveTrue() {
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product result = useCase.execute(buildRequest());

        assertThat(result.isActive()).isTrue();
    }

    @Test
    void deveMapeiarCamposDoDTO() {
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product result = useCase.execute(buildRequest());

        assertThat(result.getName()).isEqualTo("X-Bacon");
        assertThat(result.getDescription()).isEqualTo("Hambúrguer artesanal");
        assertThat(result.getImageUrl()).isEqualTo("http://img.jpg");
        assertThat(result.getBasePrice()).isEqualByComparingTo(new BigDecimal("30.00"));
    }

    @Test
    void devePersistirProdutoNoRepositorio() {
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(buildRequest());

        verify(productRepository).save(any(Product.class));
    }
}
