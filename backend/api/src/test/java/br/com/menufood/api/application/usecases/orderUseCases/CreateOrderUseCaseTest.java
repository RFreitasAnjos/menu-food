package br.com.menufood.api.application.usecases.orderUseCases;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.menufood.api.adapters.out.persistence.OrderRepository;
import br.com.menufood.api.adapters.out.persistence.ProductOptionRepository;
import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.application.dto.address.CreateAddressRequest;
import br.com.menufood.api.application.dto.order.CreateOrderRequest;
import br.com.menufood.api.application.dto.order.OrderItemRequest;
import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.domain.entities.Product;
import br.com.menufood.api.domain.entities.ProductOption;
import br.com.menufood.api.domain.enums.OrderStatus;

@ExtendWith(MockitoExtension.class)
class CreateOrderUseCaseTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductOptionRepository productOptionRepository;

    @InjectMocks
    private CreateOrderUseCase useCase;

    private CreateAddressRequest buildAddress() {
        CreateAddressRequest address = new CreateAddressRequest();
        address.setStreet("Rua das Flores");
        address.setNumber("100");
        address.setNeighborhood("Centro");
        address.setCity("São Paulo");
        address.setState("SP");
        address.setZipCode("01310-100");
        return address;
    }

    @Test
    void deveCalcularTotalSemOpcoes() {
        UUID productId = UUID.randomUUID();
        Product product = Product.builder()
                .id(productId)
                .name("X-Bacon")
                .basePrice(new BigDecimal("20.00"))
                .build();

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(productId);
        itemRequest.setQuantity(3);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setUserId(UUID.randomUUID());
        request.setAddress(buildAddress());
        request.setItems(List.of(itemRequest));

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order result = useCase.execute(request);

        // 20.00 * 3 = 60.00
        assertThat(result.getTotalPrice()).isEqualByComparingTo(new BigDecimal("60.00"));
    }

    @Test
    void deveCalcularTotalComOpcoes() {
        UUID productId = UUID.randomUUID();
        UUID optionId1 = UUID.randomUUID();
        UUID optionId2 = UUID.randomUUID();

        Product product = Product.builder()
                .id(productId)
                .name("X-Salada")
                .basePrice(new BigDecimal("15.00"))
                .build();

        ProductOption option1 = ProductOption.builder()
                .id(optionId1)
                .name("Extra queijo")
                .price(new BigDecimal("2.00"))
                .build();

        ProductOption option2 = ProductOption.builder()
                .id(optionId2)
                .name("Bacon extra")
                .price(new BigDecimal("3.00"))
                .build();

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(productId);
        itemRequest.setQuantity(2);
        itemRequest.setOptionsIds(List.of(optionId1, optionId2));

        CreateOrderRequest request = new CreateOrderRequest();
        request.setUserId(UUID.randomUUID());
        request.setAddress(buildAddress());
        request.setItems(List.of(itemRequest));

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(productOptionRepository.findAllById(anyList())).thenReturn(List.of(option1, option2));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order result = useCase.execute(request);

        // (15.00 + 2.00 + 3.00) * 2 = 40.00
        assertThat(result.getTotalPrice()).isEqualByComparingTo(new BigDecimal("40.00"));
    }

    @Test
    void deveDefinirStatusComoWaitingPayment() {
        UUID productId = UUID.randomUUID();
        Product product = Product.builder()
                .id(productId)
                .name("Produto")
                .basePrice(new BigDecimal("10.00"))
                .build();

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(productId);
        itemRequest.setQuantity(1);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setUserId(UUID.randomUUID());
        request.setAddress(buildAddress());
        request.setItems(List.of(itemRequest));

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order result = useCase.execute(request);

        assertThat(result.getStatus()).isEqualTo(OrderStatus.WAITING_PAYMENT);
    }

    @Test
    void devePreencherCreatedAt() {
        UUID productId = UUID.randomUUID();
        Product product = Product.builder()
                .id(productId)
                .name("Produto")
                .basePrice(new BigDecimal("10.00"))
                .build();

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(productId);
        itemRequest.setQuantity(1);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setUserId(UUID.randomUUID());
        request.setAddress(buildAddress());
        request.setItems(List.of(itemRequest));

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order result = useCase.execute(request);

        assertThat(result.getCreatedAt()).isNotNull();
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoEncontrado() {
        UUID productId = UUID.randomUUID();
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(productId);
        itemRequest.setQuantity(1);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setUserId(UUID.randomUUID());
        request.setAddress(buildAddress());
        request.setItems(List.of(itemRequest));

        assertThatThrownBy(() -> useCase.execute(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Produto não encontrado");
    }

    @Test
    void deveMapeiarEnderecoCorretamente() {
        UUID productId = UUID.randomUUID();
        Product product = Product.builder()
                .id(productId)
                .name("Produto")
                .basePrice(new BigDecimal("10.00"))
                .build();

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(productId);
        itemRequest.setQuantity(1);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setUserId(UUID.randomUUID());
        request.setAddress(buildAddress());
        request.setItems(List.of(itemRequest));

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order result = useCase.execute(request);

        assertThat(result.getAddress().getStreet()).isEqualTo("Rua das Flores");
        assertThat(result.getAddress().getCity()).isEqualTo("São Paulo");
        assertThat(result.getAddress().getZipCode()).isEqualTo("01310-100");
    }

    @Test
    void deveSomarTotaisDeDoisItens() {
        UUID productId1 = UUID.randomUUID();
        UUID productId2 = UUID.randomUUID();

        Product product1 = Product.builder()
                .id(productId1)
                .name("Produto A")
                .basePrice(new BigDecimal("10.00"))
                .build();

        Product product2 = Product.builder()
                .id(productId2)
                .name("Produto B")
                .basePrice(new BigDecimal("5.00"))
                .build();

        OrderItemRequest item1 = new OrderItemRequest();
        item1.setProductId(productId1);
        item1.setQuantity(2);

        OrderItemRequest item2 = new OrderItemRequest();
        item2.setProductId(productId2);
        item2.setQuantity(4);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setUserId(UUID.randomUUID());
        request.setAddress(buildAddress());
        request.setItems(List.of(item1, item2));

        when(productRepository.findById(productId1)).thenReturn(Optional.of(product1));
        when(productRepository.findById(productId2)).thenReturn(Optional.of(product2));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order result = useCase.execute(request);

        // 10.00 * 2 + 5.00 * 4 = 20.00 + 20.00 = 40.00
        assertThat(result.getTotalPrice()).isEqualByComparingTo(new BigDecimal("40.00"));
    }
}
