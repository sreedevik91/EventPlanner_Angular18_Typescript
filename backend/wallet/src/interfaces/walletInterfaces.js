"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_RESPONSES = exports.CONTROLLER_RESPONSES = exports.HttpStatusCodes = void 0;
var HttpStatusCodes;
(function (HttpStatusCodes) {
    HttpStatusCodes[HttpStatusCodes["OK"] = 200] = "OK";
    HttpStatusCodes[HttpStatusCodes["CREATED"] = 201] = "CREATED";
    HttpStatusCodes[HttpStatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCodes[HttpStatusCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCodes[HttpStatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCodes[HttpStatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCodes[HttpStatusCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatusCodes || (exports.HttpStatusCodes = HttpStatusCodes = {}));
exports.CONTROLLER_RESPONSES = {
    commonError: 'Something went wrong.',
    internalServerError: 'Internal server error'
};
exports.SERVICE_RESPONSES = {
    commonError: 'Something went wrong.',
    addWalletSuccess: 'Wallet added successfully',
    addWalletError: 'Could not create wallet',
    fetchDataError: 'Fetching data failed. Try again.',
    deleteWalletSuccess: 'Wallet data deleted successfuly',
    deleteWalletError: 'Could not delete wallet data, Something went wrong',
    updateWalletSuccess: 'Wallet updated successfuly',
    updateWalletError: 'Could not updated wallet'
};
