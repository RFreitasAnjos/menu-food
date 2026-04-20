package br.com.menufood.api.application.usecases.orderUseCases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.OrderRepository;
import br.com.menufood.api.domain.entities.Order;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetOrderByIdUseCase {

    private final OrderRepository orderRepository;

    public Order execute(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + id));
    }
}
