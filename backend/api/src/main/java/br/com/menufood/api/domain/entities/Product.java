package br.com.menufood.api.domain.entities;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import br.com.menufood.api.domain.enums.Category;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
   @Id
   @GeneratedValue(strategy = GenerationType.UUID)
   private UUID id;

   private String imageUrl;

   @Column(nullable = false, length = 50)
   private String name;

   private Category category;

   @Column(length = 255)
   private String description;

   private BigDecimal basePrice;

   private boolean isActive;

   @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
   private List<OrderItem> orderItems;

   @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
   private List<ProductOptionGroup> optionGroups;
}
