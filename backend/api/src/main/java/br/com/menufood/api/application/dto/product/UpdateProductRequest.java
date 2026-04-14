package br.com.menufood.api.application.dto.product;

import java.math.BigDecimal;

import br.com.menufood.api.domain.enums.Category;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateProductRequest {
    private String name;
    private String description;
    private String imageUrl;
    private Category category;
    private BigDecimal price;
    private Boolean isActive;
}
