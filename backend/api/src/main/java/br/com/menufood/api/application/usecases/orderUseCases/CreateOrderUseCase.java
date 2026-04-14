package br.com.menufood.api.application.usecases.orderUseCases;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.OrderRepository;
import br.com.menufood.api.adapters.out.persistence.ProductOptionRepository;
import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.adapters.out.persistence.UserAddressRepository;
import br.com.menufood.api.application.dto.order.CreateOrderRequest;
import br.com.menufood.api.application.dto.order.OrderItemRequest;
import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.domain.entities.OrderItem;
import br.com.menufood.api.domain.entities.Product;
import br.com.menufood.api.domain.entities.ProductOption;
import br.com.menufood.api.domain.entities.UserAddress;
import br.com.menufood.api.domain.enums.OrderStatus;
import br.com.menufood.api.domain.valueobject.Address;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateOrderUseCase {
   private final OrderRepository orderRepository;
   private final ProductRepository productRepository;
   private final ProductOptionRepository productOptionRepository;
   private final UserAddressRepository userAddressRepository;

   public Order execute(CreateOrderRequest request){
      List<OrderItem> orderItems = new ArrayList<>();
      BigDecimal totalPrice = BigDecimal.ZERO;

      for(OrderItemRequest itemRequest : request.getItems()) {
         Product product = productRepository.findById(itemRequest.getProductId())
            .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemRequest.getProductId()));

         BigDecimal itemTotal = product.getBasePrice();

         if(itemRequest.getOptionsIds() != null && !itemRequest.getOptionsIds().isEmpty()) {
            List<ProductOption> options = productOptionRepository.findAllById(itemRequest.getOptionsIds());
            for(ProductOption option : options) {
               UUID optionProductId = option.getGroup().getProduct().getId();
               if (!optionProductId.equals(product.getId())) {
                  throw new RuntimeException(
                     "Opção '" + option.getName() + "' não pertence ao produto '" + product.getName() + "'"
                  );
               }
               itemTotal = itemTotal.add(option.getPrice());
            }
         }

         itemTotal = itemTotal.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

         OrderItem orderItem = OrderItem.builder()
            .product(product)
            .quantity(itemRequest.getQuantity())
            .basePrice(product.getBasePrice())
            .totalPrice(itemTotal)
            .build();
         orderItems.add(orderItem);
         totalPrice = totalPrice.add(itemTotal);
      }

      Address address = resolveAddress(request);

      Order order = Order.builder()
                .userId(request.getUserId())
                .status(OrderStatus.WAITING_PAYMENT)
                .totalPrice(totalPrice)
                .address(address)
                .createdAt(LocalDateTime.now())
                .items(orderItems)
                .build();
      orderItems.forEach(item -> item.setOrder(order));
      return orderRepository.save(order);
   }

   private Address resolveAddress(CreateOrderRequest request) {
      if (request.getAddressId() != null) {
         UserAddress saved = userAddressRepository.findById(request.getAddressId())
            .orElseThrow(() -> new RuntimeException("Endereço não encontrado: " + request.getAddressId()));
         return Address.builder()
            .street(saved.getStreet())
            .number(saved.getNumber())
            .neighborhood(saved.getNeighborhood())
            .city(saved.getCity())
            .state(saved.getState())
            .zipCode(saved.getZipCode())
            .build();
      }

      if (request.getAddress() == null) {
         throw new RuntimeException("É necessário informar um endereço ou um addressId para o pedido");
      }

      return Address.builder()
         .street(request.getAddress().getStreet())
         .number(request.getAddress().getNumber())
         .neighborhood(request.getAddress().getNeighborhood())
         .city(request.getAddress().getCity())
         .state(request.getAddress().getState())
         .zipCode(request.getAddress().getZipCode())
         .build();
   }
}

