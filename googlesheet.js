const {google} = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "config.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});
    
//create client instance for auth
const client = auth.getClient();
    
//create instance of sheets api
const sheets = google.sheets({version: "v4", auth: client});

//currently linked with "Game sheet_current"
const sheetId = "1AG0wLJQYYClmUN1bVOb2_j3Gt089joAwNrnSfOe5mAk";

//provides a filtered result of the name searched
exports.searchName = async function (name) {
    const searchTerm = name.toLowerCase();
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:B500"
    });

    let searchList = [];

    for (const row of playerScoreSheet.data.values) {
        if (row[1] && row[0].toLowerCase().includes(searchTerm)) {
            searchList.push([row[0]]);
        }
    };

    return searchList;
}

//using the submitted name to find their score
exports.fetchScore = async function (name) {
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:B500"
    });

    const playerData = playerScoreSheet.data.values.filter(item => item[1]);
    playerData.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));

    let playerScore = ['', 0, playerData.length];

    for (const row of playerData) {
        playerScore[1]++;
        if (row[1] && row[0].includes(name)) {
            playerScore[0] = row[1];
            break;
        }
    };
    return playerScore;
}

//shows the top 3 players
exports.leaderboard = async function () {
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:B500"
    });

    const playerData = playerScoreSheet.data.values.filter(item => item[1]);
    playerData.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));

    const topThree = playerData.slice(0, 3);

    return topThree;
}

//provides a filtered result of the name searched, including scoreless ones
exports.searchNameScoreless = async function (name) {
    const searchTerm = name.toLowerCase();
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:C500"
    });

    let searchList = [];

    for (const row of playerScoreSheet.data.values) {
        if (row[0] && row[0].toLowerCase().includes(searchTerm)) {
            searchList.push([row[0], row[2]]);
        }
    };

    return searchList;
}

//updates the player name in the leaderboard
exports.updateName = async function (oldName, newName) {
    const playerScoreSheet = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: "player!A2:A500"
    });

    let rowNumber = playerScoreSheet.data.values.findIndex(player => player[0] == oldName) + 2;
    if (rowNumber < 2) {
        return "findError";
    }

    const response = sheets.spreadsheets.values.update({
        auth,
        spreadsheetId: sheetId,
        range: `player!A${rowNumber}:A${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        resource: { values : [[newName]] }
    });

    return response;
}

