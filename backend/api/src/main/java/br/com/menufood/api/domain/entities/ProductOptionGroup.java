package br.com.menufood.api.domain.entities;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
      

@Entity
@Table(name = "product_option_groups")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ProductOptionGroup {
   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
   private UUID id;

   private String name;

   private boolean required;

   private int minSelection;
   private int maxSelection;

   @ManyToOne
   @JoinColumn(name = "product_id")
   private Product product;

   @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
   private List<ProductOption> options;
}
