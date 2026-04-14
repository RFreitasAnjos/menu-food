package br.com.menufood.api.application.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.domain.enums.OrderStatus;
import br.com.menufood.api.domain.valueobject.Address;
import lombok.Getter;

@Getter
public class OrderResponse {
    private final UUID id;
    private final OrderStatus status;
    private final BigDecimal totalPrice;
    private final Address address;
    private final LocalDateTime createdAt;
    private final List<OrderItemResponse> items;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.status = order.getStatus();
        this.totalPrice = order.getTotalPrice();
        this.address = order.getAddress();
        this.createdAt = order.getCreatedAt();
        this.items = order.getItems().stream()
                .map(OrderItemResponse::new)
                .toList();
    }
}
