package br.com.menufood.api.application.dto.productoptiongroup;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateProductOptionGroupRequest {
   private String name;
   private boolean required = false;
   private int minSelection = 0;
   private int maxSelection = 1;
   private UUID productId;
}
