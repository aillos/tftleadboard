
$(function(){
    getAllSummonerIds();
    getAll();
    fetchAPI();
});

let riotApiKey = "";


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

let summonerIds = null;
let isSummonerIdsLoaded = false;

function getAllSummonerIds() {
    if (summonerIds !== null && isSummonerIdsLoaded) {
        createDivs(summonerIds);
        return;
    }

    const cachedSummonerIds = localStorage.getItem('summonerIds');
    if (cachedSummonerIds) {
        summonerIds = JSON.parse(cachedSummonerIds);
        isSummonerIdsLoaded = true;
        createDivs(summonerIds);
        return;
    }

    $.get("/getAllSummonerIds", function(data) {
        summonerIds = data;
        isSummonerIdsLoaded = true;
        localStorage.setItem('summonerIds', JSON.stringify(summonerIds));
        createDivs(summonerIds);
    });
}


function createDivs(summonerIds) {
    summonerIds.forEach((summonerId, index) => {
        const player = document.createElement('div');
        player.setAttribute("class", "player");
        player.setAttribute("onclick", "handleClick('summoner"+(index+1)+"')");
        player.classList.add('player');
        if ((index+1) % 2 === 0) {
            player.classList.add('even');
        } else {
            player.classList.add('odd');
        }
        const playerInfo = document.createElement('div');
        playerInfo.setAttribute("class", "player-info");
        const summonerName = document.createElement('h2');
        summonerName.setAttribute("id", "summoner"+(index+1));
        const summonerIcon = document.createElement('img');
        summonerIcon.setAttribute("class", "summoner-icon");
        summonerIcon.setAttribute("id", "summonerIcon"+(index+1));
        const games = document.createElement('p');
        games.setAttribute("id","games"+(index+1));
        const wins = document.createElement('p');
        wins.setAttribute("id","wins"+(index+1));
        const losses = document.createElement('p');
        losses.setAttribute("id","losses"+(index+1));
        const wr = document.createElement('p');
        wr.setAttribute("id","wr"+(index+1));
        const rank = document.createElement('p');
        rank.style.display = 'inline-block';
        rank.style.marginRight = '-10px';
        rank.textContent="Rank: "
        const pRank = document.createElement('p');
        pRank.setAttribute("id","rank"+(index+1));
        pRank.setAttribute("class", "rank");
        pRank.style.display='inline-block';

        playerInfo.appendChild(summonerName);
        playerInfo.appendChild(summonerIcon);
        playerInfo.appendChild(games);
        playerInfo.appendChild(wins);
        playerInfo.appendChild(losses);
        playerInfo.appendChild(wr);
        playerInfo.appendChild(rank);
        playerInfo.appendChild(pRank);
        player.appendChild(playerInfo);

        document.getElementById('main').appendChild(player);
    });
}

function handleClick(elementId) {
    const summonerNameElement = document.getElementById(elementId);
    const clickedValue = summonerNameElement.textContent;
    const result = clickedValue.substr(clickedValue.indexOf('.') + 2);
    window.location.href = 'matchhistory.html';
    insertMatch(result);
}


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


function insertMatch(clickedValue){
    const summonerName=clickedValue;
    $.get("/getPuuid", { summonerName: summonerName }, function (data) {
        const puuid = data;
        const endpoint = `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=20&`;
        fetchDataFromRiotAPI(endpoint)
            .then(data => {
                if (data.length > 0) {
                    const matchIds = data;
                    const Matches = {
                        matchIds: matchIds,
                        puuid: puuid,
                    };
                    $.post("/updateMatches", Matches, function () {
                        console.log(`Updated matches for summoner ${clickedValue}`);

                    });
                }
            })
    })

}

function addExistingSummoners() {
    summonerIds.forEach(summonerId => {
        const endpoint = `https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}?`;
        fetchDataFromRiotAPI(endpoint)
            .then(data => {
                if (data.length > 0) {
                    const leagueEntry = data[0];
                    const { leaguePoints, tier, losses, rank, summonerName, wins } = leagueEntry;

                    const storedLeaguePoints = leaguePoints;
                    const storedLosses = losses;
                    const storedRank = rank;
                    const storedSummonerName = summonerName;
                    const storedWins = wins;
                    const storedTier = tier;


                    const endpoint2 = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${summonerId}?`;
                    fetchDataFromRiotAPI(endpoint2)
                        .then(data => {
                            if (data) {
                                const { id, profileIconId } = data;
                                const storedSummonerId = id;
                                const storedSummonerIcon = profileIconId;

                                const Summoner = {
                                    summonerName: storedSummonerName,
                                    rank: storedRank,
                                    tier: storedTier,
                                    lp: storedLeaguePoints,
                                    summonerIcon: storedSummonerIcon,
                                    summonerId: storedSummonerId,
                                    wins: storedWins,
                                    losses: storedLosses,
                                };

                                $.post("/update", Summoner, function () {
                                    getAll();
                                });
                            } else {
                                console.log('No summoner data found for summoner ID:', summonerId);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                } else {
                    console.log('No league entries found for summoner ID:', summonerId);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}


function getAll() {
    $.get( "/getAll", function( Summoner ) {
        formaterData(Summoner);
    })
}

function deleteAll() {
    $.get( "/deleteAll", function( Summoner ) {

    })
    window.location.href="/";
}

function save() {
    const Summoner = {
        summonerName: $("#summonerName").val(),
        rank: $("#rank").val(),
        tier: $("#tier").val(),
        lp: $("#lp").val(),
        summonerIcon: $("#summonerIcon").val(),
        summonerId: $("#summonerId").val(),
        wins: $("#wins").val(),
        losses: $("#losses").val(),

    };
    $.post("/save", Summoner, function () {
        getAll();
        window.location.href = "/";
    });
}

function formaterData(Summoner) {
    for (const [index, sum] of Summoner.entries()) {

        document.getElementById("summoner"+(index+1)).textContent=(index+1)+". "+sum.summonerName;
        document.getElementById("summonerIcon"+(index+1)).src=`http://ddragon.leagueoflegends.com/cdn/13.12.1/img/profileicon/`+sum.summonerIcon+`.png`;
        document.getElementById("games"+(index+1)).textContent="Games played: " + (sum.wins+sum.losses);
        document.getElementById("wins"+(index+1)).textContent="Top 4: " + sum.wins;
        document.getElementById("losses"+(index+1)).textContent="Bot 4: " + sum.losses;
        document.getElementById("wr"+(index+1)).textContent="Wr: " + Math.trunc(sum.wins/(sum.losses+sum.wins)*100) + "%";
        document.getElementById("rank"+(index+1)).textContent=sum.tier + " " + sum.rank+" "+sum.lp+ " LP";

    }
}