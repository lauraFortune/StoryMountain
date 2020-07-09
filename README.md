
# <img src="https://user-images.githubusercontent.com/48602973/74787675-a9341400-52a7-11ea-83ec-7fb9adc21713.png" width="60">  StoryMountain 

[storymountain.herokuapp.com](https://storymountain.herokuapp.com/)



Full CRUD Web application/tool designed to allow users to create:
- Branching narrative fiction
- Educational / Presentation slides or instructions
- Simple text adventure style games

This end of year project(Dec 2019) takes the form of a website database, which  is entirely UGC(User Generated Content) driven. A simple interface provides an unobtrusive canvas for the UGC, while ‘Progressive Disclosure’ techniques have been employed throughout, to ensure a good User Experience (UX).
<br>

## Built With

#### Server Side:
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [EJS](https://ejs.co)
- [MongoDB Atlas](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com)

#### Modules/Middleware:
- [Passport.js](http://www.passportjs.org/), &nbsp;[Bcrypt.js](https://www.npmjs.com/package/bcryptjs), &nbsp;[Helmet](https://www.npmjs.com/package/helmet), &nbsp; [express-fileupload](https://www.npmjs.com/package/express-fileupload), &nbsp; [Nodemailer](https://www.npmjs.com/package/nodemailer)

#### Languages:
- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript),  &nbsp; [jQuery](https://jquery.com), &nbsp; [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5), &nbsp; [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)


## Demos 

- Create an account & Password reset
[![login](https://user-images.githubusercontent.com/48602973/74594555-d1194280-502f-11ea-993d-0e15976e1680.png)](https://youtu.be/M65T6nCV3J8)

- Create a ‘Story’ (user-created interactive content) - builds live on screen inside a story viewer. Changes made within the editor are instantly reflected in the view. 
[![create_a_story](https://user-images.githubusercontent.com/48602973/74594556-d70f2380-502f-11ea-98fb-0c0e19009fe9.png)](https://youtu.be/VTrTGc2JiT4)

- Publish/Unpublish and Browse 'Stories'
[![publish_browse](https://user-images.githubusercontent.com/48602973/74594561-de363180-502f-11ea-8b42-bee12ca617d2.png)](https://youtu.be/fq1SHmnzz64)

- Admin privileges & functionality
[![admin_privileges](https://user-images.githubusercontent.com/48602973/74594566-e2fae580-502f-11ea-96bc-b7dca672df0c.png)](https://youtu.be/7lz0Dd19cvI)


## Setting Up

### NodeJs
1. Download and install NodeJs - https://nodejs.org/en/

### MongoDB Atlas

You don't have a mongoDB account....
   1. Navigate to mongoDB Atlas and sign up for a free account - https://www.mongodb.com/cloud/atlas/register
   2. Select 'CREATE A CLUSTER' ( choose the FREE cluster option )

You have a mongoDB account...
   
   1. Whitelist your ip address
      - Select Network Access and choose to 'Add IP ADDRESS'
      - You can select 'ADD CURRENT IP ADDRESS' for local development or 'ALLOW ACCESS FROM ANYWHERE' to allow any address to connect.
      
   2. Create a database
      - Select 'CLUSTERS' and choose 'COLLECTIONS'
      - Select 'CREATE DATABASE' - you will be prompted to enter the following infromation:<br>
            1. Database Name - Name of your choice<br>
            2. Collection Name - Enter 'stories' (case sensitive)
   3. Select 'CLUSTERS' and choose 'CONNECT' - next choose 'Connect your Application'.
   4. Select Node.js Version 3.0 or later.
   5. You can copy and save your connection string. Don't forget to replace '< password >' with the password you chose when creating your cluster.
   
### Gmail

If connecting your gmail account for nodemailer you must 'enable less secure apps access' inside security settings.<br>


## Running the application in your local environment

1. Clone project 

   ```bash
   git clone https://github.com/lauraFortune/StoryMountain.git
   ```
2. Create a .env file based on the .env.example

3. Run app

   ```bash
   node app.js
   ```
   
4. Open http://localhost:3000 to view it in your browser.<br>

## Acknowledgments
- Ian Schoonover - [Node JS Password Reset Walkthrough](https://www.youtube.com/watch?v=UV9FvlTySGg)
- Traversy Media - [Node.js With Passport Authentication](https://www.youtube.com/watch?v=6FOq4cUdH8k)




































