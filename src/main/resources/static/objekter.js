
$(function(){
    getAllSummonerIds();
    getAll();
    getTime();
});
function getTime() {
    $.get("/getTime", {type: 'Rank'}, function (data) {
        const originalDateString = data;
        const date = new Date(originalDateString);

        const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(
            date.getMonth() + 1
        ).padStart(2, '0')}.${date.getFullYear()}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(
            date.getMinutes()
        ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

        document.getElementById('rankTime').textContent ='Last updated: '+ formattedDate + ' at '+ formattedTime
    });
}

let summonerIds = null;
let isSummonerIdsLoaded = false;
let riotApiKey;

fetch('/api/riot-api-key')
    .then(response => response.json())
    .then(data => {
        const apiKey = data.RIOT_API_KEY;
        riotApiKey = apiKey;
    })
    .catch(error => {
        console.error('Error retrieving Riot API key:', error);
    });

function enableButton(){
    document.getElementById("btn").disabled = false;
}


function getAllSummonerIds() {
    if (summonerIds !== null && isSummonerIdsLoaded) {
        createDivs(summonerIds);
        return;
    }

    const cachedSummonerIds = localStorage.getItem('summonerIds');
    if (cachedSummonerIds) {
        summonerIds = JSON.parse(cachedSummonerIds);
        isSummonerIdsLoaded = true;
    }

    $.get("/getAllSummonerIds", function(data) {
        summonerIds = data;
        isSummonerIdsLoaded = true;
        localStorage.setItem('summonerIds', JSON.stringify(summonerIds));
        createDivs(summonerIds);
    }).fail(function() {
        summonerIds = [];
        isSummonerIdsLoaded = true;
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
    const url = 'matchhistory?data=' + encodeURIComponent(result);

    insertMatch(result)
        .then(() => {
           window.location.href = url;
        })
        .catch(error => {
            console.log('Error inserting match:', error);
        });
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


function insertMatch(clickedValue) {
    return new Promise((resolve, reject) => {
        const summonerName = clickedValue;
        $.get("/getPuuid", { summonerName: summonerName }, function (data) {
            const puuid = data;
            const endpoint = `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=10&`;
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
                            sessionStorage.setItem('puuid', puuid);
                            resolve(); // Resolve the promise after successful match update
                        })
                            .fail(error => {
                                reject(error); // Reject the promise if there is an error in the match update
                            });
                    } else {
                        resolve(); // Resolve the promise if no match IDs are found
                    }
                })
                .catch(error => {
                    reject(error); // Reject the promise if there is an error in fetching match IDs
                });
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

function formaterData(Summoner) {
    for (const [index, sum] of Summoner.entries()) {

        document.getElementById("summoner"+(index+1)).textContent=(index+1)+". "+sum.summonerName;
        document.getElementById("summonerIcon"+(index+1)).src=`https://ddragon.leagueoflegends.com/cdn/13.16.1/img/profileicon/`+sum.summonerIcon+`.png`;
        document.getElementById("games"+(index+1)).textContent="Games played: " + (sum.wins+sum.losses);
        document.getElementById("wins"+(index+1)).textContent="Wins: " + sum.wins;
        document.getElementById("losses"+(index+1)).textContent="Losses: " + sum.losses;
        document.getElementById("wr"+(index+1)).textContent="Ratio: " + Math.trunc(sum.wins/(sum.losses+sum.wins)*100) + "%";
        document.getElementById("rank"+(index+1)).textContent=sum.tier + " " + sum.rank+" "+sum.lp+ " LP";

    }
}