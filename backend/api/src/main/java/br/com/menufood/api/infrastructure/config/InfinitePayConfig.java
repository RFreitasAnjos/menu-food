package br.com.menufood.api.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

@Configuration
public class InfinitePayConfig {

   @Value("${infinitepay.api.key}")
   private String apiKey;
   @Value("${infinitepay.api.base-url}")
   private String baseUrl;

   @Bean
   public WebClient infinitePayClient() {
      return WebClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader("Authorization", "Bearer " + apiKey)
            .defaultHeader("Content-Type", "application/json")
            .build();
   }

}
