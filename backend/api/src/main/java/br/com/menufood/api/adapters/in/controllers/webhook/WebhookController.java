package br.com.menufood.api.adapters.in.controllers.webhook;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/webhooks/infinitepay")
public class WebhookController {
   @PostMapping
   public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> payload) {
      
      String status = (String) payload.get("status");
      String paymnetId = (String) payload.get("paymentId");

      if(status.equals("Paid")){
         // Lógica para atualizar o status do pedido para "Pago"
         System.out.println("Pagamento " + paymnetId + " foi pago.");
      } else if (status.equals("Failed")) {
         // Lógica para atualizar o status do pedido para "Falhou"
         System.out.println("Pagamento " + paymnetId + " falhou.");
      }
      return ResponseEntity.ok().build();
   }
}
