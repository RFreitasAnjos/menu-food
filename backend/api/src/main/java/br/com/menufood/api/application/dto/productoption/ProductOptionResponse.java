package br.com.menufood.api.application.dto.productoption;

import java.math.BigDecimal;
import java.util.UUID;

import br.com.menufood.api.domain.entities.ProductOption;
import lombok.Getter;

@Getter
public class ProductOptionResponse {
    private final UUID id;
    private final String name;
    private final BigDecimal price;

    public ProductOptionResponse(ProductOption option) {
        this.id = option.getId();
        this.name = option.getName();
        this.price = option.getPrice();
    }
}
