package com.callpilotai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CallPilotAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CallPilotAiApplication.class, args);
    }
}

