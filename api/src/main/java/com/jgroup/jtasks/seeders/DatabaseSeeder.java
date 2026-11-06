package com.jgroup.jtasks.seeders;

import com.jgroup.jtasks.authorization.privileges.Privilege;
import com.jgroup.jtasks.authorization.privileges.PrivilegeRepository;
import com.jgroup.jtasks.authorization.privileges.Privileges;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Slf4j
@Configuration
public class DatabaseSeeder {
    @Bean
    CommandLineRunner seedDatabase(PrivilegeRepository privilegeRepository) {
        return _ -> {
            log.info("Seeding privileges");
            for (Privileges privilege : Privileges.values()) {
                if (!privilegeRepository.existsByName(privilege)) {
                    Privilege obj = new Privilege(privilege);
                    privilegeRepository.save(obj);
                }
            }
            log.info("Done seeding privileges");
        };
    }
}
