package com.aillos.tftleadboard.MatchHistory;

public class Match {
    private String matchId;
    private String puuid;
    private String tactician;
    private int placement;
    private int level;
    private String traits;
    private String units;
    private String mode;
    //private String augments;
    private String date;

    public Match(String matchId, String puuid, String tactician, int placement, int level, String traits, String units, String mode, String date) {
        this.matchId = matchId;
        this.puuid = puuid;
        this.tactician = tactician;
        this.placement = placement;
        this.level = level;
        this.traits = traits;
        this.units=units;
        this.mode=mode;
        //this.augments=augments;
        this.date=date;
    }

    public Match() {

    }


    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public String getPuuid() {
        return puuid;
    }

    public void setPuuid(String puuid) {
        this.puuid = puuid;
    }

    public String getTactician() {
        return tactician;
    }

    public void setTactician(String tactician) {
        this.tactician = tactician;
    }

    public int getPlacement() {
        return placement;
    }

    public void setPlacement(int placement) {
        this.placement = placement;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getTraits() {
        return traits;
    }

    public void setTraits(String traits) {
        this.traits = traits;
    }

    public String getUnits() {
        return units;
    }

    public void setUnits(String units) {
        this.units = units;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    /*public String getAugments() {
        return augments;
    }

    public void setAugments(String augments) {
        this.augments = augments;
    }
    */
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
