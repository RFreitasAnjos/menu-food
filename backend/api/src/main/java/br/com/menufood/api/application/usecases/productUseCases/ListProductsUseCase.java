package br.com.menufood.api.application.usecases.productUseCases;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.domain.entities.Product;
import br.com.menufood.api.domain.enums.Category;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListProductsUseCase {
    private final ProductRepository productRepository;

    /** Listagem client-facing: apenas ativos */
    public List<Product> execute() {
        return productRepository.findByIsActiveTrue();
    }

    /**
     * Listagem para o painel admin com filtros opcionais.
     *
     * @param search   texto para busca por nome (null = sem filtro)
     * @param category categoria (null = todas)
     * @param active   true = ativos, false = inativos, null = todos
     */
    public List<Product> executeAdmin(String search, Category category, Boolean active) {
        boolean hasSearch   = search   != null && !search.isBlank();
        boolean hasCategory = category != null;

        if (active == null) {
            // todos os status
            if (hasCategory && hasSearch)
                return productRepository.findByCategoryAndNameContainingIgnoreCase(category, search);
            if (hasCategory)
                return productRepository.findByCategory(category);
            if (hasSearch)
                return productRepository.findByNameContainingIgnoreCase(search);
            return productRepository.findAll();
        }

        if (active) {
            if (hasCategory && hasSearch)
                return productRepository.findByIsActiveTrueAndCategoryAndNameContainingIgnoreCase(category, search);
            if (hasCategory)
                return productRepository.findByIsActiveTrueAndCategory(category);
            if (hasSearch)
                return productRepository.findByIsActiveTrueAndNameContainingIgnoreCase(search);
            return productRepository.findByIsActiveTrue();
        }

        // inativos
        if (hasCategory && hasSearch)
            return productRepository.findByIsActiveFalseAndCategoryAndNameContainingIgnoreCase(category, search);
        if (hasCategory)
            return productRepository.findByIsActiveFalseAndCategory(category);
        if (hasSearch)
            return productRepository.findByIsActiveFalseAndNameContainingIgnoreCase(search);
        return productRepository.findByIsActiveFalse();
    }
}
