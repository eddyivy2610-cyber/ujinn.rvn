exports.handler = async (event, context) => {
  const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
  const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

  if (!MAILERLITE_API_KEY) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: "Server configuration error: Missing API Key" }) 
    };
  }

  const path = event.queryStringParameters.path;
  if (!path) {
    return { statusCode: 400, body: JSON.stringify({ message: "Path parameter is required" }) };
  }

  if (!MAILERLITE_GROUP_ID && path.includes('{GROUP_ID}')) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server configuration error: Missing Group ID" })
    };
  }

  // Determine if it needs group ID replacement
  const targetPath = path.replace('{GROUP_ID}', MAILERLITE_GROUP_ID);
  
  // Reconstruct the Target URL
  let targetUrl = `https://connect.mailerlite.com/api/${targetPath}`;
  const urlObj = new URL(targetUrl);
  
  // Append other query parameters
  for (const ObjectKey of Object.keys(event.queryStringParameters)) {
    if (ObjectKey !== 'path') {
      urlObj.searchParams.append(ObjectKey, event.queryStringParameters[ObjectKey]);
    }
  }

  try {
    const options = {
      method: event.httpMethod,
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD' && event.body) {
      options.body = event.body;
    }

    const res = await fetch(urlObj.toString(), options);
    
    let data;
    if (res.status !== 204) {
      try {
        data = await res.json();
      } catch (e) {
        data = await res.text();
      }
    }

    return {
      statusCode: res.status,
      body: data ? (typeof data === 'string' ? data : JSON.stringify(data)) : ''
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message || "Internal Server Error" }) };
  }
};
