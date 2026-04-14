package br.com.menufood.api.adapters.out.persistence;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.menufood.api.domain.entities.Product;

public interface ProductRepository extends JpaRepository<Product, UUID> {
   //Traga os produtos que mais venderam, ordenados do mais vendido para o menos vendido
   @Query("SELECT p FROM Product p JOIN p.orderItems oi GROUP BY p.id ORDER BY COUNT(oi) DESC")
   List<Product> findTopSellingProducts();

   //Traga os produtos que mais venderam em um período específico, ordenados do mais vendido para o menos vendido
   @Query("SELECT p FROM Product p JOIN p.orderItems oi WHERE oi.order.createdAt BETWEEN :startDate AND :endDate GROUP BY p.id ORDER BY COUNT(oi) DESC")
   List<Product> findTopSellingProductsInPeriod(LocalDateTime startDate, LocalDateTime endDate);
}
