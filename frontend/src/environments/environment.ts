
export const environment = {
  production: true,
  // Use relative paths (proxied via Nginx)
  apiUserUrl: 'http://localhost/api/user/',
  apiServiceUrl: 'http://localhost/api/service/',
  apiEventUrl: 'http://localhost/api/event/',
  apiBookingUrl: 'http://localhost/api/booking/',
  apiChatUrl: 'http://localhost/api/chat/',
  apiWalletUrl:'http://localhost/api/wallet/',
  socketBackendUrl: 'http://localhost', 

  googleAuthUrl:'http://localhost/api/user/auth/google',
  
  razorpayKeyId: 'rzp_test_85xo26IPuPICSY'
};


// export const environment = {
//   production: true,
//   apiUserUrl: 'https://devents-frontend-nginx.azurewebsites.net/api/user/',
//   apiServiceUrl: 'https://devents-frontend-nginx.azurewebsites.net/api/service/',
//   apiEventUrl: 'https://devents-frontend-nginx.azurewebsites.net/api/event/',
//   apiBookingUrl: 'https://devents-frontend-nginx.azurewebsites.net/api/booking/',
//   apiChatUrl: 'https://devents-frontend-nginx.azurewebsites.net/api/chat/',
//   apiWalletUrl: 'https://devents-frontend-nginx.azurewebsites.net/api/wallet/',
//   socketBackendUrl: 'https://devents-frontend-nginx.azurewebsites.net', 
//   // socketBackendUrl: 'https://devents-chat-service.azurewebsites.net',
//   googleAuthUrl: 'https://devents-frontend-nginx.azurewebsites.net/api/user/auth/google',
//   razorpayKeyId: 'rzp_test_85xo26IPuPICSY'
// };