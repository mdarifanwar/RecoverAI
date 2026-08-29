package com.revenuerecovery.config;

import com.revenuerecovery.entity.User;
import com.revenuerecovery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${admin.email:admin@revenuerecovery.com}")
    private String adminEmail;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User(
                        adminEmail,
                        passwordEncoder.encode(adminPassword),
                        "ADMIN"
                );
                userRepository.save(admin);
                System.out.println(">>> Initialized default admin user: " + adminEmail);
            }
        };
    }
}
