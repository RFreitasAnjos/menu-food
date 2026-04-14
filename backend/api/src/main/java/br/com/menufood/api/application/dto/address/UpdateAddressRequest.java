package br.com.menufood.api.application.dto.address;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateAddressRequest {
    private String label;
    private String street;
    private String number;
    private String neighborhood;
    private String city;
    private String state;
    private String zipCode;
}
