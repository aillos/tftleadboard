package com.aillos.tftleadboard.Matches;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;

import java.io.IOException;

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

    @GetMapping("/matchhistory")
    public ResponseEntity<byte[]> showMatchHistory() throws IOException {
        ClassPathResource htmlResource = new ClassPathResource("static/matchhistory.html");
        byte[] htmlBytes = StreamUtils.copyToByteArray(htmlResource.getInputStream());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_HTML);
        return new ResponseEntity<>(htmlBytes, headers, HttpStatus.OK);
    }

}
