//this script builds the story viewer (left hand side of dash and modal view on main gallery page)
//=====================================================================================//
//                                                                                                                                                                          //
//                                                                  SCENE BUILDER FUNCTION                                                                   //
//                                                                                                                                                                          //
//=====================================================================================//
function sceneBuilder(chapterNum, sceneNum){//builds html and populates with json - taking two parameters: chapter and scene

        storyViewer.innerHTML = ""; //clear screen on each rebuild - otherwise func keeps adding to what is on screen

         //--------------- build scene description -----------------//
        var storyTitle = document.createElement("p");
        storyTitle.setAttribute("class", "storyTitle");
        storyTitle.innerHTML = story.title;
        storyViewer.appendChild(storyTitle);
        //--------------------------------------------------------//
        //--------------------- build scene title -------------------//
         var title = document.createElement("p");
         title.setAttribute("class", "sceneTitle");
         title.innerHTML = story.chapters[chapterNum].scenes[sceneNum].title;
         storyViewer.appendChild(title);
         //--------------------------------------------------------//

        //--------------------- build scene image ----------------//
         var image = document.createElement("img");
         image.setAttribute("src", "../../" + story.chapters[chapterNum].scenes[sceneNum].image);
         image.setAttribute("id","storyImage");

         storyViewer.appendChild(image);
         //--------------------------------------------------------//

        //--------------- build scene description -----------------//
         var description = document.createElement("p");
         description.setAttribute("class", "description");
         description.innerHTML = story.chapters[chapterNum].scenes[sceneNum].description;
         storyViewer.appendChild(description);
        //--------------------------------------------------------//

        //------------------- build scene prompt ----------------//
         var prompt = document.createElement("p");
         prompt.setAttribute("class", "prompt");
         prompt.innerHTML = story.chapters[chapterNum].scenes[sceneNum].prompt;
         storyViewer.appendChild(prompt);
        //--------------------------------------------------------//

        //--------------- build buttons container ----------------//
         var buttonsContainer = document.createElement("div");
         buttonsContainer.setAttribute("id", "buttonsContainer");
         storyViewer.appendChild(buttonsContainer);
        //--------------------------------------------------------//

        //---------------------------------------------------------------------//
        //                          BUILD CHOICE BUTTONS                               //                                                                                        
        //--------------------------------------------------------------------//     
        var choices = story.chapters[chapterNum].scenes[sceneNum].choices;  

        for(var i = 0; i < choices.length; i++) { //loop through current scenes choices array 

            var button = document.createElement("button"); // 1. create a button
            button.innerHTML = choices[i].text; // 2. set button text = choice's text
            button.setAttribute("id", "choiceButton_" + i); // 3. set id of button
            button.setAttribute("class", "storyViewerButton");           
            var targetChapter = choices[i].targetChapter; // 4. get the target chapter from choice 
            var targetScene = choices[i].targetScene; // 5. get the target scene from choice 
            button.setAttribute("onclick", "updateCurrentChapter_CurrentScene(" + targetChapter + ", " + targetScene + ")"); // 6. function called on click - take choices targetChapter and targetScene as params
            buttonsContainer.appendChild(button); // 7. add button to the button container
            
         }
        
    };
//========================================= END ========================================//        






   
    
   