var Client = require('node-xmpp-client'),
    ltx    = require('ltx');

function getChatClient() {
  var self = {
    onOnline:            undefined,
    onMessage:           undefined,
    onError:             undefined,
    onSubscribeRequest:  undefined
  };

  var client = null;

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
    } else if(stanza.is('presence')) {
      if(stanza.attrs.type == 'subscribe') {
        if(self.onSubscribeRequest) self.onSubscribeRequest(stanza.attrs.from);
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
    client = new Client(user);
    setupClientHandlers(client);
  }

  self.acceptPresenceSubscription = function(who) {
    client.send('<presence to="' + who + '" type="subscribed" />')
  }

  return self;
}

module.exports = getChatClient();
