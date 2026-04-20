package br.com.menufood.api.application.usecases.orderUseCases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.OrderRepository;
import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.domain.enums.OrderStatus;
import br.com.menufood.api.utils.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateOrderStatusUseCase {

    private final OrderRepository orderRepository;

    public Order execute(UUID orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + orderId));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
