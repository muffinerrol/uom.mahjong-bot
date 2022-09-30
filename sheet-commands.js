const { ModalSubmitFields } = require("discord.js");
const {google} = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "config.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});
    
// create client instance for auth
const client = auth.getClient();
    
//create instance of sheets api
const sheets = google.sheets({version: "v4", auth: client});
    
const sheetId = "1u_MhAjfbpUBZfP9MRPfqTI0_Ux5OCrII4XBtjT5UuAs";

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

exports.test = function () {
    return console.log("hi");
}
