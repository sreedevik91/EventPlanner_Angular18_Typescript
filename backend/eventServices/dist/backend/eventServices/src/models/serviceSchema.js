"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ServiceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    events: [{
            type: String,
            required: true
        }],
    provider: {
        type: String,
        required: true
    },
    choices: [{
            choiceName: {
                type: String
            },
            choiceType: {
                type: String
            },
            choicePrice: {
                type: Number
            },
            choiceImg: {
                type: String
            }
        }],
    isApproved: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// const ServiceSchema: Schema<IService> = new Schema<IService>({
//   name: {
//     type: String,
//     required: true
//   },
//   events: [{
//     type: String,
//     required: true
//   }],
//   provider: {
//     type: String,
//     required: true
//   },
//   choices: [{                                           
//     choiceName: {
//       type: String
//     },
//     choiceType: {
//       type: String
//     },
//     choicePrice: {
//       type: Number
//     }
//   }],
//   isApproved: {
//     type: Boolean,
//     default: false
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// },
//   {
//     timestamps: true
//   }
// );
const Service = (0, mongoose_1.model)('service', ServiceSchema);
exports.default = Service;
