package br.com.menufood.api.application.dto.address;

import java.util.UUID;

import br.com.menufood.api.domain.entities.UserAddress;
import lombok.Getter;

@Getter
public class AddressResponse {
    private final UUID id;
    private final String label;
    private final String street;
    private final String number;
    private final String neighborhood;
    private final String city;
    private final String state;
    private final String zipCode;
    private final boolean isDefault;

    public AddressResponse(UserAddress address) {
        this.id = address.getId();
        this.label = address.getLabel();
        this.street = address.getStreet();
        this.number = address.getNumber();
        this.neighborhood = address.getNeighborhood();
        this.city = address.getCity();
        this.state = address.getState();
        this.zipCode = address.getZipCode();
        this.isDefault = address.isDefault();
    }
}
