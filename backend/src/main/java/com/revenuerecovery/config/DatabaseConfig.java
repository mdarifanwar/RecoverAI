package com.revenuerecovery.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:jdbc:h2:mem:recover_ai;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE}")
    private String rawUrl;

    @Value("${spring.datasource.username:sa}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String finalUrl = rawUrl;
        String driverClass = "org.postgresql.Driver";

        if (finalUrl != null && !finalUrl.trim().isEmpty()) {
            finalUrl = finalUrl.trim();
            if (finalUrl.startsWith("postgresql://")) {
                finalUrl = "jdbc:" + finalUrl;
            }

            if (finalUrl.startsWith("jdbc:postgresql://")) {
                driverClass = "org.postgresql.Driver";
            } else if (finalUrl.startsWith("jdbc:h2:")) {
                driverClass = "org.h2.Driver";
            }
        } else {
            finalUrl = "jdbc:h2:mem:recover_ai;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";
            driverClass = "org.h2.Driver";
        }

        System.out.println(">>> RecoverAI Database Configurer: Initializing DataSource with URL " + finalUrl.replaceAll(":[^/@]+@", ":****@"));

        return DataSourceBuilder.create()
                .url(finalUrl)
                .username(username)
                .password(password)
                .driverClassName(driverClass)
                .build();
    }
}
