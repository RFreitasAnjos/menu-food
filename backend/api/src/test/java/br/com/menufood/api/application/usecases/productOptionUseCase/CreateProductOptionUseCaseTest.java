package br.com.menufood.api.application.usecases.productOptionUseCase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.menufood.api.adapters.out.persistence.ProductOptionGroupRepository;
import br.com.menufood.api.adapters.out.persistence.ProductOptionRepository;
import br.com.menufood.api.application.dto.productoption.CreateProductOptionRequest;
import br.com.menufood.api.domain.entities.ProductOption;
import br.com.menufood.api.domain.entities.ProductOptionGroup;

@ExtendWith(MockitoExtension.class)
class CreateProductOptionUseCaseTest {

    @Mock
    private ProductOptionRepository productOptionRepository;

    @Mock
    private ProductOptionGroupRepository productOptionGroupRepository;

    @InjectMocks
    private ProductOptionUseCase useCase;

    @Test
    void deveCriarOpcaoVinculadaAoGrupoCorreto() {
        UUID groupId = UUID.randomUUID();
        ProductOptionGroup group = ProductOptionGroup.builder().id(groupId).build();

        CreateProductOptionRequest request = new CreateProductOptionRequest();
        request.setName("Sem cebola");
        request.setPrice(new BigDecimal("1.50"));
        request.setGroupId(groupId);

        when(productOptionGroupRepository.findById(groupId)).thenReturn(Optional.of(group));
        when(productOptionRepository.save(any(ProductOption.class))).thenAnswer(inv -> inv.getArgument(0));

        ProductOption result = useCase.execute(request);

        assertThat(result.getGroup()).isEqualTo(group);
        assertThat(result.getGroup().getId()).isEqualTo(groupId);
    }

    @Test
    void deveMapeiarCamposDoRequest() {
        UUID groupId = UUID.randomUUID();
        ProductOptionGroup group = ProductOptionGroup.builder().id(groupId).build();

        CreateProductOptionRequest request = new CreateProductOptionRequest();
        request.setName("Extra queijo");
        request.setPrice(new BigDecimal("2.00"));
        request.setGroupId(groupId);

        when(productOptionGroupRepository.findById(groupId)).thenReturn(Optional.of(group));
        when(productOptionRepository.save(any(ProductOption.class))).thenAnswer(inv -> inv.getArgument(0));

        ProductOption result = useCase.execute(request);

        assertThat(result.getName()).isEqualTo("Extra queijo");
        assertThat(result.getPrice()).isEqualByComparingTo(new BigDecimal("2.00"));
    }

    @Test
    void deveLancarExcecaoQuandoGrupoNaoEncontrado() {
        UUID groupId = UUID.randomUUID();
        when(productOptionGroupRepository.findById(groupId)).thenReturn(Optional.empty());

        CreateProductOptionRequest request = new CreateProductOptionRequest();
        request.setGroupId(groupId);
        request.setName("Extra bacon");
        request.setPrice(BigDecimal.ONE);

        assertThatThrownBy(() -> useCase.execute(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Grupo de opções não encontrado");
    }
}
