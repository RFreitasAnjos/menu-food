package br.com.menufood.api.application.usecases.productOptionUseCase;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.ProductOptionGroupRepository;
import br.com.menufood.api.adapters.out.persistence.ProductOptionRepository;
import br.com.menufood.api.application.dto.productoption.CreateProductOptionRequest;
import br.com.menufood.api.application.dto.productoption.ProductOptionResponse;
import br.com.menufood.api.domain.entities.ProductOption;
import br.com.menufood.api.domain.entities.ProductOptionGroup;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductOptionUseCase {
   private final ProductOptionRepository productOptionRepository;
   private final ProductOptionGroupRepository productOptionGroupRepository;

   public ProductOption execute(CreateProductOptionRequest request) {
      ProductOptionGroup group = productOptionGroupRepository.findById(request.getGroupId())
         .orElseThrow(() -> new RuntimeException("Grupo de opções não encontrado: " + request.getGroupId()));

      ProductOption productOption = ProductOption.builder()
         .name(request.getName())
         .price(request.getPrice())
         .group(group)
         .build();
      return productOptionRepository.save(productOption);
   }

   public List<ProductOption> execute() {
      return productOptionRepository.findAll();
   }
   
   public void deleteOption(UUID id) {
      ProductOption option = productOptionRepository.findById(id)
         .orElseThrow(() -> new RuntimeException("Opção de produto não encontrada: " + id));
      ProductOptionGroup group = option.getGroup();
      group.getOptions().removeIf(o -> o.getId().equals(id));
      productOptionGroupRepository.save(group);
   }

   public void updateOption(UUID id, String name, BigDecimal price) {
      ProductOption option = productOptionRepository.findById(id)
         .orElseThrow(() -> new RuntimeException("Opção de produto não encontrada: " + id));
      option.setName(name);
      option.setPrice(price);
      productOptionRepository.save(option);
   }
}
