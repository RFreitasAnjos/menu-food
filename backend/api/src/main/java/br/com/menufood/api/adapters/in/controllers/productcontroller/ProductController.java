package br.com.menufood.api.adapters.in.controllers.productcontroller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.menufood.api.application.dto.product.ProductResponse;
import br.com.menufood.api.application.usecases.productUseCases.GetProductUseCase;
import br.com.menufood.api.application.usecases.productUseCases.ListProductsUseCase;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Products")
@RestController
@RequestMapping("api/v1/client/products")
@RequiredArgsConstructor
public class ProductController {

    private final ListProductsUseCase listProductsUseCase;
    private final GetProductUseCase getProductUseCase;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> listProducts() {
        List<ProductResponse> products = listProductsUseCase.execute().stream()
            .map(ProductResponse::new)
            .toList();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable UUID id) {
        return ResponseEntity.ok(new ProductResponse(getProductUseCase.execute(id)));
    }
}

