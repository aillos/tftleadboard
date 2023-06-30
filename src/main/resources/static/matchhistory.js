


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

function homepage(){
    window.location.href="/";
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

                    //Placement
                    const placementIcon = document.createElement('div');
                    placementIcon.setAttribute("class", "placement-icon");
                    const x = match.placement;
                    const placementColor = {
                        1: '#ffb93b',
                        2: '#c440da',
                        3: '#207ac7',
                        4: '#11b288',
                        default: '#808080'
                    }
                    const placementEnding = {
                        1: 'st',
                        2: 'nd',
                        3: 'rd',
                        default: 'th'
                    }
                    const placeColor = placementColor[x] || placementColor.default;
                    const placeEnd = placementEnding[x] || placementEnding.default;
                    placementIcon.textContent = x + placeEnd;
                    matchDiv.style.cssText = `border: 2px solid ${placeColor}; border-radius: 10px;`;
                    placementIcon.style.backgroundColor=`${placeColor}`;
                    matchDiv.classList.add('match');

                    const date = document.createElement('div');
                    date.setAttribute("class", "date");
                    const fullDate = match.date.split(",");
                    const dayYear = fullDate[0];
                    const time = fullDate[1];
                    date.textContent = dayYear;
                    date.style.color=placementIcon.style.backgroundColor;

                    matchDiv.appendChild(date);
                    matchDiv.appendChild(placementIcon);


                    //Tactician / Little Legend
                    const tactician = JSON.parse(match.tactician); // Parse the tactician object
                    const littleLegend = document.createElement('img');
                    littleLegend.setAttribute("class", "tactician tool");
                    littleLegend.setAttribute("src", `./tftTacticians/${tactician.image}.png`);
                    littleLegend.setAttribute("alt", tactician.name);


                    matchDiv.appendChild(littleLegend);

                    //Augments
                    const augmentIcons = document.createElement('div');
                    augmentIcons.setAttribute("class", "augment-icons");

                    let augmentsString = match.augments.trim();
                    augmentsString = augmentsString.replace(/\\"/g, '"');

                    try {
                        if (augmentsString.length !== 0) {
                            let augments = JSON.parse(augmentsString);

                            if (augments.length === 2) {
                                augments.unshift({
                                    id: "missing_legend",
                                    name: "Legend Augment",
                                    image: "Missing-T2.png"
                                });
                            }

                            for (let i = 0; i < augments.length; i++) {
                                const augment = augments[i];
                                const abbr = document.createElement("abbr");
                                abbr.setAttribute("title", augment.name);
                                const augmentIcon = document.createElement('img');
                                augmentIcon.setAttribute("src", `./tftAugments/${augment.image}`);
                                abbr.appendChild(augmentIcon)
                                augmentIcons.appendChild(abbr);
                            }
                        }
                    } catch (error) {
                        console.error("Error parsing augments:", error.message);
                    }

                    matchDiv.appendChild(augmentIcons);

                    //Units
                    const championIcons = document.createElement('div');
                    championIcons.setAttribute("class", "champion-icons");

                    let units = match.units.split("**");

                    for (let i = 0; i < units.length - 1; i++) {
                        let unitsJSON = JSON.parse(units[i]);

                        const championWrapper = document.createElement('div');
                        const championIconDiv = document.createElement('div');
                        championIconDiv.setAttribute("class", "champion-icon");
                        const abbr = document.createElement("abbr");
                        let name = unitsJSON.name;
                        const championIcon = document.createElement('img');

                        // Units cost
                        const unitColor = {
                            4: '#c440da',
                            2: '#207ac7',
                            1: '#11b288',
                            6: '#ffb93b',
                            0: '#808080',
                            default: '#000000'
                        };

                        const cost = unitsJSON.cost;
                        const borderColor = unitColor[cost] || unitColor.default;
                        championIcon.style.border = `2px solid ${borderColor}`;

                        // Units name and icon
                        const nameMappings = {
                            "velkoz": "Vel'Koz",
                            "kaisa": "Kai'Sa",
                            "khazix": "Kha'Zix",
                            "kogmaw": "Kog'Maw",
                            "belveth": "Bel'Veth",
                            "chogath": "Cho'Gath",
                            "reksai": "Rek'Sai",
                            "ksante": "K'Sante",
                            "jarvaniv": "Jarvan IV",
                            "heimerdingerturret": "Heimerdinger Turret",
                            "thex": "T-Hex"
                        };

                        const lowercaseName = name.toLowerCase();
                        const mappedName = nameMappings[lowercaseName] || name;
                        const fileName = `./championIcons/${name}.png`;

                        championIcon.setAttribute("src", fileName);

                        championIcon.style.borderRadius = "10%";
                        abbr.setAttribute("title", mappedName);

                        // Items
                        const itemRow = document.createElement("div");
                        itemRow.setAttribute("class", "itemRow");

                        const items = unitsJSON.items;
                        for (let j = 0; j < items.length; j++) {
                            let item = items[j];
                            const itemDiv = document.createElement('div');
                            itemDiv.setAttribute("class", "item-icons");
                            const itemImg = document.createElement('img');
                            itemImg.setAttribute("src", `./tftItems/${item}.png`);
                            itemImg.setAttribute("class", "items");
                            itemDiv.appendChild(itemImg);
                            itemRow.appendChild(itemDiv);
                        }

                        abbr.appendChild(championIcon);
                        championIconDiv.appendChild(abbr);

                        const starDiv = document.createElement("div");
                        starDiv.setAttribute("class", "stars");
                        const stars = {
                            3: '★★★',
                            2: '★★',
                            1: '★',
                            default: ''
                        }
                        const starColor = {
                            3: '#f3ce56',
                            2: '#b6d0d2',
                            1: '#e0864f',
                            default: ''
                        }
                        const finalStarColor = starColor[unitsJSON.stars] || starColor.default;
                        const finalStars = stars[unitsJSON.stars] || stars.default;
                        starDiv.textContent=finalStars;
                        starDiv.style.color=finalStarColor;

                        championWrapper.appendChild(starDiv);
                        championWrapper.appendChild(championIconDiv);
                        championWrapper.appendChild(itemRow);

                        championIcons.appendChild(championWrapper);
                    }

                    matchDiv.appendChild(championIcons);





                    // Trait icons
                    const traitIcons = document.createElement('div');
                    traitIcons.setAttribute('class', 'trait-icons');

                    if (match.traits && typeof match.traits === 'string') {
                        const traitsArray = match.traits.split("**");

                        const orderedTraits = [];

                        for (let j = 0; j < traitsArray.length - 1; j++) {
                            let traitJSON = JSON.parse(traitsArray[j]);

                            const style = traitJSON.style;
                            if (style > 0) {
                                orderedTraits.push(traitJSON);
                            }
                        }

                        orderedTraits.sort((a, b) => b.style - a.style); // Sort traits by style in descending order

                        const colors = {
                            1: '#e0864f',
                            2: '#b6d0d2',
                            3: '#f2d670',
                            default: '#92f4ff'
                        };

                        for (let j = 0; j < orderedTraits.length; j++) {

                            const traitIcon = document.createElement('div');

                            traitIcon.classList.add('trait-icon');

                            const traitImage = document.createElement('img');

                            let name = orderedTraits[j].name;
                            const style = orderedTraits[j].style;
                            let color = colors[style] || colors.default;

                            traitIcon.style.backgroundColor = color;
                            traitIcon.style.borderTopColor = color;


                            traitIcon.style.setProperty('--border-bottom-color', color); // Set custom CSS property
                            traitIcon.style.setProperty('--border-top-color', color); // Set custom CSS property

                            traitImage.setAttribute('src', `./tftTraits/${name}.png`);

                            const nameMappings = {
                                "BandleCity": "Yordles",
                                "Preserver": "Invoker",
                                "Armorclad": "Juggernaut",
                                "ShadowIsles": "Shadow Isles",
                                "Marksman": "Gunner"
                            };

                            if (nameMappings.hasOwnProperty(name)) {
                                name = nameMappings[name];
                            }

                            const abbr = document.createElement("abbr");
                            abbr.setAttribute("title", name);

                            traitIcon.appendChild(traitImage);
                            abbr.appendChild(traitIcon);
                            traitIcons.appendChild(abbr);
                        }



                    }


                    matchDiv.appendChild(traitIcons);

                    //Date and Time
                    const timeDiv = document.createElement('div');
                    timeDiv.setAttribute("class", "time");
                    timeDiv.textContent = time;
                    timeDiv.style.color=placementIcon.style.backgroundColor;
                    matchDiv.appendChild(timeDiv);


                    //Finish the match

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
    getMatchIds(data)
        .then(matchIds => {

            $.get("/deleteAllMatches", { puuid: puuid }, function() {
                console.log("Successfully deleted matches");
            });

            // Call addMatch for each retrieved match ID
            matchIds.forEach((matchId) => {
                addMatch(matchId);
            });

            setTimeout(function() {
                // Very necessary timeout!!
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
                const dateTime = data.info.game_datetime;
                const seconds = dateTime/1000;
                const date = new Date(dateTime);
                const options = {
                    timeZone: 'Europe/Oslo',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                };
                const norwegianDateTime = date.toLocaleString('no-NO', options);
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
                                            if (augmentId === "TFT9_Augment_VoidEmblem") {
                                                return {
                                                    id: augmentId,
                                                    name: "Void Crest",
                                                    image: "Missing-T2.png"
                                                };
                                            } else {
                                                return {
                                                    id: augmentId,
                                                    name: 'Unknown',
                                                    image: "Missing-T2.png"
                                                };
                                            }
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
                                        augments: JSON.stringify(augments),
                                        date: norwegianDateTime
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
