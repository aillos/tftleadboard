$(function() {
    test();
    fetchAPI();
    getMatchIds(data);
    getPuuid(data);
});

const queryParams = new URLSearchParams(window.location.search);
const data = queryParams.get('data');
let matchIds;
let puuid;
let riotApiKey = "";

function fetchDataFromRiotAPI(endpoint) {
    const url = `${endpoint}api_key=${riotApiKey}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchAPI (){
    fetch('/api/riot-key')
        .then(response => response.text())
        .then(apiKey => {
            riotApiKey = apiKey;
        })
        .catch(error => {
            console.error('Error retrieving Riot API key:', error);
        });
}

function getMatchIds(summonerName){
    $.get("/getMatchIds", { summonerName: summonerName }, function (data) {
        matchIds = data.split(",");
    })
}

console.log(data); // Output: example_data

function test() {
    document.getElementById("test").textContent = data;
}
/*
let matchIds = null;
let isMatchIdsLoaded = false;

function getMatchIds(summonerName) {
    if (matchIds !== null && isMatchIdsLoaded) {
        createDivs(matchIds);
        return;
    }

    const cachedMatchIds = localStorage.getItem('matchIds');
    if (cachedMatchIds) {
        matchIds = JSON.parse(cachedMatchIds);
        isMatchIdsLoaded = true;
        return;
    }

    $.get("/getMatchIds", { summonerName: summonerName }, function (data) {
        matchIds = data;
        isMatchIdsLoaded = true;
        localStorage.setItem('matchIds', JSON.stringify(matchIds));
    });
}
*/


function getPuuid(summonerName) {
    $.get("/getPuuid", {summonerName: summonerName}, function (data) {
        puuid = data;
    })
}


function addMatch() {
    $.get("/deleteAllMatches", { puuid: puuid }, function() {
        console.log("Successfully deleted matches");
    });

    matchIds.forEach(matchId => {
        const endpoint = `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?`;
        const targetPuuid = puuid;
        fetchDataFromRiotAPI(endpoint)
            .then(data => {
                const playerData = data.info.participants.find(participant => participant.puuid === targetPuuid);

                const match = {
                    matchId: matchId,
                    puuid: puuid,
                    tactician: JSON.stringify(playerData.companion),
                    placement: playerData.placement,
                    level: playerData.level,
                    traits: JSON.stringify(playerData.traits),
                    units: JSON.stringify(playerData.units),
                    mode: data.info.queue_id,
                    augments: JSON.stringify(playerData.augments)
                };

                $.ajax({
                    url: "/saveMatch",
                    type: "POST",
                    data: JSON.stringify(match),
                    contentType: "application/json",
                    success: function() {
                        console.log("Saved");
                    }
                });

            })
            .catch(error => {
                console.log('Error:', error);
            });
    })
}



function formaterData(MatchHistory) {
    let ut = "<table class='table table-striped'><tr><th>Film</th><th>Antall</th><th>Fornavn</th>" +
        "<th>Etternavn</th><th>Telefonnr</th><th>Epost</th><th></th><th></th></tr>";
    for (const bil of Billetter) {
        ut += "<tr><td>" + bil.film + "</td><td>" + bil.antall + "</td><td>" + bil.fornavn + "</td>" +
            "<td>" + bil.etternavn + "</td><td>" + bil.telefonnr + "</td><td>" + bil.epost + "</td></tr>";
    }
    ut += "</table>";
    $("#bil").html(ut);
}