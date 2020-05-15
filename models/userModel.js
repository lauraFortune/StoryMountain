//=========================================================================================================================//
//                                                                                                                                                                                                                                                  //
//                                                                      SET UP                                                                                                                                                                     //
//                                                                                                                                                                                                                                                  //
//=========================================================================================================================//
const mongoose = require('mongoose');
const moment = require('moment'); // for date formatting
//=========================================================================================================================//
//                                                                                                                                                                                                                                                  //
//                                                                       USER SCHEMA - MONGOOSE                                                                                                                                   //
//                                                                                                                                                                                                                                                  //
//=========================================================================================================================//

const userSchema = new mongoose.Schema({
    story: [
        { //parent referencing - user id stored to reference so story knows which user it belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
        }
    ], 
    likedstories: [ // route  or functionality not in place yet 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story'
        }
    ],
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true //remove all white space before save
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String, //to reset password 
    resetTokenExpire: Date,
    image: {
        type: String,
        default: '_avatar.png' //placeholder image
    },
    admin: {
        type: Boolean,
        default: false //user must be manually set to admin inside MongoDB Atlas
    },
    about: {
        type: String,
        default: "Hey there! I'm using StoryMountain" //placeholder 
    },
    createdAt: {
        type: String,
        default: moment(Date.now()).format("MMM DD YYYY")
    }
}
);

const User = mongoose.model('User', userSchema);

module.exports = User;