const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        method:{
            type:String,
            enum:['local','google','apple']
        },
        local:{
            email: {
                type: String,
                lowercase:true,
            },
            password:{
               type:String
            },
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
        toObject: {
            transform: (obj, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
                return obj;
            }
        }
    },
);

userSchema.pre("save", function (next) {
    if(this.method!='local'){
        next();
    }
    this.local.password = bcrypt.hashSync(this.local.password, bcrypt.genSaltSync(10));
    next();
});

userSchema.methods.compareHash = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);