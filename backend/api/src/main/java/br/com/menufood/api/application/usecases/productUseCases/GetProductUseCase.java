package br.com.menufood.api.application.usecases.productUseCases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.domain.entities.Product;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetProductUseCase {
    private final ProductRepository productRepository;

    public Product execute(UUID id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + id));
    }
}
