package com.aillos.tftleadboard.Time;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class TimeRepository {
    @Autowired
    private JdbcTemplate db;

    private Logger logger = LoggerFactory.getLogger(com.aillos.tftleadboard.Matches.MatchesRepository.class);

    public Date getTime(String type) {
        String sql = "SELECT Time FROM Info WHERE Type=?";
        try {
            return db.queryForObject(sql, Date.class, type);
        } catch (Exception e) {
            logger.error("Feil i hent time " + e);
            return null;
        }
    }
}