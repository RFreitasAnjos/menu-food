package br.com.menufood.api.adapters.in.controllers.paymentcontroller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cloudinary.http45.api.Response;

import br.com.menufood.api.application.dto.payment.CreateCheckoutRequest;
import br.com.menufood.api.application.usecases.paymentUseCase.InfinitePayService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/payments")
public class PaymentController {
   private final InfinitePayService infinitePayService;

   public PaymentController(InfinitePayService infinitePayService) {
      this.infinitePayService = infinitePayService;
   }

   @PostMapping("/checkout")
   public ResponseEntity<?> createCheckout(@RequestBody CreateCheckoutRequest request){
      String checkoutUrl = infinitePayService.createCheckout(request);
      return ResponseEntity.ok(Map.of("checkoutUrl", checkoutUrl));
   }
}
