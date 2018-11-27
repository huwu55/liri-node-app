require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var inputs = process.argv;

var spotify = new Spotify(keys.spotify);
// console.log(keys.spotify);
// console.log(spotify.credentials.id);
// console.log(spotify.credentials.secret);

var bandsintown = keys.bandsintown;
//console.log(bandsintown);

function concertThis(){
    console.log("Concert This");
    var band = inputs[3];

    console.log(band);
    axios.get("https://rest.bandsintown.com/artists/"+band+"/events?app_id="+bandsintown).then(
        function(result){
            console.log(result);
        },
        function(err){
            console.log(err);
        }
    );
}

function spotifyThisSong(){
    console.log("Spotify This Song");
    var song;
    if (inputs[3] === undefined){
        song = "The Sign Ace of Base";
    }
    else song = inputs[3];

    //console.log(song);
    spotify
        .search({
            type: "track",
            query: song,
            limit: 1
        })
        .then(results => {
            //console.log(results.tracks.items[0]);
            console.log("Song name: " + results.tracks.items[0].name);
            console.log("Artists names: " + results.tracks.items[0].artists[0].name);
            console.log("Preview link: " + results.tracks.items[0].preview_url);
            console.log("Album name: " + results.tracks.items[0].album.name);
        })
        .catch(err => {
            console.log(err);
        });
}

function movieThis(){
    console.log("Movie This");
}

function doWhatItSays(){
    console.log("Do What It Says");
}

function liriInstruction(){
    console.log(inputs[2]);
}

switch(inputs[2]){
    case "concert-this":
        concertThis();  
        break;
    
    case "spotify-this-song":
        spotifyThisSong();  
        break;
    
    case "movie-this":
        movieThis();    
        break;

    case "do-what-it-says":
        doWhatItSays(); 
        break;

    default:
        liriInstruction();
}