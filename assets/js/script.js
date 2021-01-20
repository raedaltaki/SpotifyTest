var songEl = document.querySelector("#preview");
var imageEl = document.querySelector("#album-image");
var songNameEl = document.querySelector("#song-name");
var artistEl = document.querySelector("#artist");
var albumEl = document.querySelector("#album");
var spotifyEl = document.querySelector("#spotify");
var searchEl = document.querySelector("#search");
var btnEl = document.querySelector("#btn");
var clientID = "5811c1acf46947a8a1b0fa69dd045782";
var clientSecret = "ac6c018b23e14bd5a50186ff521ea95c";
var accessToken= "";

var getToken = function()
{
    fetch('https://accounts.spotify.com/api/token', 
    {
        method: 'POST', 
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientID + ":" + clientSecret)
        },
        body: "grant_type=client_credentials"
    })
    .then(function(response)
    {
        response.json().then(function(data)
        {
            accessToken = data.access_token;
            console.log(accessToken);
            searchTrack();
        })
    });
};

var searchTrack = function()
{
    var songName = searchEl.value.trim();//"send my love";
    searchEl.value = "";

    fetch('https://api.spotify.com/v1/search?q='+ songName+'&type=track', 
    {
        headers: 
        {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(function(response)
    {
        response.json().then(function(data)
        {
            var songName = data.tracks.items[0].name;
            var artist = data.tracks.items[0].artists[0].name;
            var album = data.tracks.items[0].album.name;
            var albumImg = data.tracks.items[0].album.images[0].url;
            var songURL = data.tracks.items[0].external_urls.spotify;
            var previewURL = data.tracks.items[0].preview_url;
            songEl.src = previewURL;
            imageEl.src = albumImg ;
            songNameEl.textContent = songName;
            albumEl.textContent = album;
            artistEl.textContent = artist;
            spotifyEl.href=songURL;
            spotifyEl.textContent= songName;
        })
    });
};


btnEl.addEventListener('click',getToken);