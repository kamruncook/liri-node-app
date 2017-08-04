var keys = require('./keys.js');
 
var Twitter = require('twitter');
var twitterKeys = keys.twitterKeys;
var client = new Twitter(twitterKeys);

var spotify = require('spotify');

var request = require('request');

var fs = require('fs');

var arguments = process.argv.slice(2);

var action = arguments[0];

var data = arguments[1];

function append(append) {
    fs.appendFile('log.txt', append, (err) => {
        if (err) throw err;
    });
}

function doit(action,data) {
    append('\n***** New Search - '+action+' - '+data+' *****\n\n');
    
    switch(action) {
      
        case 'my-tweets':
           
            var screenName = {screen_name: data};
     
            client.get('statuses/user_timeline', screenName, function(error, tweets, response){                
                
                if (!error) {
                    
                    if(tweets.length > 0){
                        
                        for (var i = 0; i < tweets.length; i++) {
                            console.log(tweets[i].text);
                            console.log('----------------------------------------------------');
                            append(tweets[i].text+'\n');
                            append('----------------------------------------------------\n');
                        } 
                   
                    } else {
                        
                        console.log('Please search for another Twitter handle.')
                        append('Please search for another Twitter handle.\n');
                    }
               
                } else {
                    
                    console.log('Error: '+error);
                    append('Error: '+error+'\n');
                }
            });

            break;

        
        case 'spotify-this-song':
            
            spotify.search({ type: 'track', query: data }, function(err, results) {
               
                if ( err ) {
                    console.log('Error occurred: ' + err);
                    append('Error: '+err+'\n');
                    return;
                }
                
                if (results.tracks.items[0].artists[0].name) {
               
                    console.log('Artist Name: '+results.tracks.items[0].artists[0].name);
                    console.log('Song Name: '+results.tracks.items[0].name);
                    console.log('Spotify URL: '+results.tracks.items[0].artists[0].external_urls.spotify);
                    console.log('Album Name: '+results.tracks.items[0].album.name);
                    append('Artist Name: '+results.tracks.items[0].artists[0].name+'\n');
                    append('Song Name: '+results.tracks.items[0].name+'\n');
                    append('Spotify URL: '+results.tracks.items[0].artists[0].external_urls.spotify+'\n');
                    append('Album Name: '+results.tracks.items[0].album.name+'\n');
 
                } else {
                    
                    console.log('We did not find any results for that song.');
                    append('We did not find any results for that song.\n');
                } 
            });
            
            break;

        case 'movie-this':
           
            request('http://www.omdbapi.com/?t='+data+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
               
                if (!error && response.statusCode == 200) {
                  
                    body = JSON.parse(body);
                    
                    console.log('Title: '+body.Title);
                    append('Title: '+body.Title+'\n');
                   
                    console.log('Year: '+body.Year);
                    append('Year: '+body.Year+'\n');
                 
                    console.log('IMDB Rating: '+body.imdbRating);
                    append('IMDB Rating: '+body.imdbRating+'\n');
                
                    console.log('Country: '+body.Country);
                    append('Country: '+body.Country+'\n');
             
                    console.log('Language: '+body.Language);
                    append('Language: '+body.Language+'\n');
   
                    console.log('Short Plot: '+body.Plot);
                    append('Short Plot: '+body.Plot+'\n');
             
                    console.log('Actors: '+body.Actors);
                    append('Actors: '+body.Actors+'\n');

                    console.log('Rotten Tomatoes Rating: '+body.tomatoUserRating);
                    append('Rotten Tomatoes Rating: '+body.tomatoUserRating+'\n');

                    console.log('Rotton Tomatoes URL: '+body.tomatoURL);
                    append('Rotton Tomatoes URL: '+body.tomatoURL+'\n');

                } else {

                    console.log('Error: '+error);
                    append('Error: '+error+'\n');

                }
            })

            break;

        case 'do-what-it-says':

        fs.readFile(data, "utf8", function(err,data){

            var array = data.split(',');

            var fileAction = array[0];
                var fileData = array[1];

                doit(fileAction,fileData);
            });

            break;

            default:

            console.log('That is not a valid action.');
            append('That is not a valid action.\n');
    }
}

doit(action,data);