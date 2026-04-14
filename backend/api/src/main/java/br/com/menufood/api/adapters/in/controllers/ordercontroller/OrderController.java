package br.com.menufood.api.adapters.in.controllers.ordercontroller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.menufood.api.application.dto.order.CreateOrderRequest;
import br.com.menufood.api.application.usecases.orderUseCases.CreateOrderUseCase;
import br.com.menufood.api.domain.entities.Order;

import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;


@Tag(name = "Orders")
@RestController
@RequestMapping("api/v1/client/orders")
@RequiredArgsConstructor
public class OrderController {

   private final CreateOrderUseCase createOrderUseCase;

   @ApiResponse(responseCode = "200", description = "Order created successfully")
   @ApiResponse(responseCode = "400", description = "Invalid request data")
   @PostMapping
   public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
      Order createdOrder = createOrderUseCase.execute(request);
      return ResponseEntity.ok(createdOrder);
   }

}
