package com.jgroup.jtasks.seeders;

import com.jgroup.jtasks.roles.Role;
import com.jgroup.jtasks.roles.RoleRepository;
import com.jgroup.jtasks.roles.Roles;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseSeeder {
    @Bean
    CommandLineRunner seedDatabase(RoleRepository roleRepository) {
        return _ -> {
            for (Roles role : Roles.values()) {
                if (!roleRepository.existsByName(role)) {
                    Role obj = new Role(role);
                    roleRepository.save(obj);
                }
            }
        };
    }
}
