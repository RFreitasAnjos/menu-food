package br.com.menufood.api.application.dto.order;

import java.math.BigDecimal;
import java.util.UUID;

import br.com.menufood.api.domain.entities.OrderItem;
import lombok.Getter;

@Getter
public class OrderItemResponse {
    private final UUID id;
    private final UUID productId;
    private final String productName;
    private final int quantity;
    private final BigDecimal basePrice;
    private final BigDecimal totalPrice;

    public OrderItemResponse(OrderItem item) {
        this.id = item.getId();
        this.productId = item.getProduct().getId();
        this.productName = item.getProduct().getName();
        this.quantity = item.getQuantity();
        this.basePrice = item.getBasePrice();
        this.totalPrice = item.getTotalPrice();
    }
}
