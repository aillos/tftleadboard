package com.aillos.tftleadboard.Summoner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SummonerController {

    @Autowired
    private SummonerRepository repo;

    @PostMapping("/save")
    public void saveSummoner(Summoner Summoner) {
        repo.saveSummoner(Summoner);
    }

    @PostMapping("/update")
    public void updateSummoner(Summoner Summoner) {
        repo.updateSummoner(Summoner);
    }

    @GetMapping("/getAll")
    public List<Summoner> getAll() {
        return repo.getAllSummoners();
    }

    @GetMapping("/deleteAll")
    public void deleteAll() {
        repo.deleteAllSummoner();
    }

    @GetMapping("/getAllSummonerIds")
    public List<String> getAllSummonerIds() {
        return repo.getAllSummonerIds();
    }

    @GetMapping("/getPuuid")
    public String getPuuid(String summonerName) {
        return repo.getPuuid(summonerName);
    }

}
