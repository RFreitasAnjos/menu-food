package br.com.menufood.api.application.dto.order;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

import br.com.menufood.api.application.dto.address.CreateAddressRequest;

@Getter @Setter
public class CreateOrderRequest {
   private UUID userId;

   /** ID de um endereço salvo pelo usuário. Se informado, o campo address é ignorado. */
   private UUID addressId;

   /** Endereço avulso para entrega. Usado apenas quando addressId não for informado. */
   private CreateAddressRequest address;

   private List<OrderItemRequest> items;
}
