var Client = require('node-xmpp-client'),
    ltx    = require('ltx');

function getChatClient() {
  var self = {
    onOnline:  undefined,
    onMessage: undefined,
    onError:   undefined
  };

  // Some private methods
  function handleMsg(stanza) {
    console.log('Incoming stanza: ', stanza.toString());

    if (stanza.is('message') && (stanza.attrs.type !== 'error')) {
      if(self.onMessage) {
        self.onMessage({
          from: stanza.attrs.from,
          body: stanza.getChild('body').text()
        });
      }
    }
  }

  function setupClientHandlers(client) {
    client.on('online', function() {
      client.send('<presence/>');
      if(self.onOnline) self.onOnline();
    });
    client.on('stanza', handleMsg);
    client.on('error', function(e) {
      console.error(e);
      if(self.onError) self.onError(e);
    });
    process.on('exit', client.end);
  }

  // The external interface

  self.connect = function(user) {
    var client = new Client(user);
    setupClientHandlers(client);
  }

  return self;
}

module.exports = getChatClient();
