package br.com.menufood.api.adapters.out.persistence;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.menufood.api.domain.entities.User;

public interface UserRepository extends JpaRepository<User, UUID>{
   Optional<User> findByEmail(String email);

}
