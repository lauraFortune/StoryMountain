//=========================================================================================================================//
//                                                                                                                                                                                                                                                  //
//                                                                      SET UP                                                                                                                                                                     //
//                                                                                                                                                                                                                                                  //
//=========================================================================================================================//
const mongoose = require('mongoose');
const moment = require('moment'); // for date formatting
//=========================================================================================================================//
//                                                                                                                                                                                                                                                  //
//                                                                       STORIES SCHEMA - MONGOOSE                                                                                                                               //
//                                                                                                                                                                                                                                                  //
//=========================================================================================================================//
const storySchema = new mongoose.Schema({
    
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    likes: [ // route  or functionality not in place yet
        { //parent referencing - user id stored to reference so story knows which user has liked it
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
        type: String,
        default: moment(Date.now()).format("MMM DD YYYY") //moment.js
    },
    publish: { 
        type: Boolean,
        default: false //will only be true if user selects publish on their dashboard - at which point becomes visible in main gallery
    },
    title: {
        type: String,
        default: "Once Upon a Time..."
    },
    synopsis: {
        type: String,
        default: "Our story begins in....."
    },
    chapters: [ 
        {
            
            scenes: [
                {
                    _id: false,
                    title: {
                        type: String,
                        required: [true, 'A Scene must have a title']
                    } ,
                    image: String,
                    description:  {
                        type: String,
                        required: [true, 'A Scene must have a description']
                    },
                    prompt: String,
                    choices: [
                        {
                            _id: false,
                            text: String,
                            targetChapter: Number,
                            targetScene: Number
                        }
                    ]
                }
            ]
        }
    ]
}

)
// create story model - from the schema above
const Story = mongoose.model('Story', storySchema); 

module.exports = Story; //default exports