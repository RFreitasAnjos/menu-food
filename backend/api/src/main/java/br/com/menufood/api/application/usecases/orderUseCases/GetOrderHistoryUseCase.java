package br.com.menufood.api.application.usecases.orderUseCases;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.OrderRepository;
import br.com.menufood.api.domain.entities.Order;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetOrderHistoryUseCase {

    private final OrderRepository orderRepository;

    public List<Order> execute(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
