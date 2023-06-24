package com.aillos.tftleadboard.Matches;

public class Matches {
    private String matchIds;
    private String puuid;
    private String summonerName;

    public Matches(String matchIds, String puuid, String summonerName) {
        this.matchIds=matchIds;
        this.puuid=puuid;
        this.summonerName=summonerName;
    }

    public Matches() {

    }

    public String getPuuid() {
        return puuid;
    }

    public void setPuuid(String puuid) {
        this.puuid = puuid;
    }

    public String getMatchIds() {
        return matchIds;
    }

    public void setMatchIds(String matchIds) {
        this.matchIds = matchIds;
    }

    public String getSummonerName() {
        return summonerName;
    }

    public void setSummonerName(String summonerName) {
        this.summonerName = summonerName;
    }
}
