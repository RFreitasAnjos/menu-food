package br.com.menufood.api.application.usecases.productOptionGroupUseCase;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.ProductOptionGroupRepository;
import br.com.menufood.api.adapters.out.persistence.ProductRepository;
import br.com.menufood.api.application.dto.productoptiongroup.CreateProductOptionGroupRequest;
import br.com.menufood.api.domain.entities.Product;
import br.com.menufood.api.domain.entities.ProductOptionGroup;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateProductOptionGroupUseCase {
   private final ProductOptionGroupRepository productOptionGroupRepository;
   private final ProductRepository productRepository;

   public ProductOptionGroup execute(CreateProductOptionGroupRequest request) {
      Product product = productRepository.findById(request.getProductId())
         .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + request.getProductId()));

      ProductOptionGroup group = ProductOptionGroup.builder()
         .name(request.getName())
         .required(request.isRequired())
         .minSelection(request.getMinSelection())
         .maxSelection(request.getMaxSelection())
         .product(product)
         .build();
      return productOptionGroupRepository.save(group);
   }
}
