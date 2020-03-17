var Twitter = require('twitter');
const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('underscore');
const fs = require('fs');
const request = require('request');
const SlackWebhook = require('slack-webhook')
const discord = require('discord-bot-webhook');
const Discord = require('discord.js');
var originalSoldOutItems = [];
var newSoldOutItems = []
const proxyList = [];
const userAgentList = [];
var restockCycles = 0;
var refreshDelay = 30000//checker hvert 30 sekund



'use strict';

/**
 * An example of how you can send embeds
 */

// Extract the required classes from the discord.js module
const { Client, MessageEmbed } = require('discord.js');

// Create an instance of a Discord client
const client = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  var channel = client.channels.cache.find(channel => channel.id === '688142568294580231'); // ved ikke om den kan fjernes
});


const hook = new Discord.WebhookClient('688143461177622604', '1Db8s0i3vuNc8vEAdv5roCc1apW7OzBAauOWZprqHt5Etk7pHkscQhyoddihrw00Plwn');
hook.send('webhooken alive!');



client.on('ready', () => {
 var channel = client.channels.cache.find(channel => channel.id === '688142568294580231'); //ved ikke om den kan fjernes 
 
});





var channel = client.channels.cache.find(channel => channel.id === '688142568294580231'); //ved ikke om den kan fjernes
/*client.on('message', message => {
  // If the message is "test"
  if (message.content === 'test') {
    const embed = new MessageEmbed()
    
      .setColor('#32CD32')
  .setTitle('supremenewyork.com')
  
  .setAuthor('Cys just analyzed restocks, waiting for the new drop to come.', '', '')
  .setDescription('Cook your shit just checked for restocks.')


  .addFields(
    
    { name: 'PRICE', value: '150 €' },
    //{ name: '\u200B', value: '\u200B' },

    { name: 'COLOR', value: 'GREEN', inline: true },
    { name: 'SIZE', value: 'MEDIUM', inline: true },
    
  )
  embed.addField("CHECKOUT", " [SUPREME](http://supremenewyork.com)")
  //.addField('Inline field title', 'test', false)
  .setImage('https://assets.supremenewyork.com/184829/ma/UdOuR0JdzFg.jpg')
  .setTimestamp()
  .setFooter('Cook your shit', 'https://cdn.discordapp.com/attachments/352526312788721675/688516950543958113/Untitled-1.jpg');
     
    message.channel.send(embed);
  }
});
*/

//token -> burde gemme den i en config (?)
client.login('');





console.log('checker for restocks.');

function initialize(){

  const userAgentInput = fs.readFileSync('useragents.txt').toString().split('\n');
  for (let u = 0; u < userAgentInput.length; u++) {
      userAgentInput[u] = userAgentInput[u].replace('\r', '').replace('\n', '');
      if (userAgentInput[u] != '')
          userAgentList.push(userAgentInput[u]);
  }
  console.log('Found ' + proxyList.length + ' Proxies.');
  console.log('Found ' + userAgentList.length + ' User Agents.');
  scrape(originalSoldOutItems);
}

function scrape(arr) {

  request({
      url: 'https://www.supremenewyork.com/shop/all',
      headers: generateRandomUserAgent(),
      timeout:60000,
     
  }, function(error, response, html) {

      if (response && response.statusCode != 200) {
          console.log(response.statusCode);
          return null;
      }

      if(!html){
        console.log('Did not get response.');
        return null;
      }
      var $ = cheerio.load(html);

      $('.inner-article').each(function(i, elm) {
          if (elm.children[0].children[1] != undefined) {
              arr.push(elm.children[0].attribs['href']);
          }
      }); //end of loop jQuery function
      if (restockCycles != 0) {
          if (newSoldOutItems.length < originalSoldOutItems.length) {
              console.log('RESTOCK');
              var restockedItems = findArrayDifferences(originalSoldOutItems, newSoldOutItems);
              console.log(restockedItems)
              //postToSlack(restockedItems)
              postToDiscord(restockedItems)
              //postToTwitter(restockedItems)
              originalSoldOutItems = newSoldOutItems; //reset the variable
          }

          if(newSoldOutItems.length > originalSoldOutItems.length){ // more items sold out
            originalSoldOutItems = newSoldOutItems; //reset the variable
          }
      }
      restockCycles++;
      console.log('Fuldført Restock Cyklus #' + restockCycles + '\n');
      setTimeout(function() {
          newSoldOutItems = [];
          scrape(newSoldOutItems)
      }, refreshDelay)

  }); //end of request call
}

function findArrayDifferences(arr1, arr2) {
    return _.difference(arr1, arr2)
}

function formatProxy(proxy) {
    if (proxy && ['localhost', ''].indexOf(proxy) < 0) {
        proxy = proxy.replace(' ', '_');
        const proxySplit = proxy.split(':');
        if (proxySplit.length > 3)
            return "http://" + proxySplit[2] + ":" + proxySplit[3] + "@" + proxySplit[0] + ":" + proxySplit[1];
        else
            return "http://" + proxySplit[0] + ":" + proxySplit[1];
    } else
        return undefined;
}

function generateRandomUserAgent(){
  var userAgent = userAgentList[Math.floor(Math.random() * userAgentList.length)];
  return {'User-Agent': userAgent}
}

function postToSlack(restockedItems){
  for (let i = 0; i < restockedItems.length; i++) {
    slack.send('http://www.supremenewyork.com' + restockedItems[i])
  }
}

function postToDiscord(restockedItems){


  for (let i = 0; i < restockedItems.length; i++) {
 //   embed.setTitle('Hello!')
//    discord.sendMessage('http://www.supremenewyork.com' + restockedItems[i]);



//const embed = new MessageEmbed()
//    .setURL('https://google.dk' + restockedItems[i])
//      .setTitle('Supremenewyork.com')
//      .setColor(0xff0000)
//      .setDescription('embed');
//    channel.send(embed);



'use strict';

const { Client, MessageEmbed } = require('discord.js');


const client = new Client();



var channel = client.channels.cache.find(channel => channel.id === '688142568294580231');
client.on('ready', () => {
 var channel = client.channels.cache.find(channel => channel.id === '688142568294580231'); //ved ikke om den kan fjernes 
 
});
client.on('message', message => {
 
   {
 const embed = new MessageEmbed()
   .setColor('#32CD32')
  .setTitle('supremenewyork.com')
  .setURL('https://supremenewyork.com/shop/' + restockedItems[i])

  .setDescription('Cook your shit just checked for restocks.')
  

  .addFields(
    
    { name: 'PRICE', value: '150 €' },
    //{ name: '\u200B', value: '\u200B' },

    { name: 'COLOR', value: 'GREEN', inline: true },
    { name: 'SIZE', value: 'MEDIUM', inline: true },
    
  )
  embed.addField("CHECKOUT", " [SUPREME]('https://supremenewyork.com/shop/' + restockedItems[i])")
  //.addField('Inline field title', 'test', false)
  .setImage('https://assets.supremenewyork.com/184829/ma/UdOuR0JdzFg.jpg')
  .setTimestamp()
  .setFooter('Cook your shit', 'https://cdn.discordapp.com/attachments/352526312788721675/688516950543958113/Untitled-1.jpg');
     
    message.channel.send(embed);

}});













  }
}

function postToTwitter(restockedItems){
   for (let i = 0; i < restockedItems.length; i++) {
      client.post('statuses/update', {status: 'http://www.supremenewyork.com' + restockedItems[i]}, function(error, tweet, response) {
    });
  }
}


initialize()
