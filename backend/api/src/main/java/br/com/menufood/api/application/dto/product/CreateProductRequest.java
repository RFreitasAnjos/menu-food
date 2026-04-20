package br.com.menufood.api.application.dto.product;

import java.math.BigDecimal;

import br.com.menufood.api.domain.enums.Category;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateProductRequest {
   private String imageUrl;
   private String name;
   private String description;
   private BigDecimal price;
   private Category category;
}
