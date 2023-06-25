package com.aillos.tftleadboard.Matches;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MatchesController {

    @Autowired
    private MatchesRepository repo;

    @PostMapping("/saveMatches")
    public void saveMatches(Matches Matches) {
        repo.saveMatches(Matches);
    }

    @PostMapping("/updateMatches")
    public void updateMatches(Matches Matches) {
        repo.updateMatches(Matches);
    }

    @GetMapping("/getMatchIds")
    public String getMatchIds(String summonerName) {
        return repo.getMatchIds(summonerName);
    }

}
