package br.com.menufood.api.application.dto.address;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateAddressRequest {
   private String label;
   private String street;
   private String number;
   private String city;
   private String neighborhood;
   private String state;
   private String zipCode;
}
