package com.aillos.tftleadboard.Time;

import com.aillos.tftleadboard.Matches.MatchesRepository;
import com.aillos.tftleadboard.Summoner.Summoner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
public class TimeController {

    @Autowired
    private TimeRepository repo;

    @GetMapping("/getTime")
    public Date getTime(String type) {
        return repo.getTime(type);
    }

}