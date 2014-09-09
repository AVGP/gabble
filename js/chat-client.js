var Client = require('node-xmpp-client'),
    ltx    = require('ltx');

var client = new Client({
    jid: 'gabbler@jabb3r.org',
    password: 'v31xxj'
});

client.on('online', function() {
    console.log('online');
    client.send('<presence/>');
});

client.on('stanza', function(stanza) {
    console.log('Incoming stanza: ', stanza.toString());

    if (stanza.is('message') && (stanza.attrs.type !== 'error')) {
      stanza.attrs.to = stanza.attrs.from;
      delete stanza.attrs.from;
      console.log("MSG: " + stanza.getChild("body").text());
      console.log('Sending response: ' + stanza.root().toString());
      client.send(stanza);
    }
});

client.on('error', function(e) {
    console.error(e);
//    process.exit(1);
});

process.on('exit', function () {
    client.end();
});
