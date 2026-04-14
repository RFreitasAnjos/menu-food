package br.com.menufood.api.application.usecases.userUseCases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.UserAddressRepository;
import br.com.menufood.api.domain.entities.UserAddress;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteUserAddressUseCase {

    private final UserAddressRepository userAddressRepository;

    public void execute(UUID userId, UUID addressId) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Endereço não pertence ao usuário informado");
        }

        userAddressRepository.deleteById(addressId);
    }
}
