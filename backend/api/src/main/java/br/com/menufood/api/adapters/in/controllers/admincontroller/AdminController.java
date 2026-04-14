package br.com.menufood.api.adapters.in.controllers.admincontroller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.menufood.api.application.dto.product.CreateProductRequest;
import br.com.menufood.api.application.dto.product.ProductResponse;
import br.com.menufood.api.application.dto.product.UpdateProductRequest;
import br.com.menufood.api.application.dto.productoption.CreateProductOptionRequest;
import br.com.menufood.api.application.dto.productoption.ProductOptionResponse;
import br.com.menufood.api.application.dto.productoptiongroup.CreateProductOptionGroupRequest;
import br.com.menufood.api.application.dto.productoptiongroup.ProductOptionGroupResponse;
import br.com.menufood.api.application.dto.user.ChangeRoleRequest;
import br.com.menufood.api.application.dto.user.UserResponse;
import br.com.menufood.api.application.usecases.productOptionGroupUseCase.CreateProductOptionGroupUseCase;
import br.com.menufood.api.application.usecases.productOptionUseCase.ProductOptionUseCase;
import br.com.menufood.api.application.usecases.productUseCases.CreateProductUseCase;
import br.com.menufood.api.application.usecases.productUseCases.DeleteProductUseCase;
import br.com.menufood.api.application.usecases.productUseCases.GetProductMostSold;
import br.com.menufood.api.application.usecases.productUseCases.ListProductsUseCase;
import br.com.menufood.api.application.usecases.productUseCases.UpdateProductUseCase;
import br.com.menufood.api.application.usecases.userUseCases.ChangeUserRoleUseCase;
import br.com.menufood.api.application.usecases.userUseCases.ListUsersUseCase;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Admin")
@RestController
@RequestMapping("api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class AdminController {

    private final ChangeUserRoleUseCase changeUserRoleUseCase;
    private final ListUsersUseCase listUsersUseCase;
    private final CreateProductUseCase createProductUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final DeleteProductUseCase deleteProductUseCase;
    private final ListProductsUseCase listProductsUseCase;
    private final ProductOptionUseCase createProductOptionUseCase;
    private final CreateProductOptionGroupUseCase createProductOptionGroupUseCase;
    private final GetProductMostSold getProductMostSold;
    // ── Users ──────────────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = listUsersUseCase.execute().stream()
            .map(UserResponse::new)
            .toList();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> changeUserRole(
            @PathVariable UUID id,
            @RequestBody ChangeRoleRequest request) {
        return ResponseEntity.ok(new UserResponse(changeUserRoleUseCase.execute(id, request.getRole())));
    }

    // ── Products ───────────────────────────────────────────────────────────

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = listProductsUseCase.execute().stream()
            .map(ProductResponse::new)
            .toList();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(new ProductResponse(createProductUseCase.execute(request)));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable UUID id,
            @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(new ProductResponse(updateProductUseCase.execute(id, request)));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        deleteProductUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/products/options")
    public ResponseEntity<ProductOptionResponse> createProductOption(@RequestBody CreateProductOptionRequest request) {
        return ResponseEntity.ok(new ProductOptionResponse(createProductOptionUseCase.execute(request)));
    }

    @GetMapping("/products/options")
    public ResponseEntity<List<ProductOptionResponse>> listProductOptions() {
        return ResponseEntity.ok(createProductOptionUseCase.execute().stream()
            .map(ProductOptionResponse::new)
            .toList());
    }

    @PostMapping("/products/option-groups")
    public ResponseEntity<ProductOptionGroupResponse> createProductOptionGroup(@RequestBody CreateProductOptionGroupRequest request) {
        return ResponseEntity.ok(new ProductOptionGroupResponse(createProductOptionGroupUseCase.execute(request)));
    }

    @GetMapping("/products/most-sold")
    public ResponseEntity<List<ProductResponse>> getMostSoldProducts() {
        List<ProductResponse> products = getProductMostSold.execute().stream()
            .map(ProductResponse::new)
            .toList();
        return ResponseEntity.ok(products);
    }
}

