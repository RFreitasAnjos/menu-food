package br.com.menufood.api.adapters.in.controllers.usercontroller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.menufood.api.application.dto.address.AddressResponse;
import br.com.menufood.api.application.dto.address.CreateAddressRequest;
import br.com.menufood.api.application.dto.order.OrderResponse;
import br.com.menufood.api.application.dto.user.CreateUserRequest;
import br.com.menufood.api.application.dto.user.UserResponse;
import br.com.menufood.api.application.usecases.orderUseCases.GetOrderHistoryUseCase;
import br.com.menufood.api.application.usecases.userUseCases.AddUserAddressUseCase;
import br.com.menufood.api.application.usecases.userUseCases.CreateUserUseCase;
import br.com.menufood.api.application.usecases.userUseCases.DeleteUserAddressUseCase;
import br.com.menufood.api.application.usecases.userUseCases.ListUserAddressesUseCase;
import br.com.menufood.api.application.usecases.userUseCases.UserResponseUseCase;
import br.com.menufood.api.domain.entities.User;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Users")
@RestController
@RequestMapping("api/v1/client/users")
@RequiredArgsConstructor
public class UserController {

   private final CreateUserUseCase createUserUseCase;
   private final UserResponseUseCase userResponseUseCase;
   private final AddUserAddressUseCase addUserAddressUseCase;
   private final ListUserAddressesUseCase listUserAddressesUseCase;
   private final DeleteUserAddressUseCase deleteUserAddressUseCase;
   private final GetOrderHistoryUseCase getOrderHistoryUseCase;

   @PostMapping
   @ApiResponse(responseCode = "200", description = "User created successfully")
   @ApiResponse(responseCode = "400", description = "Invalid request data")
   public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest user) {
      User createdUser = createUserUseCase.execute(user);
      return ResponseEntity.ok(new UserResponse(createdUser));
   }

   @GetMapping("/me")
   @SecurityRequirement(name = "bearerAuth")
   @ApiResponse(responseCode = "200", description = "Authenticated user profile")
   @ApiResponse(responseCode = "401", description = "Token inválido ou ausente")
   public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal UserDetails userDetails) {
      User user = userResponseUseCase.executeByEmail(userDetails.getUsername());
      return ResponseEntity.ok(new UserResponse(user));
   }

   @GetMapping("/me/addresses")
   @SecurityRequirement(name = "bearerAuth")
   @ApiResponse(responseCode = "200", description = "Lista de endereços do usuário")
   public ResponseEntity<List<AddressResponse>> listAddresses(@AuthenticationPrincipal UserDetails userDetails) {
      User user = userResponseUseCase.executeByEmail(userDetails.getUsername());
      List<AddressResponse> addresses = listUserAddressesUseCase.execute(user.getId()).stream()
            .map(AddressResponse::new)
            .toList();
      return ResponseEntity.ok(addresses);
   }

   @PostMapping("/me/addresses")
   @SecurityRequirement(name = "bearerAuth")
   @ApiResponse(responseCode = "200", description = "Endereço cadastrado com sucesso")
   public ResponseEntity<AddressResponse> addAddress(
         @AuthenticationPrincipal UserDetails userDetails,
         @RequestBody CreateAddressRequest request) {
      User user = userResponseUseCase.executeByEmail(userDetails.getUsername());
      return ResponseEntity.ok(new AddressResponse(addUserAddressUseCase.execute(user.getId(), request)));
   }

   @DeleteMapping("/me/addresses/{addressId}")
   @SecurityRequirement(name = "bearerAuth")
   @ApiResponse(responseCode = "204", description = "Endereço removido com sucesso")
   public ResponseEntity<Void> deleteAddress(
         @AuthenticationPrincipal UserDetails userDetails,
         @PathVariable UUID addressId) {
      User user = userResponseUseCase.executeByEmail(userDetails.getUsername());
      deleteUserAddressUseCase.execute(user.getId(), addressId);
      return ResponseEntity.noContent().build();
   }

   @GetMapping("/{id}/orders")
   @SecurityRequirement(name = "bearerAuth")
   @ApiResponse(responseCode = "200", description = "Histórico de pedidos do usuário")
   public ResponseEntity<List<OrderResponse>> getPurchaseHistory(@PathVariable UUID id) {
      List<OrderResponse> orders = getOrderHistoryUseCase.execute(id).stream()
            .map(OrderResponse::new)
            .toList();
      return ResponseEntity.ok(orders);
   }
}

