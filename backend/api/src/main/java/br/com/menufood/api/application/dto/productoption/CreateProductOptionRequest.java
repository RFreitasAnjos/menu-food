package br.com.menufood.api.application.dto.productoption;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateProductOptionRequest {
   private String name;
   private BigDecimal price;
   private UUID groupId;
}
