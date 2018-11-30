// Include all packages for later use
require("dotenv").config();
var moment = require('moment');
var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var inputs = process.argv;

// get api keys from keys.js
var spotify = new Spotify(keys.spotify);
var bandsintown = keys.bandsintown;
var omdb = keys.omdb;

// get the most recent event info from Bandsintown with specified band/artist name
function concertThis(band){
    //console.log("Concert This");

    axios.get("https://rest.bandsintown.com/artists/"+band+"/events?app_id="+bandsintown).then(
        results => {
            console.log("Name of the venue: " + results.data[0].venue.name);
            console.log("Venue Location: " 
                + results.data[0].venue.city + ", " 
                + results.data[0].venue.region + ", " 
                + results.data[0].venue.country);
            console.log("Date of the Event: " 
                + moment(results.data[0].datetime, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS).format("MM/DD/YYYY"));
        },
        err => {
            console.log(err);
        }
    );
}

// get the first result of the specified song name from spotify
// if song name is undefined, search the song "The Sign", artist "Ace of Base"
function spotifyThisSong(song){
    //console.log("Spotify This Song");

    if (song === undefined){
        song = "The Sign Ace of Base";
    }
    //else song = inputs[3];

    spotify
        .search({
            type: "track",
            query: song,
            limit: 3
        })
        .then(results => {
            console.log("Song name: " + results.tracks.items[0].name);
            console.log("Artists names: " + results.tracks.items[0].artists[0].name);
            console.log("Preview link: " + results.tracks.items[0].preview_url);
            console.log("Album name: " + results.tracks.items[0].album.name);
        })
        .catch(err => {
            console.log(err);
        });
}

// get movie info of the speicified movie name from OMBD
// if movie name is undefined, search for "Mr. Nobody"
function movieThis(movie){
    //console.log("Movie This");

    if (movie === undefined){
        movie = "Mr. Nobody";
    }
    //else movie = inputs[3];

    axios.get("http://www.omdbapi.com/?t=" + movie + "&apikey=" + omdb).then(
        results => {
            //console.log(results.data);
            console.log("Title: " + results.data["Title"]);
            console.log("Year: " + results.data["Year"]);
            //console.log("IMDB Rating: " + results.data["Ratings"][0]["Value"]);
            console.log("IMDB Rating: " + results.data["imdbRating"]);
            console.log("Rotten Tomatoes Rating: " + results.data["Ratings"][1]["Value"]);
            console.log("Country: " + results.data["Country"]);
            console.log("Language: " + results.data["Language"]);
            console.log("Plot: " + results.data["Plot"]);
            console.log("Actors: " + results.data["Actors"]);
        },
        err => {
            console.log(err);
        }
    );
}

// get command and movie/song/artist from random.txt using fs, then run liri
function doWhatItSays(){
    //console.log("Do What It Says");
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) {
            return console.log(error);
        }

        //console.log(data);
        var dataArr = data.split(",");
        //console.log(dataArr);
        runLiri(dataArr[0], dataArr[1]);
    });
}

// if liri doesn't get run properly, this will run
function liriInstruction(){
    console.log("To run Liri: ");
    console.log("node liri concert-this '<artist/band name here>'");
    console.log("node liri spotify-this-song '<song name here>'");
    console.log("node liri movie-this '<movie name here>'");
    console.log("node liri do-what-it-says");
}

// function recordIt(){

// }

// run liri
function runLiri(command, str){
    switch(command){
        case "concert-this":
            concertThis(str);  
            break;
        
        case "spotify-this-song":
            spotifyThisSong(str);  
            break;
        
        case "movie-this":
            movieThis(str);    
            break;
    
        case "do-what-it-says":
            doWhatItSays(); 
            break;
    
        default:
            liriInstruction();
    }
}

// start
runLiri(inputs[2], inputs[3]);
