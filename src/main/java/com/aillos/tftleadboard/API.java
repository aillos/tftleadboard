package com.aillos.tftleadboard;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class API {
    @Value("${RIOT_API_KEY}")
    private String riotApi;

    @GetMapping("/riot-api-key")
    public String getRiotApiKey() {
        return riotApi;
    }
}
