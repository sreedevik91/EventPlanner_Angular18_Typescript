
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

// export const environment = {
//   production: true,
//   apiUserUrl: 'https://dreamevents.shop/api/user/',
//   apiServiceUrl: 'https://dreamevents.shop/api/service/',
//   apiEventUrl: 'https://dreamevents.shop/api/event/',
//   apiBookingUrl: 'https://dreamevents.shop/api/booking/',
//   apiChatUrl: 'https://dreamevents.shop/api/chat/',
//   apiWalletUrl: 'https://dreamevents.shop/api/wallet/',
//   socketBackendUrl: 'https://dreamevents.shop/', // Relative path for WebSocket
//   googleAuthUrl: 'https://dreamevents.shop/api/user/auth/google',
//   razorpayKeyId: 'rzp_live_<your_live_key>'
// };