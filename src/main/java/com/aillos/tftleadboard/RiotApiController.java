package com.aillos.tftleadboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/riot-api-key")
public class RiotApiController {

    private final RiotApiConfig riotApiConfig;

    @Autowired
    public RiotApiController(RiotApiConfig riotApiConfig) {
        this.riotApiConfig = riotApiConfig;
    }

    @GetMapping
    public String getRiotApiKey() {
        return riotApiConfig.getRiotApiKey();
    }
}