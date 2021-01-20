var songEl = document.querySelector("#preview");
var imageEl = document.querySelector("#album-image");
var songNameEl = document.querySelector("#song-name");
var artistEl = document.querySelector("#artist");
var albumEl = document.querySelector("#album");
var spotifyEl = document.querySelector("#spotify");
var searchEl = document.querySelector("#search");
var btnEl = document.querySelector("#btn");
var catListEl = document.querySelector("#category-list");
var playlistEl = document.querySelector("#playlist");
var tracklistEl = document.querySelector("#tracklist");
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
            categoryList();
            playLists();
            trackLists();
            displayTrackDetails();
        })
    });
};


var categoryList = function()
{
    fetch("https://api.spotify.com/v1/browse/categories?locale=sv_US", 
    {
        method: "GET",
        headers: 
        {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(function(response)
    {
        response.json().then(function(data)
        {
            var catArr = data.categories.items;
            for(var i = 0; i < catArr.length; i++)
            {
                var catLi = document.createElement("li");
                var cat = document.createElement("a");
                cat.textContent= catArr[i].name;
                var catID = catArr[i].id;
                cat.href = "./index.html?category="+catID+"&playlist="+""+"&track="+"";

                catLi.appendChild(cat);
                catListEl.appendChild(catLi);
            }
        })
    });
}

var playLists = function()
{
    var search = document.location.search; //get search attribute if available
    if(search) //if search attribute is available 
    {
        var Category = search.split("=")[1].split("&")[0]; 

        fetch("https://api.spotify.com/v1/browse/categories/"+Category+ "/playlists", 
        {
            method: "GET",
            headers: 
            {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(function(response)
        {
            response.json().then(function(data)
            {
                var playArr = data.playlists.items;
                for(var i = 0; i < playArr.length; i++)
                {
                    var playLi = document.createElement("li");
                    var play = document.createElement("a");
                    play.textContent= playArr[i].name;
                    var playID = playArr[i].id;
                    play.href = "./index.html?category="+Category+"&playlist="+playID+"&track="+"";

                    playLi.appendChild(play);
                    playlistEl.appendChild(playLi);
                }
            })
        });
    }
}

var trackLists = function()
{
    var search = document.location.search; //get search attribute if available
    if(search) //if search attribute is available 
    { 
        var category = search.split("=")[1].split("&")[0]; 
        var playlist = search.split("=")[2].split("&")[0];
    
        if(playlist) //if search attribute is available 
        {
            fetch("https://api.spotify.com/v1/playlists/"+playlist+"/tracks?limit=10", 
            {
                method: "GET",
                headers: 
                {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            .then(function(response)
            {
                response.json().then(function(data)
                {
                    var trackArr = data.items;
                    console.log(trackArr[0].track);
                    for(var i = 0; i < trackArr.length; i++)
                    {
                        var trackLi = document.createElement("li");
                        var track = document.createElement("a");
                        track.textContent= trackArr[i].track.name;
                        var trackID = trackArr[i].track.id;
                        track.href = "./index.html?category="+category+"&playlist="+playlist+"&track="+trackID;

                        trackLi.appendChild(track);
                        tracklistEl.appendChild(trackLi);
                    }
                }) 
            });
    
        }
    }
}

var displayTrackDetails = function()
{
    var search = document.location.search;
    if(search) //if search attribute is available 
    { 
        var search = document.location.search;
        var Category = search.split("=")[1].split("&")[0]; 
        var playlist = search.split("=")[2].split("&")[0];
        var track = search.split("=")[3].split("&")[0];
        console.log(track);
        if(track)
        {
            fetch('https://api.spotify.com/v1/tracks/'+ track, 
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
                    
                    var songName = data.name;
                    var artist = data.artists[0].name;
                    var album = data.album.name;
                    var albumImg = data.album.images[0].url;
                    var songURL = data.external_urls.spotify;
                    console.log(songName);
                    var previewURL = data.preview_url;
                    var songID = data.id;
    
                    songEl.src = previewURL;
                    imageEl.src = albumImg ;
                    songNameEl.textContent = songName;
                    albumEl.textContent = album;
                    artistEl.textContent = artist;
                    spotifyEl.href=songURL;
                    spotifyEl.textContent= songName; 
                })
            });
        }
    }
};

//btnEl.addEventListener('click',getToken);
getToken();