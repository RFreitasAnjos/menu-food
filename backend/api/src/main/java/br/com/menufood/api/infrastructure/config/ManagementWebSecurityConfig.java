package br.com.menufood.api.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class ManagementWebSecurityConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain managementFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/management/**")
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/management/login").permitAll()
                .requestMatchers("/management/**").hasRole("ADMIN")
            )
            .formLogin(form -> form
                .loginPage("/management/login")
                .loginProcessingUrl("/management/login")
                .defaultSuccessUrl("/management/dashboard", true)
                .failureUrl("/management/login?error=true")
                .usernameParameter("email")
                .passwordParameter("password")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/management/logout"))
                .logoutSuccessUrl("/management/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/management/orders/*/status")
                .ignoringRequestMatchers("/management/products/*/delete")
                .ignoringRequestMatchers("/management/api/upload-image")
            );
        return http.build();
    }
}
