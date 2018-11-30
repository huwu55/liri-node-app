//console.log('this is loaded');

var spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

var bandsintown = process.env.BANDSINTOWN_API;

var omdb = process.env.OMDB_API;

module.exports = {
  spotify: spotify,
  bandsintown : bandsintown,
  omdb: omdb
};