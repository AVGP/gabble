var Xmpp = require('node-xmpp-client');

var ChatClient = function() {
  var client = new Xmpp({
      jid: 'martin@blah.geekonaut.de',
      password: 'T1i2j3a4l5s6'
  });

  client.on('online', function() {
      console.log('online');
  });

  client.on('stanza', function(stanza) {
      console.log('Incoming stanza: ', stanza.toString());
  });

  client.on('error', function(e) {
      console.error(e);
      process.exit(1);
  });
}

module.exports = new ChatClient();
