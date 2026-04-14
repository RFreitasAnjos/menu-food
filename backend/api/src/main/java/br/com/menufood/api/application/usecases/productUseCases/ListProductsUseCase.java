package br.com.menufood.api.application.usecases.productUseCases;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.domain.entities.Product;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListProductsUseCase {
    private final ProductRepository productRepository;

    public List<Product> execute() {
        return productRepository.findAll();
    }
}
