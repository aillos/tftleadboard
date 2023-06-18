package com.aillos.tftleadboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class Controller {

    @Autowired
    private com.aillos.tftleadboard.AppRepository repo;

    @PostMapping("/save")
    public void saveSummoner(com.aillos.tftleadboard.Summoner Summoner) {
        repo.saveSummoner(Summoner);
    }

    @PostMapping("/update")
    public void updateSummoner(com.aillos.tftleadboard.Summoner Summoner) {
        repo.updateSummoner(Summoner);
    }

     @GetMapping("/test")
    public void test() {
        repo.test();
    }

    @GetMapping("/getAll")
    public List<com.aillos.tftleadboard.Summoner> getAll() {
        return repo.getAllSummoners();
    }

    @GetMapping("/deleteAll")
    public void deleteAll() {
        repo.deleteAllSummoner();
    }

}
