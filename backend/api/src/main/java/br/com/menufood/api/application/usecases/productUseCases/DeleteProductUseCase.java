package br.com.menufood.api.application.usecases.productUseCases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.domain.entities.Product;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteProductUseCase {
    private final ProductRepository productRepository;

    public void execute(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + id));
        product.setActive(false);
        productRepository.save(product);
    }
}
