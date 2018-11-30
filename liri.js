require("dotenv").config();
var moment = require('moment');
var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var inputs = process.argv;

var spotify = new Spotify(keys.spotify);
var bandsintown = keys.bandsintown;
var omdb = keys.omdb;

function concertThis(band){
    //console.log("Concert This");
    //var band = inputs[3];
    //if (band === undefined) console.log("no band entered");
    //console.log(band);
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

function spotifyThisSong(song){
    //console.log("Spotify This Song");
    //var song;
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

function movieThis(movie){
    //console.log("Movie This");
    //var movie;

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

function liriInstruction(){
    console.log("To run Liri: ");
    console.log("node liri concert-this '<artist/band name here>'");
    console.log("node liri spotify-this-song '<song name here>'");
    console.log("node liri movie-this '<movie name here>'");
    console.log("node liri do-what-it-says");
}

function recordIt(){

}

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

runLiri(inputs[2], inputs[3]);
