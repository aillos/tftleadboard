package com.aillos.tftleadboard.MatchHistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MatchController {

    @Autowired
    private MatchRepository repo;

    @PostMapping("/saveMatch")
    public void saveMatch(@RequestBody Match match) {
        repo.saveMatch(match);
    }


    @PostMapping("/updateMatch")
    public void updateMatch(Match Match) {
        repo.updateMatch(Match);
    }

    @GetMapping("/deleteAllMatches")
    public void deleteAllMatches(String puuid) {
        repo.deleteAllMatches(puuid);
    }

}
