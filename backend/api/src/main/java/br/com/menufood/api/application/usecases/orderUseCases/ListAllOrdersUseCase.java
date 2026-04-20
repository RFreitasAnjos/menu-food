package br.com.menufood.api.application.usecases.orderUseCases;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.OrderRepository;
import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.domain.enums.OrderStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListAllOrdersUseCase {

    private final OrderRepository orderRepository;

    public List<Order> execute() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> execute(OrderStatus status) {
        if (status == null) {
            return orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return orderRepository.findByStatusOrderByCreatedAtDesc(status);
    }
}
