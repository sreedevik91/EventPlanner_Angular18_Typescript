// export const environment = {
//     production: true,
//     apiUserUrl: 'http://api-gateway:4000/api/user/', // Use Docker service names
//     apiServiceUrl: 'http://api-gateway:4000/api/service/',
//     apiEventUrl: 'http://api-gateway:4000/api/event/',
//     apiBookingUrl: 'http://api-gateway:4000/api/booking/',
//     apiChatUrl: 'http://api-gateway:4000/api/chat/',
//     serviceImgUrl: 'http://api-gateway:4000/api/service/uploads/',
//     eventImgUrl: 'http://api-gateway:4000/api/event/uploads/',
//     socketBackendUrl: 'http://api-gateway:4000',
//     razorpayKeyId: 'rzp_test_85xo26IPuPICSY'
// };


// export const environment = {
//     production: true,
//     // Use relative paths (proxied via Nginx)
//     apiUserUrl: '/api/user/',
//     apiServiceUrl: '/api/service/',
//     apiEventUrl: '/api/event/',
//     apiBookingUrl: '/api/booking/',
//     apiChatUrl: '/api/chat/',
    
//     // These should point to Nginx paths
//     serviceImgUrl: '/api/service/uploads/',
//     eventImgUrl: '/api/event/uploads/',
    
//     // WebSocket should use browser-accessible URL
//     // socketBackendUrl: 'ws://localhost', 
//     socketBackendUrl: 'ws://localhost/socket.io/',

//     googleAuthUrl:'/api/user/auth/google',
    
//     razorpayKeyId: 'rzp_test_85xo26IPuPICSY'
//   };

export const environment = {
  production: true,
  // Use relative paths (proxied via Nginx)
  apiUserUrl: 'http://localhost/api/user/',
  apiServiceUrl: 'http://localhost/api/service/',
  apiEventUrl: 'http://localhost/api/event/',
  apiBookingUrl: 'http://localhost/api/booking/',
  apiChatUrl: 'http://localhost/api/chat/',
  
  // These should point to Nginx paths
  serviceImgUrl: 'http://localhost/api/service/uploads/',
  eventImgUrl: 'http://localhost/api/event/uploads/',
  
  // WebSocket should use browser-accessible URL
  // socketBackendUrl: 'ws://localhost', 
  socketBackendUrl: 'ws://localhost/socket.io/',

  googleAuthUrl:'http://localhost/api/user/auth/google',
  
  razorpayKeyId: 'rzp_test_85xo26IPuPICSY'
};


