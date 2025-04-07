
// export const environment = {
//   production: true,
//   // Use relative paths (proxied via Nginx)
//   apiUserUrl: 'http://localhost/api/user/',
//   apiServiceUrl: 'http://localhost/api/service/',
//   apiEventUrl: 'http://localhost/api/event/',
//   apiBookingUrl: 'http://localhost/api/booking/',
//   apiChatUrl: 'http://localhost/api/chat/',
//   apiWalletUrl:'http://localhost/api/wallet/',
//   socketBackendUrl: 'http://localhost', 

//   googleAuthUrl:'http://localhost/api/user/auth/google',
  
//   razorpayKeyId: 'rzp_test_85xo26IPuPICSY'
// };

export const environment = {
  production: true,
  apiUserUrl: '/api/user/',
  apiServiceUrl: '/api/service/',
  apiEventUrl: '/api/event/',
  apiBookingUrl: '/api/booking/',
  apiChatUrl: '/api/chat/',
  apiWalletUrl: '/api/wallet/',
  socketBackendUrl: '/', // Relative path for WebSocket
  googleAuthUrl: '/api/user/auth/google',
  razorpayKeyId: 'rzp_live_<your_live_key>'
};