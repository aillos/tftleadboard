package com.aillos.tftleadboard;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AppRepository {
    @Autowired
    private JdbcTemplate db;

    private Logger logger = LoggerFactory.getLogger(AppRepository.class);

    public boolean saveSummoner(Summoner Summoner){
        String sql = "INSERT INTO Summoner (summonerName, rank, tier, lp, summonerIcon, summonerId, wins, losses) VALUES (?,?,?,?,?,?,?,?)";
        try{
            db.update(sql,Summoner.getSummonerName(),Summoner.getRank(),Summoner.getTier(),Summoner.getLp(),Summoner.getSummonerIcon(), Summoner.getSummonerId(), Summoner.getWins(), Summoner.getLosses());
            return true;
        }
        catch(Exception e){
            logger.error("Feil i lagre summoner "+e);
            return false;
        }

    }
    public boolean updateSummoner(Summoner summoner) {
        String sql = "UPDATE Summoner SET summonerName=?, rank=?, tier=?, lp=?, summonerIcon=?, wins=?, losses=? WHERE summonerId=?";
        try {
            db.update(sql, summoner.getSummonerName(), summoner.getRank(), summoner.getTier(), summoner.getLp(), summoner.getSummonerIcon(), summoner.getWins(), summoner.getLosses(), summoner.getSummonerId());
            return true;
        } catch (Exception e) {
            logger.error("Feil i lagre summoner " + e);
            return false;
        }
    }

    public List<Summoner> getAllSummoners(){
        String sql = "SELECT * FROM Summoner ORDER BY dbo.rankToInt(CONCAT(rank, tier, lp)) DESC";

        try{
            return db.query(sql,new BeanPropertyRowMapper<>(Summoner.class));

        }
        catch(Exception e){
            logger.error("Feil i hent alle summoners "+e);
            return null;
        }
    }
    public void deleteAllSummoner (){
        String sql = "DELETE FROM Summoner";
        db.update(sql);
    }
}
