package br.com.menufood.api.application.usecases.paymentUseCase;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;

import br.com.menufood.api.application.dto.payment.CreateCheckoutRequest;

@Service
public class InfinitePayService {
   private final WebClient webClient;
   
   public InfinitePayService(WebClient webClient) {
      this.webClient = webClient;
   }

   public String createCheckout(CreateCheckoutRequest request) {
      Map<String, Object> requestBody = Map.of(
            "amount", request.amount(),
            "currency", request.currency(),
            "description", request.description(),
            "returnUrl", request.returnUrl()
      );

      return webClient.post()
            .uri("/checkout")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(JsonNode.class)
            .map(json -> json.get("checkoutUrl").asText())
            .block();
   }
}
