package br.com.menufood.api.application.usecases.orderUseCases;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import br.com.menufood.api.adapters.out.persistence.OrderRepository;
import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.domain.enums.OrderStatus;
import lombok.RequiredArgsConstructor;

/**
 * Cancela automaticamente pedidos que ficaram em WAITING_PAYMENT por mais de
 * {@code order.payment-timeout-minutes} minutos (padrão: 15).
 *
 * Roda a cada minuto — leve, pois usa índice em status + createdAt.
 */
@Component
@RequiredArgsConstructor
public class CancelExpiredOrdersScheduler {

    private static final Logger log = LoggerFactory.getLogger(CancelExpiredOrdersScheduler.class);

    private final OrderRepository orderRepository;

    @Value("${order.payment-timeout-minutes:15}")
    private long paymentTimeoutMinutes;

    @Scheduled(fixedDelay = 60_000) // executa 60 s após o término da rodada anterior
    public void cancelExpiredOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(paymentTimeoutMinutes);

        List<Order> expired = orderRepository.findByStatusAndCreatedAtBefore(
                OrderStatus.WAITING_PAYMENT, cutoff);

        if (expired.isEmpty()) return;

        log.info("Cancelando {} pedido(s) expirado(s) (timeout={}min)", expired.size(), paymentTimeoutMinutes);

        expired.forEach(order -> {
            order.setStatus(OrderStatus.CANCELED);
            log.debug("Pedido {} cancelado por timeout de pagamento", order.getId());
        });

        orderRepository.saveAll(expired);
    }
}
