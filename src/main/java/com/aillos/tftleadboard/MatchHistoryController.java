package com.aillos.tftleadboard;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class MatchHistoryController {

    @GetMapping("/matchhistory")
    public ResponseEntity<byte[]> showMatchHistory() throws IOException {
        ClassPathResource htmlResource = new ClassPathResource("static/matchhistory.html");
        byte[] htmlBytes = StreamUtils.copyToByteArray(htmlResource.getInputStream());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_HTML);
        return new ResponseEntity<>(htmlBytes, headers, HttpStatus.OK);
    }

}
