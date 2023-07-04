package com.aillos.tftleadboard.MatchHistory;

import com.aillos.tftleadboard.Summoner.Summoner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MatchRepository {
    @Autowired
    private JdbcTemplate db;

    private Logger logger = LoggerFactory.getLogger(MatchRepository.class);

    public boolean saveMatch(Match match) {
        String sql = "INSERT INTO MatchHistories (matchId, puuid, tactician, units, traits, placement, level, mode, augments, date) VALUES (?,?,?,?,?,?,?,?,?,?)";
        try {
            db.update(sql, match.getMatchId(), match.getPuuid(), match.getTactician(), match.getUnits(), match.getTraits(), match.getPlacement(), match.getLevel(), match.getMode(), match.getAugments(), match.getDate());
            return true;
        } catch (Exception e) {
            logger.error("Feil i lagre summoner " + e);
            return false;
        }
    }


    public void deleteAllMatches(String puuid) {
        String sql = "DELETE FROM MatchHistories WHERE puuid=?";
        db.update(sql, puuid); // Add the puuid parameter to the method call
    }


    public boolean updateMatch(Match match) {
        String sql = "UPDATE MatchHistories SET matchId=?, mode=?, tactician=?, units=?, traits=?, placement=?, level=?, date=? WHERE puuid=?";
        try {
            db.update(sql, match.getMatchId(), match.getPuuid(), match.getTactician(), match.getUnits(), match.getTraits(), match.getPlacement(), match.getLevel(), match.getMode(), match.getAugments(), match.getDate());
            return true;
        } catch (Exception e) {
            logger.error("Feil i lagre summoner " + e);
            return false;
        }
    }

    public List<Match> getAllMatches(String puuid){
        String sql = "SELECT * FROM MatchHistories WHERE puuid=? ORDER BY matchId DESC";

        try{
            return db.query(sql,new BeanPropertyRowMapper<>(Match.class), puuid);

        }
        catch(Exception e){
            logger.error("Feil i hent alle matches "+e);
            return null;
        }
    }

}
