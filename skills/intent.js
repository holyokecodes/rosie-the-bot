/*
module.exports = function(controller) {
controller.middleware.capture.use(function(bot, message, convo, next) {

    // user's raw response is in message.text

    // instead of capturing the raw response, let's capture the intent
    if (message.intent) {
        message.text = message.intent;
    }

    // what if there is a hidden payload? let's use that instead
    if (message.payload) {
        message.text = message.payload;
    }

    // what if there are entities too? we can use them as part of the conversation...
    if (message.entities) {
        for (var e = 0; e < message.entities.length; e++) {
            convo.setVar(message.entities[e].name, message.entities[e].value);
        }
      }

      // always call next!
      next();

  });
}
*/