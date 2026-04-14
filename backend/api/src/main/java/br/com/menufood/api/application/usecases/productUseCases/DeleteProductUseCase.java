package br.com.menufood.api.application.usecases.productUseCases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteProductUseCase {
    private final ProductRepository productRepository;

    public void execute(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado: " + id);
        }
        productRepository.deleteById(id);
    }
}
