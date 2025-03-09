export const environment = {
    production: true,
    apiUserUrl: 'http://api-gateway:4000/api/user/', // Use Docker service names
    apiServiceUrl: 'http://api-gateway:4000/api/service/',
    apiEventUrl: 'http://api-gateway:4000/api/event/',
    apiBookingUrl: 'http://api-gateway:4000/api/booking/',
    apiChatUrl: 'http://api-gateway:4000/api/chat/',
    serviceImgUrl: 'http://api-gateway:4000/api/service/uploads/',
    eventImgUrl: 'http://api-gateway:4000/api/event/uploads/',
    socketBackendUrl: 'http://api-gateway:4000',
    razorpayKeyId: 'rzp_test_85xo26IPuPICSY'
};
