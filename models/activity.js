const mongoose = require('mongoose');

const activitySchema=new mongoose.Schema(
    {
        userId: {
          type:mongoose.Types.ObjectId,
          ref:'User'
        },
        name:{
           type: String,
           lowercase: true
        },
        serialNo: Number,
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        toObject: {
            transform: (obj, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
                return ret;
            }
        }
    },
);

module.exports = mongoose.model('Activity', activitySchema);