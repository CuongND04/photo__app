/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
async function fetchModel(url) {
  const response = await fetch("http://localhost:8081" + url, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  let i = 1;

  const htt = {
    1: "hai",
  };
  const model = await response.json();
  return model;
}

export default fetchModel;
