package br.com.menufood.api.application.usecases.productUseCases;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.application.dto.product.CreateProductRequest;
import br.com.menufood.api.domain.entities.Product;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateProductUseCase {
   private final ProductRepository productRepository;

   public Product execute(CreateProductRequest request) {
      Product product = Product.builder()
         .imageUrl(request.getImageUrl())
         .name(request.getName())
         .description(request.getDescription())
         .basePrice(request.getPrice())
         .category(request.getCategory())
         .isActive(true)
         .build();
      return productRepository.save(product);
   }
}
