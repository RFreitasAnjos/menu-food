package br.com.menufood.api.application.dto.productoptiongroup;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import br.com.menufood.api.application.dto.productoption.ProductOptionResponse;
import br.com.menufood.api.domain.entities.ProductOptionGroup;
import lombok.Getter;

@Getter
public class ProductOptionGroupResponse {
    private final UUID id;
    private final String name;
    private final boolean required;
    private final int minSelection;
    private final int maxSelection;
    private final List<ProductOptionResponse> options;

    public ProductOptionGroupResponse(ProductOptionGroup group) {
        this.id = group.getId();
        this.name = group.getName();
        this.required = group.isRequired();
        this.minSelection = group.getMinSelection();
        this.maxSelection = group.getMaxSelection();
        this.options = group.getOptions() != null
                ? group.getOptions().stream().map(ProductOptionResponse::new).toList()
                : Collections.emptyList();
    }
}
