import { RegisterInput, LoginInput, LoginResponse } from './types';

const API_URL = 'https://lakes-slow-lists-nutten.trycloudflare.com/graphql';

export const registerUser = async (input: RegisterInput) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        mutation Register($username: String!, $email: String!, $password: String!, $phone: String, $referralCode: String) {
          register(username: $username, email: $email, password: $password, phone: $phone, referralCode: $referralCode) {
            id
            email
            username
          }
        }
      `,
      variables: input
    })
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.register;
};

export const loginUser = async (input: LoginInput): Promise<LoginResponse> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        mutation Login($email: String!, $password: String!, $twoFACode: String) {
          login(email: $email, password: $password, twoFACode: $twoFACode) {
            token
            user {
              id
              email
              username
              emailVerified
              twoFAEnabled
            }
          }
        }
      `,
      variables: input
    })
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.login;
};