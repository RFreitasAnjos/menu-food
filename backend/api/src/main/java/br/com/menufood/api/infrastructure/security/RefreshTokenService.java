package br.com.menufood.api.infrastructure.security;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.menufood.api.adapters.out.persistence.RefreshTokenRepository;
import br.com.menufood.api.domain.entities.RefreshToken;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${security.jwt.refresh-expiration-days:7}")
    private int refreshExpirationDays;

    @Transactional
    public String create(UUID userId) {
        String tokenValue = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
            .token(tokenValue)
            .userId(userId)
            .expiresAt(LocalDateTime.now().plusDays(refreshExpirationDays))
            .revoked(false)
            .build();
        refreshTokenRepository.save(refreshToken);
        return tokenValue;
    }

    public RefreshToken validate(String token) {
        RefreshToken rt = refreshTokenRepository.findByToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Refresh token inválido"));
        if (rt.isRevoked() || rt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token expirado ou revogado");
        }
        return rt;
    }

    @Transactional
    public void revoke(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    @Transactional
    public void revokeAllForUser(UUID userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
}
