// export const environment = {
//     apiUserUrl:'http://localhost:4000/user/',
//     apiServiceUrl:'http://localhost:4000/service/',
//     apiEventUrl:'http://localhost:4000/event/',
//     apiBookingUrl:'http://localhost:4000/booking/',
//     apiChatUrl:'http://localhost:4000/chat/',
//     serviceImgUrl:'http://localhost:4000/service/uploads/',
//     eventImgUrl:'http://localhost:4000/event/uploads/',
//     socketBackendUrl:'http://localhost:4000',
// };

export const environment = {
    production: false,
    apiUserUrl:'http://localhost:4000/api/user/',
    apiServiceUrl:'http://localhost:4000/api/service/',
    apiEventUrl:'http://localhost:4000/api/event/',
    apiBookingUrl:'http://localhost:4000/api/booking/',
    apiChatUrl:'http://localhost:4000/api/chat/',
    // serviceImgUrl:'http://localhost:4000/api/service/uploads/',
    // eventImgUrl:'http://localhost:4000/api/event/uploads/',
    socketBackendUrl:'http://localhost:4000',
    razorpayKeyId:'rzp_test_85xo26IPuPICSY',
    googleAuthUrl:'http://localhost:4000/api/user/auth/google'
};


// export const environment = {
//     // production: true,
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
//     socketBackendUrl: 'ws://localhost', 

//     googleAuthUrl:'/api/user/auth/google',
    
//     razorpayKeyId: 'rzp_test_85xo26IPuPICSY'
//   };

// export const environment = {
//     production: true,
//     // Use relative paths (proxied via Nginx)
//     apiUserUrl: 'http://localhost/api/user/',
//     apiServiceUrl: 'http://localhost/api/service/',
//     apiEventUrl: 'http://localhost/api/event/',
//     apiBookingUrl: 'http://localhost/api/booking/',
//     apiChatUrl: 'http://localhost/api/chat/',
    
//     // These should point to Nginx paths
//     serviceImgUrl: 'http://localhost/api/service/uploads/',
//     eventImgUrl: 'http://localhost/api/event/uploads/',
    
//     // WebSocket should use browser-accessible URL
//     // socketBackendUrl: 'ws://localhost', 
//     socketBackendUrl: 'ws://localhost/socket.io/',
  
//     googleAuthUrl:'http://localhost/api/user/auth/google',
    
//     razorpayKeyId: 'rzp_test_85xo26IPuPICSY'
//   };