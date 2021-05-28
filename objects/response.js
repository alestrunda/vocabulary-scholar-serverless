const headers = {
  "Access-Control-Allow-Origin": "https://vocabulary-scholar.netlify.app",
  "Content-Type": "application/json",
};

module.exports = {
  responseError: (message = "Service not available") => ({
    statusCode: 500,
    headers: { "Content-Type": "text/plain" },
    body: message,
  }),
  responseRedirect: (location) => ({
    statusCode: 301,
    headers: {
      ...headers,
      Location: location,
    },
  }),
  responseSuccess: (content) => ({
    statusCode: 200,
    body: JSON.stringify(content, null, 2),
    headers,
  }),
};
