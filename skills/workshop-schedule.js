const request = require('request');
const cheerio = require('cheerio');
const luis = require('botkit-middleware-luis');

function hereIntent(tests, message) {
  console.log(message.topIntent);
  if (message.topIntent) {
      var intent = message.topIntent.intent.toLowerCase();
      for (var i = 0; i < tests.length; i++) {
          if (tests[i].trim().toLowerCase() == intent) {
              return true;
          }
      }
  }
  return false;
}

module.exports = function(controller) {

  var luisOptions = {serviceUri: process.env.serviceUri};
  controller.middleware.receive.use(luis.middleware.receive(luisOptions));

  controller.on('hello', function(bot, message) {
    // a new session with an unknown user has begun
    bot.reply(message, "Hello! I am Rosie the bot. I can answer a lot of common questions about Holyoke Codes. I'm always learning, so keep asking questions and help me learn. What do you want to know?");
  });

  controller.on('welcome_back', function(bot, message) {
    // a known user has started a new, fresh session
    bot.reply(message, "Hello! Good to see you again. What can I help you with?");
  });

  controller.hears(['Hi'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, {
      text: 'Hello human! It is me, Rosie, a friendly bot. I can answer a lot of common questions about Holyoke Codes. What do you want to know?',
      quick_replies: [
          {
              title: 'Workshop schedule',
              payload: 'Workshop schedule'
          },
          {
              title: 'Find us',
              payload: 'Where are you located?'
          },
      ]
      }, function() {}
    );
  });

  controller.hears(['Contact'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, 'You can email us at <a href="mailto:info@holyokecodes.org">info@holyokecodes.org</a>. You can also call or text to 413-539-3736. Look forward to hearing from you!');
  });

  controller.hears(['Cost'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, 'Our weekly public workshops at the MGHPCC are free. We want everyone to be able to learn about coding and robotics. There is a cost for our summer programs and some of the other workshop series. We do everything we can to keep the cost low and are sometimes able to offer scholarships. Please ask if you are interested in a scholarship.');
  });

  controller.hears(['Location'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, {
      text: "Most of our workshops at the Massachusetts Green High Performance Computing Center at 100 Bigelow Street in Holyoke. Some of our programs are at other locations. Check our schedule to see if we're planning to be somewhere near you soon.",
      quick_replies: [
        {
            title: 'Show me a map',
            payload: 'Show me a map'
        },
        {
            title: 'Workshop schedule',
            payload: 'Workshop schedule'
        },
        ]
        }, function() {}
    )
  });
  controller.hears(['Map'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, "Here's a [map](https://www.google.com/maps/place/Massachusetts+Green+High+Performance+Computing+Center/@42.202741,-72.6777334,12z/data=!4m8!1m2!2m1!1sholyoke+codes!3m4!1s0x89e6dc2234cebb67:0x4aef6ee172ad1297!8m2!3d42.202741!4d-72.6076956). There is free parking available in the lot in front of the building and in another lot to the side.");
  })

  controller.hears(['Menu'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, {
      text: "What can I do for you?",
      quick_replies: [
        {
            title: 'Find us',
            payload: 'Find us'
        },
        {
            title: 'Workshop schedule',
            payload: 'Workshop schedule'
        },
        {
          title: 'Summer programs',
          payload: 'Summer programs'
        },
        {
          title: 'Contact',
          payload: 'Contact'
        },
        ]
        }, function() {}
    )
  });

  controller.hears(['Rosie'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, 'The name Rosie is inspired by the Rosie the Riveter character that encouraged women to join the workforce during World War II. We believe it is important to encourage women to work in the computer science and technology fields.');
  });

  controller.hears(['Ages'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, "We design our workshops to be good for a wide range of ages. Each workshop usually specifies a minimum age or age range. Generally, this is meant to be a proxy for things like the ability to focus and typing skills. If you are close to the age specified, it's probably ok but feel free to ask if you're unsure. Adults are always welcome to join workshops - come learn with us!");
  });

  controller.hears(['Donate'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, 'You can donate using PayPal on [our website at](https://holyokecodes.org/about/get-involved/)  or mail a check made to MGHPCC and send it to 100 Bigelow St, Holyoke, MA 01040.');
  });
  
  controller.hears(['Nonprofit'], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, 'We are a 501(c)3 non-profit organization. Please contact us for our tax-exempt identification number.');
  });

  controller.hears(['Holyoke resident'],'message_received', hereIntent, function(bot, message) {
      const resp = "<p>Our workshops are open to everyone.</p>";
      bot.reply(message, resp);
  });

  controller.hears(['robotics'],'message_received', hereIntent, function(bot, message) {
    const resp = "<p>We regularly offer robotics workshops. We teach robotics with Lego WeDo and EV3 kits as well as occasionally with Arduino and Raspberry Pi robots. In addition to our robotics workshops, many people choose to work on robotics projects at Labs.</p><p>We also have several FIRST LEGO League teams that compete during the fall competition season. Come build with us!</p>";
    bot.reply(message, resp);
  });

  controller.hears(['html'],'message_received', hereIntent, function(bot, message) {
    const resp = "We teach how to build websites with HTML, CSS, and Javascript. Look for workshops on our calendar or come to a Lab. We also offer a summer program through HCC that includes HTML and other web languages.";
    bot.reply(message, resp);
  });

  controller.hears(['Workshop schedule'],'message_received', hereIntent, function(bot, message) {

    const url = 'https://holyokecodes.org/events';

    request(url, function(error, response, html){
      if(!error){
        var $ = cheerio.load(html);
        $('.events-table').filter(function(){
          var data = $(this).parent();
          const resp = "<p>Our workshops at the Massachusetts Green High Performance Computing Center (MGHPCC) are either on Wednesdays at 5:30 pm or Saturdays at 10:00 am.</p>";
          bot.reply(message, resp);
          bot.reply(message, data.html());
          bot.reply(message, {
            text: "Follow the links in the schedule for more details and free registration to let us know you're coming.",
            quick_replies: [
              {
                  title: 'Menu',
                  payload: 'Menu'
              },
              {
                  title: 'Find us',
                  payload: 'Where are you located?'
              },
              ]
              }, function() {}
          )
        })
      }
    })
  });
  controller.hears(['Summer programs'],'message_received', hereIntent, function(bot, message) {

    const url = 'https://holyokecodes.org/events/categories/summer-program/';

    request(url, function(error, response, html){
      if(!error){
          var $ = cheerio.load(html);
          $('.entry-content ul').filter(function(){
              var data = $(this);
              var resp = "<p>Our upcoming summer programs are:</p>" + data.html();
              bot.reply(message, resp);
          })
      }
    })
  });

  controller.hears(['thanks', 'thank you', 'thx', 'thankyou'], 'message_received', function(bot, message) {
    bot.reply(message, "You are welcome");
  });

  controller.hears(['goodbye', 'bye', 'later', 'good bye', 'seeya'], 'message_received', function(bot, message) {
    bot.reply(message, "Goodbye!");
  })

  controller.hears(['None', new RegExp('.*')], 'message_received', hereIntent, function(bot, message) {
    bot.reply(message, "I don't know how to reply to that. I'm always learning and hopefully I will know how to reply to that soon. Keep asking questions and help me learn!");
  })

}