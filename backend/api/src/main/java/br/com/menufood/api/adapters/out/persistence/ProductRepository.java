package br.com.menufood.api.adapters.out.persistence;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.menufood.api.domain.entities.Product;

public interface ProductRepository extends JpaRepository<Product, UUID> {
   List<Product> findByIsActiveTrue();

   List<Product> findAll();

   List<Product> findByIsActiveTrueAndCategory(br.com.menufood.api.domain.enums.Category category);

   List<Product> findByCategory(br.com.menufood.api.domain.enums.Category category);

   List<Product> findByNameContainingIgnoreCase(String name);

   List<Product> findByIsActiveTrueAndNameContainingIgnoreCase(String name);

   List<Product> findByIsActiveFalseAndNameContainingIgnoreCase(String name);

   List<Product> findByIsActiveFalse();

   List<Product> findByIsActiveTrueAndCategoryAndNameContainingIgnoreCase(
         br.com.menufood.api.domain.enums.Category category, String name);

   List<Product> findByIsActiveFalseAndCategoryAndNameContainingIgnoreCase(
         br.com.menufood.api.domain.enums.Category category, String name);

   List<Product> findByCategoryAndNameContainingIgnoreCase(
         br.com.menufood.api.domain.enums.Category category, String name);

   List<Product> findByIsActiveFalseAndCategory(br.com.menufood.api.domain.enums.Category category);

   //Traga os produtos que mais venderam, ordenados do mais vendido para o menos vendido
   @Query("SELECT p FROM Product p JOIN p.orderItems oi GROUP BY p.id ORDER BY COUNT(oi) DESC")
   List<Product> findTopSellingProducts();

   //Traga os produtos que mais venderam em um período específico, ordenados do mais vendido para o menos vendido
   @Query("SELECT p FROM Product p JOIN p.orderItems oi WHERE oi.order.createdAt BETWEEN :startDate AND :endDate GROUP BY p.id ORDER BY COUNT(oi) DESC")
   List<Product> findTopSellingProductsInPeriod(LocalDateTime startDate, LocalDateTime endDate);
}
