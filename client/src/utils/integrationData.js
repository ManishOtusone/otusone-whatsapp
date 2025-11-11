export const codeSnippets = {
    curl: `curl -X POST \\
  'https://otusone-whatsapp.onrender.com/api/v1/otusone/intigration/send-message' \\
  -H 'x-api-key:  "YOUR_API_KEY"}' \\
  -H 'x-api-secret: YOUR_API_SECRET' \\
  -H 'Content-Type: application/json' \\
  -d '{
      recipientNumber: "+1234567890",
      templateName: "welcome_message",
      languageCode:"en_US",
      bodyVariables: ["Narendra Singh"],
      headerImageUrl: "https://www.shutterstock.com/image-photo/world-hydrography-day-celebrated-on-260nw-2465381505.jpg"
  }'`,

    javascript: `const sendMessage = async () => {
  const response = await fetch('https://otusone-whatsapp.onrender.com/api/v1/otusone/intigration/send-message', {
    method: 'POST',
    headers: {
      'x-api-key': ' "YOUR_API_KEY"}',
      'x-api-secret': 'YOUR_API_SECRET',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipientNumber: "+1234567890",
      templateName: "welcome_message",
      languageCode:"en_US",
      bodyVariables: ["Narendra Singh"],
      headerImageUrl: "https://www.shutterstock.com/image-photo/world-hydrography-day-celebrated-on-260nw-2465381505.jpg"
      })
  });
  const data = await response.json();
  console.log(data);
};`,

    python: `import requests

url = "https://otusone-whatsapp.onrender.com/api/v1/otusone/intigration/send-message"
headers = {
    "x-api-key": "YOUR_API_KEY",
    "x-api-secret": "YOUR_API_SECRET",
    "Content-Type": "application/json"
}
data = {
     recipientNumber: "+1234567890",
      templateName: "welcome_message",
      languageCode:"en_US",
      bodyVariables: ["Narendra Singh"],
      headerImageUrl: "https://www.shutterstock.com/image-photo/world-hydrography-day-celebrated-on-260nw-2465381505.jpg"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,

    php: `<?php
$url = 'https://otusone-whatsapp.onrender.com/api/v1/otusone/intigration/send-message';
$data = [
    'recipientNumber' => '+1234567890',
    'templateName' => 'welcome_message',
    'languageCode' => 'en_US',
    'bodyVariables' => ["Narendra Singh"],
    'headerImageUrl' => 'https://www.shutterstock.com/image-photo/world-hydrography-day-celebrated-on-260nw-2465381505.jpg'
];

$options = [
    'http' => [
        'header' =>
            "x-api-key: YOUR_API_KEY\\r\\n" .
            "x-api-secret: YOUR_API_SECRET\\r\\n" .
            "Content-Type: application/json\\r\\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo $result;
?>`
};


//   {
//       "recipientNumber":"+919454197886",
//       "templateName":"environment_day",
//       "languageCode":"en_US",
//       "bodyVariables": ["Narendra Singh"],
//       "headerImageUrl": "https://www.shutterstock.com/image-photo/world-hydrography-day-celebrated-on-260nw-2465381505.jpg"
//     }