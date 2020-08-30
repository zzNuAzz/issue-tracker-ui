/* eslint "no-alert": "off" */
import fetch from 'isomorphic-fetch';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

export default async function graphQLFetch(
  query,
  variables = {},
  showError = null,
  cookie = null
) {
  // eslint-disable-next-line no-undef
  const apiEndpoint = __isBrowser__
    ? window.ENV.UI_API_ENDPOINT
    : process.env.UI_SERVER_API_ENDPOINT;

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (cookie) headers.cookie = cookie;
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const body = await res.text();
    const result = await JSON.parse(body, jsonDateReviver);
    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        showError && showError(`${error.message}:\n ${details}`);
      } else {
        showError && showError(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    showError && showError(`Error in sending data to server: ${e.message}`);
    return null;
  }
}
