package com.codeverge.talentportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.codeverge.talentportal")
@EnableJpaRepositories(basePackages = "com.codeverge.talentportal.repository")
@EntityScan(basePackages = "com.codeverge.talentportal.entity")
public class TalentPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(TalentPortalApplication.class, args);
    }

}
