package br.com.menufood.api.adapters.in.controllers.ordercontroller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.menufood.api.application.dto.order.CreateOrderRequest;
import br.com.menufood.api.application.dto.order.OrderResponse;
import br.com.menufood.api.application.usecases.orderUseCases.CreateOrderUseCase;
import br.com.menufood.api.adapters.out.persistence.OrderRepository;
import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.utils.exceptions.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;


@Tag(name = "Orders")
@RestController
@RequestMapping("api/v1/client/orders")
@RequiredArgsConstructor
public class OrderController {

   private final CreateOrderUseCase createOrderUseCase;
   private final OrderRepository orderRepository;

   @ApiResponse(responseCode = "200", description = "Order created successfully")
   @ApiResponse(responseCode = "400", description = "Invalid request data")
   @PostMapping
   public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
      Order createdOrder = createOrderUseCase.execute(request);
      return ResponseEntity.ok(createdOrder);
   }

   @GetMapping("/{id}")
   @SecurityRequirement(name = "bearerAuth")
   @ApiResponse(responseCode = "200", description = "Order details")
   @ApiResponse(responseCode = "404", description = "Order not found")
   public ResponseEntity<OrderResponse> getOrder(
         @PathVariable UUID id,
         @AuthenticationPrincipal UserDetails userDetails) {
      Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
      return ResponseEntity.ok(new OrderResponse(order));
   }
}

