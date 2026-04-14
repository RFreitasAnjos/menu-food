package br.com.menufood.api.application.usecases.productUseCases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.application.dto.product.UpdateProductRequest;
import br.com.menufood.api.domain.entities.Product;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateProductUseCase {
    private final ProductRepository productRepository;

    public Product execute(UUID id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + id));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getPrice() != null) product.setBasePrice(request.getPrice());
        if (request.getIsActive() != null) product.setActive(request.getIsActive());

        return productRepository.save(product);
    }
}
