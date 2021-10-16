/* eslint-disable*/

import axios from 'axios';
import { showAlert } from './alerts';
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      //   alert('logged in succesfully');
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // alert(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      //this is important to be true so it will be a reload from the server and not from the browser cache
      location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again!');
  }
};

// export default login;

// console.log('hello login');

// document.getElementById('email').addEventListener('click', (e) => {
//   e.preventDefault();

//   console.log(document.getElementById('email').value);
// });
