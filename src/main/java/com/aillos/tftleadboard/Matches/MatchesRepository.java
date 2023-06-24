package com.aillos.tftleadboard.Matches;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MatchesRepository {
    @Autowired
    private JdbcTemplate db;

    private Logger logger = LoggerFactory.getLogger(MatchesRepository.class);

    public boolean saveMatches(Matches Matches) {
        String sql = "INSERT INTO Matches (matchIds) VALUES (?) WHERE puuid=?";
        try {
            db.update(sql, Matches.getMatchIds(), Matches.getPuuid());
            return true;
        } catch (Exception e) {
            logger.error("Feil i lagre summoner " + e);
            return false;
        }

    }

    public boolean updateMatches(Matches Matches) {
        String sql = "UPDATE Matches SET matchIds=? WHERE puuid=?";
        try {
            db.update(sql, Matches.getMatchIds(), Matches.getPuuid());
            return true;
        } catch (Exception e) {
            logger.error("Feil i lagre summoner " + e);
            return false;
        }

    }
}
