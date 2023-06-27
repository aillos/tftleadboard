


$(function() {
    fetchAPI();
    getMatchIds(data);
    getPuuid(data);
    createDivs(sessionStorage.getItem('puuid'));
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
        return matchIds;
    } catch (error) {
        console.error('Error:', error);
    }
}

function test() {
    document.getElementById("test").textContent = data;
}
function createDivs(puuid) {

    for (let i = 0; i < 10; i++) {

        // Retrieve the match details from the database
        fetch(`/getAllMatches?puuid=${puuid}`)
            .then(response => response.json())
            .then(matches => {
                if (matches.length > 0) {

                    const match = matches[i];

                    const matchDiv = document.createElement('div');
                    matchDiv.setAttribute("class", "match-entry");

                    const placementIcon = document.createElement('div');
                    placementIcon.setAttribute("class", "placement-icon");
                    const x = match.placement;
                    if (x===1){
                        placementIcon.textContent = x + "st";
                        matchDiv.style.border = "2px solid #ffb93b";
                        placementIcon.style.backgroundColor="#ffb93b";
                    } else if (x===2){
                        placementIcon.textContent = x + "nd";
                        matchDiv.style.border = "2px solid #c440da";
                        placementIcon.style.backgroundColor="#c440da";
                    } else if (x===3){
                        placementIcon.textContent = x + "rd";
                        matchDiv.style.border = "2px solid #207ac7";
                        placementIcon.style.backgroundColor="#207ac7";
                    } else if (x===4){
                        placementIcon.textContent = x + "th";
                        matchDiv.style.border = "2px solid #11b288";
                        placementIcon.style.backgroundColor="#11b288";
                    } else {
                        placementIcon.textContent = x + "th";
                        matchDiv.style.border = "2px solid #808080";
                        placementIcon.style.backgroundColor="#808080";
                    }
                    placementIcon.textContent = match.placement + "th";
                    matchDiv.style.borderRadius = "10px";
                    matchDiv.classList.add('match');
                    matchDiv.appendChild(placementIcon);


                    const tactician = JSON.parse(match.tactician); // Parse the tactician object
                    const littleLegend = document.createElement('img');
                    littleLegend.setAttribute("class", "tactician");
                    littleLegend.setAttribute("src", `./tftTacticians/${tactician.image}.png`);
                    littleLegend.setAttribute("alt", tactician.name);
                    matchDiv.appendChild(littleLegend);

                    const augmentIcons = document.createElement('div');
                    augmentIcons.setAttribute("class", "augment-icons");

                    let augmentsString = match.augments.trim(); // Trim the string to remove whitespace
                    augmentsString = augmentsString.replace(/\\"/g, '"'); // Remove additional backslashes

                    try {
                        if (augmentsString.length !== 0) {
                            let augments = JSON.parse(augmentsString);

                            if (augments.length === 2) {
                                // Add an additional entry as the first element
                                augments.unshift({
                                    id: "missing_legend",
                                    name: "Legend Augment",
                                    image: "Missing-T2.png"
                                });
                            }

                            for (let i = 0; i < augments.length; i++) {
                                const augment = augments[i];
                                const augmentIcon = document.createElement('img');
                                augmentIcon.setAttribute("src", `./tftAugments/${augment.image}`);
                                augmentIcon.setAttribute("alt", augment.name);
                                augmentIcons.appendChild(augmentIcon);
                            }
                        }
                    } catch (error) {
                        console.error("Error parsing augments:", error.message);
                        console.error("Error position:", error.message.slice(error.message.lastIndexOf(' ') + 1));
                    }

                    matchDiv.appendChild(augmentIcons);

                    const championIcons = document.createElement('div');
                    championIcons.setAttribute("class", "champion-icons");

                    let units = match.units.split("**");

                    for (let i=0; i<units.length-1;i++){
                        let unitsJSON = JSON.parse(units[i]);

                        const championIcon = document.createElement('img');
                        if (unitsJSON.name === "Vel'Koz"){
                            championIcon.setAttribute("src", `./championIcons/Velkoz.png`);
                        } else if (unitsJSON.name === "Kai'Sa"){
                            championIcon.setAttribute("src", `./championIcons/Kaisa.png`);
                        } else if (unitsJSON.name === "Kha'Zix"){
                            championIcon.setAttribute("src", `./championIcons/Khazix.png`);
                        } else if (unitsJSON.name === "Kog'Maw"){
                            championIcon.setAttribute("src", `./championIcons/KogMaw.png`);
                        } else if (unitsJSON.name === "Bel'Veth") {
                            championIcon.setAttribute("src", `./championIcons/Belveth.png`);
                        } else if (unitsJSON.name === "Cho'Gath"){
                                championIcon.setAttribute("src", `./championIcons/Chogath.png`);
                        } else if (unitsJSON.name === "Rek'Sai"){
                            championIcon.setAttribute("src", `./championIcons/RekSai.png`);
                        } else if (unitsJSON.name === "K'Sante"){
                            championIcon.setAttribute("src", `./championIcons/KSante.png`);
                        }
                        championIcon.setAttribute("src", `./championIcons/`+unitsJSON.name+`.png`);
                        championIcon.setAttribute("alt", unitsJSON.name);
                        if (unitsJSON.cost === 4) {
                            championIcon.style.border = "3px solid #c440da";
                        } else if (unitsJSON.cost === 2){
                            championIcon.style.border = "3px solid #207ac7";
                        } else if (unitsJSON.cost === 1){
                            championIcon.style.border = "3px solid #11b288";
                        } else if (unitsJSON.cost === 6){
                            championIcon.style.border = "3px solid #ffb93b";
                        } else if (unitsJSON.cost === 0){
                            championIcon.style.border = "3px solid #808080";
                        } else {
                            championIcon.style.border = "3px solid black";
                        }

                        championIcon.style.borderRadius = "10%";
                        championIcons.appendChild(championIcon);
                    }

                    matchDiv.appendChild(championIcons);

                    // Set item icons
                    const itemIcons = document.createElement('div');
                    itemIcons.setAttribute("class", "item-icons");

                    matchDiv.appendChild(itemIcons);

                    // Set trait icons
                    const traitIcons = document.createElement('div');
                    traitIcons.setAttribute('class', 'trait-icons');

                    if (match.traits && typeof match.traits === 'string') {
                        console.log(match.traits);
                        const traitsArray = match.traits.split("**");
                        console.log(traitsArray);

                        const maxIconsPerRow = 5; // Maximum number of icons per row
                        const totalRows = Math.ceil(traitsArray.length / maxIconsPerRow); // Calculate the total number of rows

                        const orderedTraits = [];

                        for (let j = 0; j < traitsArray.length - 1; j++) {
                            console.log(traitsArray[j]);
                            let traitJSON = JSON.parse(traitsArray[j]);

                            const style = traitJSON.style;
                            if (style > 0) {
                                orderedTraits.push(traitJSON);
                            }
                        }

                        orderedTraits.sort((a, b) => b.style - a.style); // Sort traits by style in descending order

                        for (let i = 0; i < totalRows; i++) {
                            const traitRow = document.createElement('div');
                            traitRow.setAttribute('class', 'trait-row');

                            for (let j = i * maxIconsPerRow; j < Math.min((i + 1) * maxIconsPerRow, orderedTraits.length); j++) {
                                console.log(orderedTraits[j]);
                                const traitIcon = document.createElement('img');
                                const name = orderedTraits[j].name;

                                traitIcon.setAttribute('src', `./tftTraits/${name}.png`);
                                traitIcon.setAttribute('alt', name);

                                // Apply styles based on the style value
                                const style = orderedTraits[j].style;
                                traitIcon.style.backgroundColor = (style === 1) ? '#e0864f' : (style === 2) ? '#b6d0d2' : (style === 3) ? '#f2d670' : '#a9dad9'; // Example colors based on style value

                                traitRow.appendChild(traitIcon);
                            }

                            traitIcons.appendChild(traitRow);
                        }
                    }

                    matchDiv.appendChild(traitIcons);
                    // Set match details

                    document.getElementById('matchhistory').appendChild(matchDiv);
                } else {
                    console.error('No match found for the specified puuid');
                }
            })
            .catch(error => {
                console.error('Error retrieving match details:', error);
            });
    }
}




function getPuuid(summonerName) {
    $.get("/getPuuid", {summonerName: summonerName}, function (data) {
        puuid = data;
    })
}
function loadMatches() {
    // Call getMatchIds to retrieve match IDs
    getMatchIds(data)
        .then(matchIds => {
            console.log(matchIds);

            $.get("/deleteAllMatches", { puuid: puuid }, function() {
                console.log("Successfully deleted matches");
            });

            // Call addMatch for each retrieved match ID
            matchIds.forEach((matchId) => {
                addMatch(matchId);
            });

            // Wait for 3 seconds (adjust the delay as needed)
            setTimeout(function() {
                // Refresh the page
                location.reload();
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}




function addMatch(matchId) {
        const endpoint = `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?`;
        const targetPuuid = sessionStorage.getItem('puuid');
        fetchDataFromRiotAPI(endpoint)
            .then(data => {
                const playerData = data.info.participants.find(participant => participant.puuid === targetPuuid);
                const itemID = playerData.companion.item_ID;

                // Fetch the JSON data for tacticians
                fetch('https://ddragon.leagueoflegends.com/cdn/13.12.1/data/en_US/tft-tactician.json')
                    .then(response => response.json())
                    .then(jsonData => {
                        const tacticianId = findTacticianId(jsonData, itemID);

                        if (tacticianId) {
                            const tacticianEntry = jsonData.data[tacticianId];
                            const tacticianImageFull = tacticianEntry.image.full;
                            const tacticianImage = tacticianImageFull.substring(0, tacticianImageFull.lastIndexOf('.'));
                            const tacticianName = tacticianEntry.name;
                            const unitData = playerData.units;

                            let champions = "";

                            for (let i = 0; i < unitData.length; i++) {
                                const startIndex = unitData[i].character_id.indexOf("_");
                                let substring = unitData[i].character_id.substr(startIndex + 1);
                                if (substring.includes("Ryze")) {
                                    substring = "Ryze";
                                }
                                champions = champions + `{"name":"${substring}","items":${JSON.stringify(unitData[i].itemNames)},"cost":${unitData[i].rarity},"stars":${unitData[i].tier}}**`;
                            }

                            const traitData = playerData.traits;
                            let synergies = "";
                            for (let i = 0; i < traitData.length; i++) {
                                const startIndex = traitData[i].name.indexOf("_");
                                const substring = traitData[i].name.substr(startIndex + 1);
                                synergies = synergies + `{"name":"${substring}","units":${JSON.stringify(traitData[i].num_units)},"style":${traitData[i].style}}**`;
                            }

                            // Fetch the JSON data for augments
                            fetch('https://ddragon.leagueoflegends.com/cdn/13.12.1/data/en_US/tft-augments.json')
                                .then(response => response.json())
                                .then(augmentData => {
                                    const augments = playerData.augments.map(augmentId => {
                                        const augment = augmentData.data[augmentId];
                                        if (augment && augment.name) {
                                            return {
                                                id: augmentId,
                                                name: augment.name,
                                                image: augment.image.full
                                            };
                                        } else {
                                            // Handle the case when augment or augment.name is undefined
                                            console.log('Augment not found for ID:', augmentId);
                                            return {
                                                id: augmentId,
                                                name: 'Unknown',
                                                image: ''
                                            };
                                        }
                                    });

                                    const match = {
                                        matchId: matchId,
                                        puuid: puuid,
                                        tactician: JSON.stringify({
                                            id: tacticianId,
                                            name: tacticianName,
                                            image: tacticianImage
                                        }),
                                        placement: playerData.placement,
                                        level: playerData.level,
                                        traits: synergies,
                                        units: champions,
                                        mode: data.info.queue_id,
                                        augments: JSON.stringify(augments)
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
    return null;
}
