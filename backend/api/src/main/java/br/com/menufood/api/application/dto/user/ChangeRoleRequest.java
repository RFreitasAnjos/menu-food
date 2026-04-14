package br.com.menufood.api.application.dto.user;

import br.com.menufood.api.domain.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChangeRoleRequest {
    private UserRole role;
}
