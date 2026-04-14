package br.com.menufood.api.application.dto.order;

import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderItemRequest {
   private UUID productId;
   private int quantity;
   private String description;
   private List<UUID> optionsIds;
}
