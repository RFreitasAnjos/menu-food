package br.com.menufood.api.application.dto.product;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import br.com.menufood.api.application.dto.productoptiongroup.ProductOptionGroupResponse;
import br.com.menufood.api.domain.entities.Product;
import br.com.menufood.api.domain.enums.Category;
import lombok.Getter;

@Getter
public class ProductResponse {
    private final UUID id;
    private final String name;
    private final String description;
    private final String imageUrl;
    private final Category category;
    private final BigDecimal basePrice;
    private final boolean isActive;
    private final List<ProductOptionGroupResponse> optionGroups;

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.imageUrl = product.getImageUrl();
        this.category = product.getCategory();
        this.basePrice = product.getBasePrice();
        this.isActive = product.isActive();
        this.optionGroups = product.getOptionGroups() != null
                ? product.getOptionGroups().stream().map(ProductOptionGroupResponse::new).toList()
                : Collections.emptyList();
    }
}


