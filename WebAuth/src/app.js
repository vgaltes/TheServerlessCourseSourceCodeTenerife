import Amplify, { Auth, API } from 'aws-amplify';

Amplify.configure({
    Auth: {
        // REQUIRED - Amazon Cognito Region
        region: 'eu-west-1',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'eu-west-1_ApTctgVuR',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '37ej5ldfmsnfr2k8amdec91k98',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false
    },
    API: {
        endpoints: [
            {
                name: "MyAPIGatewayAPI",
                endpoint: "https://u59efuwmsh.execute-api.eu-west-1.amazonaws.com"
            }
        ]
    }
});

const SignUpButton = document.getElementById('SignUpButton');
const SignInButton = document.getElementById('SignInButton');
const ConfirmUserButton = document.getElementById('ConfirmUserButton');
const LogOutButton = document.getElementById('LogOutButton');
const UserLoggedInSpan = document.getElementById('UserLoggedIn');
const ResendVerificationEmailButton = document.getElementById('ResendVerificationEmail');
const RequestToSecuredEndpointButton = document.getElementById('RequestToSecuredEndpointButton');
const RequestToNonSecuredEndpointButton = document.getElementById('RequestToNonSecuredEndpointButton');

SignUpButton.addEventListener('click', async (evt) => {
  const email = document.getElementById('SignUpEmail').value;
  const password = document.getElementById('SignUpPassword').value;

  await Auth.signUp({
    username: email,
    password
    })
    .then(data => {
      console.log(data);
    })
    .catch(err => console.log(err));
});

SignInButton.addEventListener('click', async (evt) => {
  const username = document.getElementById('SignInLogin').value;
  const password = document.getElementById('SignInPassword').value;

  console.log(`Username: ${username}, Password: ${password}`);

  await SignIn(username, password);
});

ConfirmUserButton.addEventListener('click', async (evt) => {
  const username = document.getElementById('ConfirmationCodeUser').value;
  const code = document.getElementById('ConfirmationCodeCode').value;

  await Auth.confirmSignUp(username, code).then(data => console.log(data))
    .catch(err => console.log(err));
});

ResendVerificationEmailButton.addEventListener('click', async (evt) => {
  await Auth.verifyCurrentUserAttribute('email')
  .then(() => {
      console.log('a verification code is sent');
  }).catch((e) => {
      console.log('failed with error', e);
  });
});

LogOutButton.addEventListener('click', async (evt) => {
  await Auth.signOut()
    .then(data => {
      console.log(data);
      refreshAuthenticatedUserInfo();
    })
    .catch(err => console.log(err));
});

RequestToSecuredEndpointButton.addEventListener('click', async evt => {
  let myInit = { 
    headers: { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
}
  await API.get("MyAPIGatewayAPI", '/devvgaltes/api/getTogethers', myInit).then(response => {
      console.log(response);
  }).catch(error => {
      console.log(JSON.stringify(error))
  });
});

RequestToNonSecuredEndpointButton.addEventListener('click', async evt => {
  await API.get("MyAPIGatewayAPI", '/devvgaltes/api/testAutoSubscribe').then(response => {
    console.log(response);
  }).catch(error => {
      console.log(JSON.stringify(error))
  });
});

async function SignIn(username, password) {
  try {
      const user = await Auth.signIn(username, password);
      console.log(user);
      refreshAuthenticatedUserInfo();      
  } catch (err) {
    console.log("Error!" + JSON.stringify(err));
    if (err.code === 'UserNotConfirmedException') {
          // The error happens if the user didn't finish the confirmation step when signing up
          // In this case you need to resend the code and confirm the user
          // About how to resend the code and confirm the user, please check the signUp part
      } else if (err.code === 'PasswordResetRequiredException') {
          // The error happens when the password is reset in the Cognito console
          // In this case you need to call forgotPassword to reset the password
          // Please check the Forgot Password part.
      } else if (err.code === 'NotAuthorizedException') {
          // The error happens when the incorrect password is provided
      } else if (err.code === 'UserNotFoundException') {
          // The error happens when the supplied username/email does not exist in the Cognito user pool
      } else {
          console.log(err);
      }
  }
}

let refreshAuthenticatedUserInfo = () => {
  Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
  }).then(user => {
    console.log(user);
    UserLoggedInSpan.innerText = user.attributes["email"]
  })
  .catch(err => {
    UserLoggedInSpan.innerText = '';
    console.log(err)
  });
}

refreshAuthenticatedUserInfo();
