package br.com.menufood.api.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import br.com.menufood.api.domain.enums.OrderStatus;
import br.com.menufood.api.domain.valueobject.Address;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
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
@Table(name = "orders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
   @Id
   @GeneratedValue(strategy = GenerationType.UUID)
   private UUID id;

   private UUID userId;

   private OrderStatus status;

   private BigDecimal totalPrice;

   @Embedded
   private Address address;

   private LocalDateTime createdAt;

   @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
   private List<OrderItem> items;
}
