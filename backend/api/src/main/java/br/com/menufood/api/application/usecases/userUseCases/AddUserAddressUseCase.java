package br.com.menufood.api.application.usecases.userUseCases;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.UserAddressRepository;
import br.com.menufood.api.adapters.out.persistence.UserRepository;
import br.com.menufood.api.application.dto.address.CreateAddressRequest;
import br.com.menufood.api.domain.entities.User;
import br.com.menufood.api.domain.entities.UserAddress;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddUserAddressUseCase {

    private final UserAddressRepository userAddressRepository;
    private final UserRepository userRepository;

    public UserAddress execute(UUID userId, CreateAddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + userId));

        UserAddress address = UserAddress.builder()
                .user(user)
                .label(request.getLabel())
                .street(request.getStreet())
                .number(request.getNumber())
                .neighborhood(request.getNeighborhood())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .isDefault(false)
                .build();

        return userAddressRepository.save(address);
    }
}
