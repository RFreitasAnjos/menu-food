package br.com.menufood.api.application.dto.payment;

public record CreateCheckoutRequest(
   int amount,
   String currency,
   String description,
   String returnUrl
) {}
