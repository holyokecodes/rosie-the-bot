const request = require('request');
const cheerio = require('cheerio');


module.exports = function(controller) {


  controller.hears('Workshop schedule','message_received', function(bot, message) {

    const url = 'https://holyokecodes.org/events';

    request(url, function(error, response, html){
      if(!error){
          var $ = cheerio.load(html);
          $('.events-table').filter(function(){
              var data = $(this).parent();
              bot.reply(message, data.html());
          })
      }
    })


  });

}