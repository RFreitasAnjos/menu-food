package br.com.menufood.api.application.usecases.userUseCases;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.menufood.api.adapters.out.persistence.UserAddressRepository;
import br.com.menufood.api.domain.entities.UserAddress;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListUserAddressesUseCase {

    private final UserAddressRepository userAddressRepository;

    public List<UserAddress> execute(UUID userId) {
        return userAddressRepository.findByUserId(userId);
    }
}
