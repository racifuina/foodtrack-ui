import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

//============ Set User Credentials =============*
let users = [
  { id: 1, password: 'hfkahfihciwciwehc', email: 'admin@admin.com', role: 'Admin', token: 'hfkahfihciwciwehc' }
];

//============ Initialize FakeBackend Function =============*
const fakeBackend = () => {
  var mockAdapt = new MockAdapter(axios);

  //============ Register Request =============*
  mockAdapt.onPost('/post-register').reply(function (config) {
    const user = JSON.parse(config['data']);
    users.push(user);
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve([200, user]);
      });
    });
  });

  //============ Login Request =============*
  mockAdapt.onPost('/post-login').reply(function (config) {
    const user = JSON.parse(config['data']);
    const validUser = users.filter(usr => usr.email === user.email && usr.password === user.password);
    
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (validUser['length'] === 1) {
          resolve([200, validUser[0]]);
        } else {
          reject([400, "Email or password is incorrect. Please enter correct email and password"]);
        }
      });
    });
  });

  //============ Forget Password Request =============*
  mockAdapt.onPost('/forget-pwd').reply(function (config) {
   return new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve([200, "Please Check your mail to reset your password."]);
    });
  });
 
  });

}

export default fakeBackend;