package br.com.menufood.api.adapters.out.persistence;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.menufood.api.domain.entities.Order;

public interface OrderRepository extends JpaRepository<Order, UUID>{
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
