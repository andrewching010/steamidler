/*
    Project: Steam Hour Bot
    Created by Swayer
    version.1.3.9.
*/

//=============== CONSTRUTORS  ===============//

const Steam = require('steam-user'), 
      fs = require('fs'), 
      readlineSync = require('readline-sync'), 
      chalk = require('chalk'),
      SteamCommunity = require('steamcommunity');
const client = new Steam();
//const settings = require('./config.json');
const settings = {
  "acceptRandomFriendRequests": false,  
  "acceptItemNotify": true,  
  "acceptTradesNotify": true,  
  "acceptReplys": false,  
  "games": [730,1172470,1475380,1627520,1673740,1301720,1630570,812810,1684660,1684660,1593310,1290490,1639580] //739630 
}

//=============== VARIABLES  ===============//
var version = 'v1.3.9';

console.log(chalk.black.bold.bgWhite('    Steam Hour [Bot]     '));
console.log(chalk.gray.underline(' ' + version));
console.log(chalk.black.bold.bgWhite('      Steam Login        '));

var username = readlineSync.question(chalk.gray.bold(' Username ') + ': ');
var password = readlineSync.question(chalk.gray.bold(' Password ') + ': ', {hideEchoBack: true});
var mobileCode = readlineSync.question(chalk.gray.bold(' Steam Guard ') + ': ');
var wstream;
var dtiming = new Date();
var tstamp = Math.floor(Date.now() / 1000);


//=============== COUNT GAMES  ===============//

var CountGamesUsed = function(array) {
  for (var i = array.Length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

//=============== START SESSION  ===============//

client.logOn({
  accountName: username,
  password: password,
  twoFactorCode: mobileCode  
});

client.on("loggedOn", function() {
  client.setPersona(Steam.EPersonaState.Away);

    if (username === "" || password === "") {
        log((chalk.red("Login Denied - Empty fields.")));
        shutdown();        
    } else {
        log((chalk.green("Logged on Steam Client.")));
        log((chalk.yellow("Tip: Use (CTRL + C) to Log out.")));
        client.gamesPlayed(CountGamesUsed(settings.games));        
    }   
});

//=============== CHECK SERVER AVAILABILITY  ===============//

if (fs.existsSync('servers')) {
    Steam.servers = JSON.parse(fs.readFileSync('servers'));
    log((chalk.green("Connecting...")));   
}

client.on("connected", function() {
    log((chalk.green("Initializing...")));  
});

//=============== LIMITATIONS (PREVENT LIMITED ACCOUNTS WITH ONLY 5 GAMES)  ===============//

client.on('accountLimitations', function (limited, communityBanned, locked) {
    //account is limited
    if (limited) {  
        if(settings.games.length < 5) {
                log((chalk.blue("This Account is Limited.")));
                log((chalk.green("Initializing " + settings.games.length + " game and playing on "+settings.games+".")));
            } else {
                log("Exceeded the limit " + settings.games.length + " of 5 Games.");
                log((chalk.red("Exceeded the limit " + settings.games.length + " of 5 Limited Games...")));
                log((chalk.red("Logging off..."))); 

                shutdown(); 
            }      
    } else 
    
    if(settings.games.length < 25) {
        
        log((chalk.green("Initializing " + settings.games.length + " game and playing on "+settings.games+".")));
  
    } else {
        log((chalk.red("Exceeded the limit " + settings.games.length + " of 25 Limited Games...")));
        log((chalk.red("Logging off...")));  

	    shutdown();                   
    }  
    //community bann
    if (communityBanned){
        log((chalk.red("[BOT] not able to proceed with Community Banned."))); 
        log((chalk.red("Connection Lost!")));

        shutdown();          
    }
    //locked account
	if(locked) {
        log((chalk.red("[BOT] not able to proceed with Locked Accounts."))); 
        log((chalk.red("Connection Lost!")));

        shutdown();  
	}    
});

client.on('vacBans', function(numBans, appids) {
	if(numBans > 0) {
	   log((chalk.red("Verified ("+ numBans + ") ban" + (numBans == 1 ? '' : 's') + "." + (appids.length == 0 ? '' : " in " + appids.join(', ')) )));
       log((chalk.red("[BOT] not able to proceed with banned games."))); 
       log((chalk.red("Connection Lost!")));

       shutdown(); 
	}
});

//=============== REQUESTS  ===============//

client.on('friendRelationship', (steamID, relationship) => {
	if (relationship === 2 && settings.acceptRandomFriendRequests) {
	  client.addFriend(steamID);
        //client.removeFriend(steamID);  
      client.chatMessage(steamID, "Thank you for Added me. We talk later.");        
      log(chalk.yellow('You have an invite from '+steamID+'.'));        
    } else {
        log((chalk.yellow("No invites or accept_Random_FriendRequests is OFF.")));
    }	
});

//=============== ITEMS NOTIFY  ===============//

client.on('newItems', function (count) {
    if(settings.acceptItemNotify) {
      if(count > 0) {
          log(chalk.green("You received ("+ count + ") items in your Inventory."));  
      } 
    } else {
        log((chalk.yellow("Your Drop_Item_Notify is OFF.")));
    }	
});

//=============== TRADES NOTIFY  ===============//

client.on('tradeOffers', function (number, steamID) {
    if(settings.acceptTradesNotify) {
        if (number > 0) {
            log(chalk.green("You received ("+ number +") Trade Offer from "+steamID+"."));     
        }        
    } else {
        log((chalk.yellow("Your Auto_Trade_Notify is OFF.")));
    }	  
});


//=============== AUTO REPLY  ===============//

client.on("friendMessage", function(steamID, message) {
    if(settings.acceptReplys) {
        if (message == "hello") {
            client.chatMessage(steamID, "Yoo, wait a moment. ;D");
        }
        if (message == "play") {
            client.chatMessage(steamID, "Not now... i'm making missions");
        }  
        if (message == "Why") {
            client.chatMessage(steamID, "Because i'm doing something");
        }
        if (message == "yo") {
            client.chatMessage(steamID, "Yoo, wait a moment ;D");
        }
        if (message == "Do you want to play?") {
            client.chatMessage(steamID, "Not now");
        }
        if (message == "Whatsup") {
            client.chatMessage(steamID, "hey");
        }
        if (message == "Are you there?") {
            client.chatMessage(steamID, "Yes, but i'm leaving... bye");
        }
        if (message == "...") {
            client.chatMessage(steamID, "Not now!");
        } 
        if (message == "yes") {
            client.chatMessage(steamID, "Not now!");
        }            
    } else {
        log((chalk.yellow("Your Friend_Reply is OFF.")));
    }	
});


//=============== ERROR SYS  ===============//

client.on("error", function(err) {
  //log("[STEAM] Login Failed on Client.");    
  //log(err);
    if (err.eresult == Steam.EResult.InvalidPassword)
    {
        log((chalk.red("Login Denied - User or Password Wrong."))); 
        shutdown();
    }
    else if (err.eresult == Steam.EResult.AlreadyLoggedInElsewhere)
    {
        log((chalk.red("Login Denied -  Already logged in!")));         
        shutdown();
    }
    else if (err.eresult == Steam.EResult.AccountLogonDenied)
    {
        log((chalk.red("Login Denied - SteamGuard is required")));        
        shutdown();
    }
});


//=============== SHUT DOWN SYS  ===============//

process.on('SIGINT', function() {
    log((chalk.red("Logging off...")));
    shutdown();
    log((chalk.red("Connection Lost...")));
});
/*
process.on('SIGHUP', function() {

    log((chalk.red("New Connection...")));
});*/


//=============== STATUS ON CONSOLE  ===============//

console.log(chalk.black.bold.bgWhite('    Connection Status    '));

//=============== FUNCTIONS ===============//

function log(message) {
	var date = new Date();
	var time = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
	
	for(var i = 1; i < 6; i++) {
		if(time[i] < 10) {
			time[i] = '0' + time[i];
		}
	}
	console.log(' ' + time[3] + ':' + time[4] + ':' + time[5] + ' - \x1b[36m%s\x1b[0m', '[STEAM] ' + message);
}

function games() {
	if(settings.games.length < 25) {
       log((chalk.green("Initializing " + settings.games.length + " game and playing on "+settings.games+".")));                     
    } else {
       log((chalk.green("Exceeded the limit " + settings.games.length + " of 25...")));         
       log((chalk.red("Logging off...")));                  
       //client.logOff();
	   shutdown();                   
   }    
}

function shutdown(code) {
	client.logOff();
	client.once('disconnected', function() {
		process.exit(code);
	});

	setTimeout(function() {
		process.exit(code);
	}, 500);
}
