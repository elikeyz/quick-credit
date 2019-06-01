if (!localStorage.getItem('quick-credit-access-data')) {
  location.assign('./login.html');
}
const { token } = JSON.parse(localStorage.getItem('quick-credit-access-data'));

const apiGetFetch = url => fetch(`https://elikeyz-quick-credit.herokuapp.com/api/v1${url}`, {
  method: 'get',
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
}).then(response => response.json());

const apiFetch = (url, method, body = {}) => fetch(`https://elikeyz-quick-credit.herokuapp.com/api/v1${url}`, {
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(body),
  method,
}).then(response => response.json());
