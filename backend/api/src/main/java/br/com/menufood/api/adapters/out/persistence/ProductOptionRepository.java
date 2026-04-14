package br.com.menufood.api.adapters.out.persistence;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.menufood.api.domain.entities.ProductOption;

public interface ProductOptionRepository extends JpaRepository<ProductOption, UUID>{

}
