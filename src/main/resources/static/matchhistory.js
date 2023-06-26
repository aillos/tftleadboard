$(function() {
    test();
    fetchAPI();
    getMatchIds(data);
    getPuuid(data);
});

const queryParams = new URLSearchParams(window.location.search);
const data = queryParams.get('data');
let matchIds = null;
let isMatchIdsLoaded = false;
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

async function getMatchIds(summonerName) {
    try {
        const response = await $.get("/getMatchIds", { summonerName: summonerName });
        matchIds = response.split(",");
        createDivs(matchIds);
    } catch (error) {
        console.error('Error:', error);
    }
}

function test() {
    document.getElementById("test").textContent = data;
}

function createDivs(matchIds) {
    matchIds.forEach((matchId, index) => {
        const match = document.createElement('div');
        match.setAttribute("class", "match-entry border");
        match.classList.add('match');
        const placementIcon = document.createElement('div');
        placementIcon.setAttribute("class", "placement-icon");
        placementIcon.textContent = "1st";
        match.appendChild(placementIcon);

        const championIcons = document.createElement('div');
        championIcons.setAttribute("class", "champion-icons");

        const championIcon1 = document.createElement('img');
        championIcon1.setAttribute("src", "./championIcons/KSante.png");
        championIcon1.setAttribute("alt", "Champion Icon");
        championIcons.appendChild(championIcon1);

        const championIcon2 = document.createElement('img');
        championIcon2.setAttribute("src", "./championIcons/Leona.png");
        championIcon2.setAttribute("alt", "Champion Icon");
        championIcons.appendChild(championIcon2);

// Add more champion icons as needed

        match.appendChild(championIcons);

        const itemIcons = document.createElement('div');
        itemIcons.setAttribute("class", "item-icons");

        const itemIcon1 = document.createElement('img');
        itemIcon1.setAttribute("src", "./tftItems/TFT4_Item_OrnnAnimaVisage.png");
        itemIcon1.setAttribute("alt", "Item Icon");
        itemIcons.appendChild(itemIcon1);

        const itemIcon2 = document.createElement('img');
        itemIcon2.setAttribute("src", "./tftItems/TFT5_Item_IonicSparkRadiant.png");
        itemIcon2.setAttribute("alt", "Item Icon");
        itemIcons.appendChild(itemIcon2);

// Add more item icons as needed

        match.appendChild(itemIcons);

        const traitIcons = document.createElement('div');
        traitIcons.setAttribute("class", "trait-icons");

        const traitIcon1 = document.createElement('img');
        traitIcon1.setAttribute("src", "./static/tftTraits/Trait_Icon_9_Noxus.TFT_Set9.png");
        traitIcon1.setAttribute("alt", "Trait Icon");
        traitIcons.appendChild(traitIcon1);

        const traitIcon2 = document.createElement('img');
        traitIcon2.setAttribute("src", "./icons/tft.png");
        traitIcon2.setAttribute("alt", "Trait Icon");
        traitIcons.appendChild(traitIcon2);

// Add more trait icons as needed

        match.appendChild(traitIcons);

        const matchDetails = document.createElement('div');
        matchDetails.setAttribute("class", "match-details");

        const rounds = document.createElement('span');
        rounds.setAttribute("class", "rounds");
        rounds.textContent = "Round 25";
        matchDetails.appendChild(rounds);

        const health = document.createElement('span');
        health.setAttribute("class", "health");
        health.textContent = "HP: 38";
        matchDetails.appendChild(health);

        match.appendChild(matchDetails);

        const damage = document.createElement('div');
        damage.setAttribute("class", "damage");

        const damageAmount = document.createElement('span');
        damageAmount.setAttribute("class", "damage-amount");
        damageAmount.textContent = "298";
        damage.appendChild(damageAmount);

        const damageText = document.createElement('span');
        damageText.setAttribute("class", "damage-text");
        damageText.textContent = "Damage to Players";
        damage.appendChild(damageText);

        match.appendChild(damage);

        document.getElementById('matchhistory').appendChild(match);

        });
}


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
                const itemID = playerData.companion.item_ID;

                // Fetch the JSON data
                fetch('https://ddragon.leagueoflegends.com/cdn/13.12.1/data/en_US/tft-tactician.json')
                    .then(response => response.json())
                    .then(jsonData => {
                        console.log(jsonData);
                        const tacticianId = findTacticianId(jsonData, itemID);

                        if (tacticianId) {
                            const tacticianEntry = jsonData.data[tacticianId];
                            const tacticianImage = tacticianEntry.image; // Assign the image property as an object
                            const tacticianName = tacticianEntry.name;

                            const match = {
                                matchId: matchId,
                                puuid: puuid,
                                tactician: "id:" + tacticianId + ", name:" + tacticianName + ", image:" + JSON.stringify(tacticianImage),
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
                            })
                                .catch(error => {
                                    console.log('Error:', error);
                                });
                        } else {
                            console.log('Tactician ID not found for item ID:', itemID);
                        }
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    });
            })
            .catch(error => {
                console.log('Error:', error);
            });
    });
}



function findTacticianId(jsonData, itemID) {
    const tacticianData = jsonData.data;
    for (const tacticianId in tacticianData) {
        if (tacticianData.hasOwnProperty(tacticianId)) {
            const tactician = tacticianData[tacticianId];
            if (tactician.id === String(itemID)) {
                return tacticianId;
            }
        }
    }
    return null; // Tactician ID not found
}





function formaterMatch(Match) {
    for (const [index, sum] of Match.entries()) {
            document.getElementById("summoner" + (index + 1)).textContent = (index + 1) + ". " + sum.summonerName;
            document.getElementById("summonerIcon" + (index + 1)).src = `http://ddragon.leagueoflegends.com/cdn/13.12.1/img/profileicon/` + sum.summonerIcon + `.png`;
            document.getElementById("games" + (index + 1)).textContent = "Games played: " + (sum.wins + sum.losses);
            document.getElementById("wins" + (index + 1)).textContent = "Top 4: " + sum.wins;
            document.getElementById("losses" + (index + 1)).textContent = "Bot 4: " + sum.losses;
            document.getElementById("wr" + (index + 1)).textContent = "Wr: " + Math.trunc(sum.wins / (sum.losses + sum.wins) * 100) + "%";
            document.getElementById("rank" + (index + 1)).textContent = sum.tier + " " + sum.rank + " " + sum.lp + " LP";
    }
}