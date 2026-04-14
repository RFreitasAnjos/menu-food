package br.com.menufood.api.adapters.in.controllers.authcontroller;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.menufood.api.adapters.out.persistence.UserRepository;
import br.com.menufood.api.application.dto.auth.AuthResponse;
import br.com.menufood.api.application.dto.auth.LoginRequest;
import br.com.menufood.api.domain.entities.RefreshToken;
import br.com.menufood.api.domain.entities.User;
import br.com.menufood.api.domain.enums.UserRole;
import br.com.menufood.api.infrastructure.security.JwtService;
import br.com.menufood.api.infrastructure.security.RefreshTokenService;
import br.com.menufood.api.infrastructure.security.UserDetailsServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Tag(name = "Auth")
@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;

    @Value("${security.jwt.expiration-ms}")
    private long accessExpirationMs;

    @Value("${security.jwt.refresh-expiration-days:7}")
    private int refreshExpirationDays;

    /** Login para clientes (role CLIENT). */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return doLogin(request, UserRole.CLIENT);
    }

    /** Login exclusivo para administradores (role ADMIN). */
    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(@RequestBody LoginRequest request) {
        return doLogin(request, UserRole.ADMIN);
    }

    /** Emite novo access token usando o refresh token no cookie. */
    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(HttpServletRequest httpRequest) {
        String refreshTokenValue = extractCookieValue(httpRequest, "refresh_token");
        if (refreshTokenValue == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            RefreshToken rt = refreshTokenService.validate(refreshTokenValue);
            User user = userRepository.findById(rt.getUserId())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String newAccessToken = jwtService.generateToken(userDetails);
            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildAccessCookie(newAccessToken).toString())
                .build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /** Encerra a sessão: revoga o refresh token e limpa os cookies. */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        String refreshTokenValue = extractCookieValue(httpRequest, "refresh_token");
        if (refreshTokenValue != null) {
            refreshTokenService.revoke(refreshTokenValue);
        }
        ResponseCookie clearAccess = ResponseCookie.from("access_token", "")
            .httpOnly(true).path("/").maxAge(0).sameSite("Lax").build();
        ResponseCookie clearRefresh = ResponseCookie.from("refresh_token", "")
            .httpOnly(true).path("/api/v1/auth").maxAge(0).sameSite("Lax").build();
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, clearAccess.toString())
            .header(HttpHeaders.SET_COOKIE, clearRefresh.toString())
            .build();
    }

    // ──────────────────────────────────────────────
    //  Helpers
    // ──────────────────────────────────────────────

    private ResponseEntity<AuthResponse> doLogin(LoginRequest request, UserRole expectedRole) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

        if (user.getRole() != expectedRole) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = refreshTokenService.create(user.getId());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, buildAccessCookie(accessToken).toString())
            .header(HttpHeaders.SET_COOKIE, buildRefreshCookie(refreshToken).toString())
            .body(new AuthResponse(user.getId().toString(), user.getName(), user.getRole().name()));
    }

    private ResponseCookie buildAccessCookie(String token) {
        return ResponseCookie.from("access_token", token)
            .httpOnly(true)
            .secure(false) // TODO: definir como true em produção (HTTPS)
            .path("/")
            .maxAge(Duration.ofMillis(accessExpirationMs))
            .sameSite("Lax")
            .build();
    }

    private ResponseCookie buildRefreshCookie(String token) {
        return ResponseCookie.from("refresh_token", token)
            .httpOnly(true)
            .secure(false) // TODO: definir como true em produção (HTTPS)
            .path("/api/v1/auth")
            .maxAge(Duration.ofDays(refreshExpirationDays))
            .sameSite("Lax")
            .build();
    }

    private String extractCookieValue(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
