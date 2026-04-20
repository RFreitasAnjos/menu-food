package br.com.menufood.api.adapters.out.persistence;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.domain.enums.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, UUID>{
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    long countByStatus(OrderStatus status);

    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime cutoff);
}
