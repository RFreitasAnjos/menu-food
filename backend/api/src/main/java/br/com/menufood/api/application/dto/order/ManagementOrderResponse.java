package br.com.menufood.api.application.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.domain.entities.User;
import br.com.menufood.api.domain.enums.OrderStatus;
import br.com.menufood.api.domain.valueobject.Address;
import lombok.Getter;

@Getter
public class ManagementOrderResponse {

    private final UUID id;
    private final String shortId;
    private final OrderStatus status;
    private final BigDecimal totalPrice;
    private final Address address;
    private final LocalDateTime createdAt;
    private final List<OrderItemResponse> items;

    // user info
    private final String userName;
    private final String userPhone;
    private final String userEmail;

    public ManagementOrderResponse(Order order, User user) {
        this.id = order.getId();
        String idStr = order.getId().toString().replace("-", "");
        this.shortId = "#" + idStr.substring(idStr.length() - 8).toUpperCase();
        this.status = order.getStatus();
        this.totalPrice = order.getTotalPrice();
        this.address = order.getAddress();
        this.createdAt = order.getCreatedAt();
        this.items = order.getItems().stream()
                .map(OrderItemResponse::new)
                .toList();
        this.userName = user != null ? user.getName() : "—";
        this.userPhone = (user != null && user.getPhoneNumber() != null) ? user.getPhoneNumber() : "—";
        this.userEmail = user != null ? user.getEmail() : "—";
    }
}
