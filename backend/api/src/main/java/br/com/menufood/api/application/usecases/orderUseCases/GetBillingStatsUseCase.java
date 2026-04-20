package br.com.menufood.api.application.usecases.orderUseCases;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.OrderRepository;
import br.com.menufood.api.domain.entities.Order;
import br.com.menufood.api.domain.enums.OrderStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetBillingStatsUseCase {

    private static final Set<OrderStatus> REVENUE_STATUSES = Set.of(
            OrderStatus.PAID,
            OrderStatus.IN_PREPARATION,
            OrderStatus.SENT,
            OrderStatus.DELIVERED
    );

    private final OrderRepository orderRepository;

    public BillingStats execute() {
        List<Order> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();

        Map<OrderStatus, Long> countByStatus = new EnumMap<>(OrderStatus.class);
        for (OrderStatus status : OrderStatus.values()) {
            countByStatus.put(status, 0L);
        }

        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal revenueToday = BigDecimal.ZERO;
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.now();

        // Dados mensais e diários
        BigDecimal monthlyRevenue = BigDecimal.ZERO;
        long monthlyOrderCount = 0;

        // Inicializa todos os dias do mês atual até hoje
        Map<LocalDate, BigDecimal> dailyMap = new LinkedHashMap<>();
        for (LocalDate d = currentMonth.atDay(1); !d.isAfter(today); d = d.plusDays(1)) {
            dailyMap.put(d, BigDecimal.ZERO);
        }

        for (Order order : allOrders) {
            countByStatus.merge(order.getStatus(), 1L, Long::sum);

            if (REVENUE_STATUSES.contains(order.getStatus()) && order.getTotalPrice() != null) {
                totalRevenue = totalRevenue.add(order.getTotalPrice());

                if (order.getCreatedAt() != null) {
                    LocalDate orderDate = order.getCreatedAt().toLocalDate();

                    if (orderDate.equals(today)) {
                        revenueToday = revenueToday.add(order.getTotalPrice());
                    }

                    if (YearMonth.from(orderDate).equals(currentMonth)) {
                        monthlyRevenue = monthlyRevenue.add(order.getTotalPrice());
                        monthlyOrderCount++;
                        dailyMap.merge(orderDate, order.getTotalPrice(), BigDecimal::add);
                    }
                }
            }
        }

        BigDecimal averageTicket = monthlyOrderCount > 0
                ? monthlyRevenue.divide(BigDecimal.valueOf(monthlyOrderCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM");
        List<String> dailyLabels = dailyMap.keySet().stream()
                .map(d -> d.format(fmt))
                .toList();
        List<Double> dailyData = dailyMap.values().stream()
                .map(BigDecimal::doubleValue)
                .toList();

        return new BillingStats(allOrders.size(), countByStatus, totalRevenue, revenueToday,
                monthlyRevenue, monthlyOrderCount, averageTicket, dailyLabels, dailyData);
    }

    @Getter
    public static class BillingStats {
        private final long totalOrders;
        private final Map<OrderStatus, Long> countByStatus;
        private final BigDecimal totalRevenue;
        private final BigDecimal revenueToday;
        private final BigDecimal monthlyRevenue;
        private final long monthlyOrderCount;
        private final BigDecimal averageTicket;
        private final List<String> dailyLabels;
        private final List<Double> dailyData;

        public BillingStats(long totalOrders, Map<OrderStatus, Long> countByStatus,
                            BigDecimal totalRevenue, BigDecimal revenueToday,
                            BigDecimal monthlyRevenue, long monthlyOrderCount,
                            BigDecimal averageTicket, List<String> dailyLabels,
                            List<Double> dailyData) {
            this.totalOrders = totalOrders;
            this.countByStatus = countByStatus;
            this.totalRevenue = totalRevenue;
            this.revenueToday = revenueToday;
            this.monthlyRevenue = monthlyRevenue;
            this.monthlyOrderCount = monthlyOrderCount;
            this.averageTicket = averageTicket;
            this.dailyLabels = dailyLabels;
            this.dailyData = dailyData;
        }
    }
}

