package com.revenuerecovery.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:jdbc:h2:mem:recover_ai;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE}")
    private String rawUrl;

    @Value("${spring.datasource.username:sa}")
    private String rawUsername;

    @Value("${spring.datasource.password:}")
    private String rawPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String finalUrl = rawUrl != null ? rawUrl.trim() : "";
        String finalUsername = rawUsername;
        String finalPassword = rawPassword;
        String driverClass = "org.postgresql.Driver";

        if (finalUrl.startsWith("postgresql://") || finalUrl.startsWith("jdbc:postgresql://")) {
            driverClass = "org.postgresql.Driver";

            // Clean up prefix for URI parsing if user included credentials in URL
            String cleanUriStr = finalUrl;
            if (cleanUriStr.startsWith("jdbc:")) {
                cleanUriStr = cleanUriStr.substring(5);
            }

            try {
                URI uri = new URI(cleanUriStr);
                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    if (userInfo.length > 0 && !userInfo[0].isEmpty()) {
                        finalUsername = userInfo[0];
                    }
                    if (userInfo.length > 1 && !userInfo[1].isEmpty()) {
                        finalPassword = userInfo[1];
                    }
                    // Reconstruct JDBC URL without user credentials in host position to fix PostgreSQL driver invalid port error
                    String query = uri.getQuery() != null ? "?" + uri.getQuery() : "";
                    String path = uri.getPath() != null ? uri.getPath() : "";
                    int port = uri.getPort();
                    String hostPort = uri.getHost() + (port != -1 ? ":" + port : "");

                    finalUrl = "jdbc:postgresql://" + hostPort + path + query;
                } else if (!finalUrl.startsWith("jdbc:")) {
                    finalUrl = "jdbc:" + finalUrl;
                }
            } catch (Exception e) {
                System.err.println(">>> Notice: URI parsing fallback: " + e.getMessage());
                if (!finalUrl.startsWith("jdbc:")) {
                    finalUrl = "jdbc:" + finalUrl;
                }
            }
        } else if (finalUrl.startsWith("jdbc:h2:") || finalUrl.isEmpty()) {
            finalUrl = "jdbc:h2:mem:recover_ai;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";
            driverClass = "org.h2.Driver";
            finalUsername = "sa";
            finalPassword = "";
        }

        System.out.println(">>> RecoverAI Database Configured Cleanly: URL=" + finalUrl + ", User=" + finalUsername);

        try {
            return DataSourceBuilder.create()
                    .url(finalUrl)
                    .username(finalUsername)
                    .password(finalPassword)
                    .driverClassName(driverClass)
                    .build();
        } catch (Exception e) {
            System.err.println(">>> Database Connection Error, falling back to H2 In-Memory DB: " + e.getMessage());
            return DataSourceBuilder.create()
                    .url("jdbc:h2:mem:recover_ai;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE")
                    .username("sa")
                    .password("")
                    .driverClassName("org.h2.Driver")
                    .build();
        }
    }
}
