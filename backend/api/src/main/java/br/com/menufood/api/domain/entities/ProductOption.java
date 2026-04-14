package br.com.menufood.api.domain.entities;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_options")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ProductOption {
   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
   private UUID id;

   private String name;

   private BigDecimal price;

   @ManyToOne
   @JoinColumn(name = "group_id")
   private ProductOptionGroup group;
}
