//this script builds the story editor (right hand side of dash)

///get updated by dropdown values changing and choice buttons clicking
var currentChapter = 0;
var currentScene = 0;

//tabs
var storyChapterEditor = document.getElementById("storyChapterEditor");
var storySceneEditor = document.getElementById("storySceneEditor");
var storyMediaEditor = document.getElementById("storyMediaEditor");

//=====================================================================================//
//                                                                                                                                                                          //
//                                                                  EDITOR BUILDER FUNCTION                                                                 //
//                                                                                                                                                                          //
//=====================================================================================//
function editorbuilder(){

    //storyEditor.innerHTML = ""; // clear panel on rebuild
    storyChapterEditor.innerHTML = "";
    storySceneEditor.innerHTML = "";

    var storyTitleInput = document.getElementById("storyTitleInput");
    var storySynopsisInput = document.getElementById("storySynopsisInput");

    storyTitleInput.value = story.title;
    storySynopsisInput.value = story.synopsis;

    var hr = document.createElement("hr");

    //-------------------------------------------------------------------------------------------------------//
    //                                                      BUILDING MAIN DROPDOWNS                                         //                                                                                        
    //------------------------------------------------------------------------------------------------------//

    var editorControls = document.getElementById("editorControls");
    var chapterSceneControls = document.getElementById("chapterSceneControls");
    chapterSceneControls.innerHTML = "";

    //-------------- build chapter dropdown-------------------//

    var chapterLabelDropdown = document.createElement("div");
    chapterLabelDropdown.setAttribute("class", "chapterLabelDropdown");
    chapterSceneControls.append(chapterLabelDropdown);

    var chapterLabel = document.createElement("label"); 
    chapterLabel.setAttribute("class","chapterSceneControlsLabel");
    chapterLabel.innerHTML = "Select Chapter";
    chapterLabelDropdown.appendChild(chapterLabel);
    
    var chapterDropdown = document.createElement("select");
    chapterDropdown.setAttribute("id", "chapterDropdown");
    chapterDropdown.setAttribute("class","storyChapterDropdown");
    chapterDropdown.setAttribute("onchange", "updateCurrentChapter(); repopulateSceneDropdown();"); 
    chapterLabelDropdown.appendChild(chapterDropdown);  
    //--------------------------------------------------------//

    //--------------populate chapter dropdown---------------//
    var chapterCount = story.chapters.length; //amount of chapters 
        for(var i = 0; i < chapterCount; i++) {  
            var chapterDropdownOption = document.createElement("option"); // 1. create <option> element
            chapterDropdown.appendChild(chapterDropdownOption); // 2. append <option> elmement to dropdown menu
            // chapterDropdownOption.innerHTML= i; // 3. set <option> element innerHtml to a number( i )
            chapterDropdownOption.innerHTML= "Chapter: " + (1 + i);
        }
    chapterDropdown.selectedIndex = currentChapter;
    //--------------------------------------------------------//

    //-------------build scene dropdown---------------------//

    var sceneLabelDropdown = document.createElement("div");
    sceneLabelDropdown.setAttribute("class", "sceneLabelDropdown");
    chapterSceneControls.append(sceneLabelDropdown);

    var sceneLabel = document.createElement("label"); 
    sceneLabel.setAttribute("class","chapterSceneControlsLabel");
    sceneLabel.innerHTML = "Select Scene";
    //storyEditor.appendChild(sceneLabel);
    sceneLabelDropdown.appendChild(sceneLabel);

    var sceneDropdown = document.createElement("select");
    sceneDropdown.setAttribute("id", "sceneDropdown");
    sceneDropdown.setAttribute("class","storySceneDropdown");
    sceneDropdown.setAttribute("onchange", "updateCurrentScene();");
    //storyEditor.appendChild(sceneDropdown);
    sceneLabelDropdown.appendChild(sceneDropdown);
    //----------------------------------------------------------//

    //--------------populate scene dropdown------------------//
    var sceneCount = story.chapters[currentChapter].scenes.length;
        for (var i = 0; i < sceneCount; i++){
            var sceneDropdownOption = document.createElement("option");
            sceneDropdown.appendChild(sceneDropdownOption);
            var sceneTitle = story.chapters[currentChapter].scenes[i].title;
            sceneDropdownOption.innerHTML = sceneTitle;
        }
    sceneDropdown.selectedIndex = currentScene;
    //----------------------------------------------------------//

    //-------------------------------------------------------------------------------------------------------//
    //                                                      BUILDING FORM                                                            //                                                                                        
    //------------------------------------------------------------------------------------------------------//

    //--------------- build form element ----------------------//
    var form = document.createElement("form");   
    storySceneEditor.appendChild(form);
    //----------------------------------------------------------//

    //--------------- build form heading ----------------------//
    var formHeading = document.createElement("p");
    formHeading.innerHTML= "EDIT YOUR SCENE";
    form.appendChild(formHeading);
    //---------------------------------------------------------//

    //------------- add HR Divider  ------------//
    form.appendChild(hr.cloneNode());
    //--------------------------------------------------------//  

    //--------------- build input *title  -----------------------//
    var titleLabel = document.createElement("label"); 
    titleLabel.innerHTML = "Title";
    form.appendChild(titleLabel);
    // title="Letters, numbers, #, !, ' and spaces(at least one letter or number)" required pattern="[A-Za-z0-9 #_]*[A-Za-z0-9][A-Za-z0-9 #!'_]*$" 
    var titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("id", "titleInput");
    titleInput.setAttribute("class","storyEditorInput");
    titleInput.setAttribute("oninput", "updateJson(), updateSelectedScene()");
    // titleInput.setAttribute("pattern", "[A-Za-z0-9 #_]*[A-Za-z0-9][A-Za-z0-9 #!?.-'_]*$");
    titleInput.value = story.chapters[currentChapter].scenes[currentScene].title;
    titleLabel.appendChild(titleInput); 
    //---------------------------------------------------------//

    //------------- add HR Divider  ------------//
    form.appendChild(hr.cloneNode());
    //--------------------------------------------------------//   

    //--------------- build input *image  ---------------------//
    var imageLabel = document.createElement("image");
    imageLabel.innerHTML = "Image: ";
    form.appendChild(imageLabel);

    var imageInput = document.createElement("input");
    imageInput.setAttribute("type", "text"); 
    imageInput.setAttribute("id", "imageInput");
    imageInput.setAttribute("oninput", "updateJson()"); 
    imageInput.setAttribute("class","storyEditorInput");
    imageInput.value = story.chapters[currentChapter].scenes[currentScene].image;
    imageLabel.appendChild(imageInput);
    //---------------------------------------------------------//

    //------------- add HR Divider  ------------//
    form.appendChild(hr.cloneNode());
    //--------------------------------------------------------//   

    //--------------- build input *description  ----------------//
    var descriptionLabel = document.createElement("label");
    descriptionLabel.innerHTML = "Description: ";
    form.appendChild(descriptionLabel);
   
    var descriptionInput = document.createElement("textarea");
    descriptionInput.setAttribute("cols", "30");
    descriptionInput.setAttribute("rows", "10");
    descriptionInput.setAttribute("id", "descriptionInput");
    descriptionInput.setAttribute("oninput", "updateJson()");
    descriptionInput.setAttribute("class","storyEditorInput");
    descriptionInput.value = story.chapters[currentChapter].scenes[currentScene].description;
    descriptionLabel.appendChild(descriptionInput); 
    //---------------------------------------------------------//

    //------------- add HR Divider  ------------//
    form.appendChild(hr.cloneNode());
    //--------------------------------------------------------//   

    //--------------- build input *prompt  -------------------//
    var promptLabel = document.createElement("label"); 
    promptLabel.innerHTML = "Prompt: ";
    form.appendChild(promptLabel);
    
    var promptInput = document.createElement("input");
    promptInput.setAttribute("type", "text");
    promptInput.setAttribute("id", "promptInput");
    promptInput.setAttribute("oninput", "updateJson()");
    promptInput.setAttribute("class","storyEditorInput");
    promptInput.value = story.chapters[currentChapter].scenes[currentScene].prompt;
    promptLabel.appendChild(promptInput); 
    //---------------------------------------------------------//

    //------------- add HR Divider  ------------//
    form.appendChild(hr.cloneNode());
    //--------------------------------------------------------//   

    //-------------------------------------------------------------------------------------------------------//
    //                                                      BUILDING CHOICES                                                        //                                                                                        
    //------------------------------------------------------------------------------------------------------//

    //--------------- build choices container  ----------------//
    var choicesContainer = document.createElement("div");
    storySceneEditor.appendChild(choicesContainer);
    //---------------------------------------------------------//

    var choices = story.chapters[currentChapter].scenes[currentScene].choices; // holds all of the choices for the current selected scene
    
    //-----------------------------------------------------------//
    //                          build a choice                                 //                                                                                        
    //-----------------------------------------------------------// 


    for ( var i = 0; i < choices.length; i++) { 

        var choiceBox = document.createElement("div");
        choiceBox.setAttribute("class", "choiceBox");
        choicesContainer.appendChild(choiceBox);

        var choiceInputLabel = document.createElement("label");
        choiceInputLabel.innerHTML = "<br><br>" + "Choice : " + (i + 1) + "<br><br>"; 
        choiceInputLabel.setAttribute("class", "choiceLabel");
        choiceBox.appendChild(choiceInputLabel); 

        //--------- build target scene image ------------//
        var targetImage = document.createElement("img");
        targetImage.setAttribute("id", "targetImage_" + i);
        targetImage.setAttribute("class", "targetImage");
        var targetChapter = choices[i].targetChapter;
        var targetScene = choices[i].targetScene;
        console.log("TargetChapter: " + targetChapter + ", TargetScene: " + targetScene);
        targetImage.setAttribute("src", "../../" + story.chapters[targetChapter].scenes[targetScene].image);
        targetImage.setAttribute("width", "250px");
        targetImage.setAttribute("height", "140px");
        choiceBox.append(targetImage);        
        //---------------------------------------------------------//

        //--------- build target chapter dropdown  ------------//
        var targetSelectorChapter = document.createElement("div");
        targetSelectorChapter.setAttribute("class", "targetSelector");
        choiceBox.append(targetSelectorChapter);

        var targetChapterLabel = document.createElement("label");
        targetChapterLabel.innerHTML = "Target Chapter : ";
        targetSelectorChapter.appendChild(targetChapterLabel);
       
        var targetChapterDropdown = document.createElement("select");
        targetChapterDropdown.setAttribute("id", "targetChapterDropdown_" + i );
        targetChapterDropdown.setAttribute("class", "targetChapterDropdown");
        targetChapterDropdown.setAttribute("onchange", "repopulateTargetSceneDropdown(" + i + "); updateJsonTargetChapterTargetScene(" + i + ")"); 
        targetSelectorChapter.appendChild(targetChapterDropdown);
        //---------------------------------------------------------//

        //--------- populate target chapter dropdown  -----------//
        chapterCount = story.chapters.length; // amount of chapters in story json

            for(var j = 0; j < chapterCount; j++) { 
                var targetChapterDropdownOption = document.createElement("option"); 
                targetChapterDropdown.appendChild(targetChapterDropdownOption); 
                targetChapterDropdownOption.innerHTML= "Chapter: " + ( j + 1 ); 
            }
        targetChapterDropdown.setAttribute("value", choices[i].targetChapter);// = choices[i].targetChapter;
        console.log("Target Chapter:" + choices[i].targetChapter);
        //---------------------------------------------------------//
       
        //--------- build target scene dropdown  ------------//
        var targetSelectorScene = document.createElement("div");
        targetSelectorScene.setAttribute("class", "targetSelector");
        choiceBox.append(targetSelectorScene);

        var targetSceneLabel = document.createElement("label");
        targetSceneLabel.innerHTML = "Target Scene : ";
        targetSelectorScene.appendChild(targetSceneLabel);
        
        var targetSceneDropdown = document.createElement("select");
        targetSceneDropdown.setAttribute("id", "targetSceneDropdown_" + i );
        targetSceneDropdown.setAttribute("class", "targetSceneDropdown");
        targetSceneDropdown.setAttribute("onchange", "updateJsonTargetChapterTargetScene(" + i + ")"); 
        targetSelectorScene.appendChild(targetSceneDropdown);
        //---------------------------------------------------------//

        //--------- populate target scene dropdown  -----------//
        var targetChapter = choices[i].targetChapter;

        sceneCount = story.chapters[targetChapter].scenes.length;

        for (var x = 0; x < sceneCount; x++){
            var targetSceneDropdownOption = document.createElement("option");
            targetSceneDropdown.appendChild(targetSceneDropdownOption);
            var targetScene = choices[i].targetScene;
            var targetSceneTitle = story.chapters[targetChapter].scenes[x].title;
            targetSceneDropdownOption.innerHTML = targetSceneTitle;
        }
        targetSceneDropdown.setAttribute("value", choices[i].targetScene); //= choices[i].targetScene;
        targetSceneDropdown.selectedIndex = choices[i].targetScene;
        console.log("Target Scene:" + choices[i].targetScene);
        //-------------------------------------------------------//
        
        //--------------- build input *choice  ----------------//
        
        var choiceInput = document.createElement("input"); 
        choiceInput.value = choices[0].text;
        choiceInput.setAttribute("type", "text");
        choiceInput.setAttribute("id", "choiceInput_" + i); 
        choiceInput.setAttribute("oninput", "updateJsonChoiceText(" + i + ")");
        choiceInput.setAttribute("class","storyEditorChoiceInput");
        choiceInput.value = choices[i].text;       
        console.log(choices[i].text);
        choiceBox.appendChild(choiceInput);

        //---------------------------------------------------------//


        //------------- build deleteChoiceButton  ------------//
        var deleteChoiceButton = document.createElement("button"); 
        deleteChoiceButton.innerHTML = "Delete Choice";
        deleteChoiceButton.setAttribute("class", "deleteChoiceButton");
        deleteChoiceButton.setAttribute("onclick", "deleteChoice("+ i + ")");
        choiceBox.append(deleteChoiceButton);
        //-------------------------------------------------------//

    } //---------------- end choices for loop -----------------//

    //------------- build addChoiceButton  ------------//
    var addChoiceButton = document.createElement("button");
    addChoiceButton.innerHTML ="ADD <br> CHOICE";
    addChoiceButton.setAttribute("onclick", "addChoice()");
    addChoiceButton.setAttribute("class", "addChoiceButton");
    choicesContainer.appendChild(addChoiceButton);
    //-------------------------------------------------------//

                //Populate Storyboard Tab                
                for(var chapter = 0; chapter < story.chapters.length; chapter++) {

                    var chapterHolder = document.createElement("div");
                    chapterHolder.setAttribute("class","chapterHolder");
                    storyChapterEditor.append(chapterHolder);

                    var deleteChapterButton = document.createElement("button"); 
                    deleteChapterButton.innerHTML = "&#8722";
                    deleteChapterButton.setAttribute("class","removeChapterScene");
                    deleteChapterButton.setAttribute("title", "Delete Chapter?");
                    deleteChapterButton.setAttribute("onclick", "deleteChapter(" + chapter + ")");
                    chapterHolder.appendChild(deleteChapterButton);

                    var chapterHolderTitle = document.createElement("p");
                    chapterHolderTitle.setAttribute("class","chapterHolderTitle");
                    chapterHolderTitle.innerHTML = "Chapter: " + (chapter + 1);
                    chapterHolder.append(chapterHolderTitle);

                    var chapterHolderSceneCount = document.createElement("p");
                    chapterHolderSceneCount.setAttribute("class","chapterHolderSceneCount");
                    chapterHolderSceneCount.innerHTML = "Scenes: " + story.chapters[chapter].scenes.length;
                    chapterHolder.append(chapterHolderSceneCount);
                    

                    for(var scene = 0; scene < story.chapters[chapter].scenes.length; scene++) {

                        var sceneHolder = document.createElement("div");
                        sceneHolder.setAttribute("class","sceneHolder");
                        chapterHolder.append(sceneHolder);

                        var deleteSceneButton = document.createElement("button"); 
                        deleteSceneButton.innerHTML ="&#8722";
                        deleteSceneButton.setAttribute("class","removeChapterScene");
                        deleteSceneButton.setAttribute("title", "Delete Scene?");
                        deleteSceneButton.setAttribute("onclick", "deleteScene("+ chapter + "," + scene + ")");
                        sceneHolder.appendChild(deleteSceneButton);

                        var sceneImage = document.createElement("img");
                        sceneImage.setAttribute("src","../../" + story.chapters[chapter].scenes[scene].image);
                        sceneImage.setAttribute("class","chapterHolderSceneImage");
                        sceneHolder.append(sceneImage);

                        var sceneTitle = document.createElement("p");
                        sceneTitle.setAttribute("class","chapterHolderSceneTitle");
                        sceneTitle.innerHTML = "Scene: " + story.chapters[chapter].scenes[scene].title;
                        sceneHolder.append(sceneTitle);
                        
                    }
                    
                    var addSceneButton = document.createElement("button"); 
                    addSceneButton.innerHTML ="&#43";
                    addSceneButton.setAttribute("class","addChapterScene");
                    addSceneButton.setAttribute("title", "Add Scene?");
                    addSceneButton.setAttribute("onclick", "addScene(" + chapter + ")");
                    chapterHolder.appendChild(addSceneButton);

                }

                var chapterHolder = document.createElement("div");
                chapterHolder.setAttribute("class","chapterHolder");
                storyChapterEditor.append(chapterHolder);

                var addChapterButton = document.createElement("button"); 
                addChapterButton.innerHTML = "&#43";
                addChapterButton.setAttribute("class","addChapterScene");
                addChapterButton.setAttribute("title", "Add Chapter?");
                addChapterButton.setAttribute("onclick", "addChapter()");
                chapterHolder.appendChild(addChapterButton);

                var chapterHolderTitle = document.createElement("p");
                chapterHolderTitle.setAttribute("class","chapterHolderTitle");
                chapterHolderTitle.innerHTML = "New Chapter?";
                chapterHolder.append(chapterHolderTitle);
    
 }   
//========================================= END ========================================// 

///=====================================================================================//                                                                                                                                                                         //
//                                                                                                                                                                           //            
//                                                        REPOPULATE MAIN SCENE DROPDOWN FUNCTION                                              //
//                                         -scene drop down gets repopulated dependent on chapter dropdown value -                           //
//=====================================================================================//
 
   function repopulateSceneDropdown(){ //called onchange of chapter Dropdown value
    
        var sceneDropdown = document.getElementById("sceneDropdown");
        var chapterDropdown = document.getElementById("chapterDropdown");
        sceneDropdown.innerHTML = ""; //clear each time function runs - otherwise keeps appending scene numbers
        var sceneCount = story.chapters[chapterDropdown.selectedIndex].scenes.length; // value from dropdown - amount of scenes in the selected chapter
        
        for (var i = 0; i < sceneCount; i ++) { // i < smaller than length of chapters array
            var sceneDropdownOption = document.createElement("option"); // 1. create <option> element
            sceneDropdown.appendChild(sceneDropdownOption); // 2. append <option> elmement to dropdown menu
            
            var sceneTitle = story.chapters[chapterDropdown.selectedIndex].scenes[i].title;
            
            sceneDropdownOption.innerHTML = sceneTitle; // 3. set <option> element innerHtml to a number( i )
        } 
    }
//========================================= END ========================================//                                                                                                                                                           //

///=====================================================================================//
//                                                                                                                                                                          //
//                                                       REPOPULATE TARGET SCENE DROPDOWN FUNCTION                                           //
//                           - target scene drop down gets repopulated dependent on target chapter dropdown value-                      //
//=====================================================================================//
   function repopulateTargetSceneDropdown(id){ //called onchange of target chapter Dropdown value

        console.log("Doing id: " + id);
        var targetChapterDropdown = document.getElementById("targetChapterDropdown_" + id);
        var targetSceneDropdown = document.getElementById("targetSceneDropdown_" + id);
        var targetImage = document.getElementById("targetImage_" + id);
        targetSceneDropdown.innerHTML = ""; //clear each time function runs - otherwise keeps appending scene numbers
        console.log("Doing chapter: " + targetChapterDropdown.selectedIndex);
        var targetSceneCount = story.chapters[targetChapterDropdown.selectedIndex].scenes.length; // value from dropdown - amount of scenes in the selected chapter
        var targetChapter = targetChapterDropdown.selectedIndex;
        
        
        for (var z = 0; z < targetSceneCount; z++) { 
            var targetSceneDropdownOption = document.createElement("option"); // 1. create <option> element
            targetSceneDropdown.appendChild(targetSceneDropdownOption); // 2. append <option> elmement to dropdown menu
            var targetSceneTitle = story.chapters[targetChapter].scenes[z].title;
            targetSceneDropdownOption.innerHTML = targetSceneTitle;
        }
        
        targetImage.setAttribute("src", "../../" + story.chapters[targetChapter].scenes[targetSceneDropdown.selectedIndex].image);

    }
//========================================= END =========================================//

///=====================================================================================//
//                                                                                                                                                                           //
//                                                       UPDATE JSON FUNCTION                                                                                  //
//                                     -updates the story json with new values from the input boxes-                                                  //
//=====================================================================================//
function updateJson(){ //called onchange - when user types into form inputs
    //STORY INPUTS    
    story.title = document.getElementById("storyTitleInput").value; // 1. update the json's title with new input value
    story.synopsis = document.getElementById("storySynopsisInput").value;// 2. update the json's image with new input value
    
    //SCENE INPUTS
    story.chapters[currentChapter].scenes[currentScene].title = document.getElementById("titleInput").value; // 1. update the json's title with new input value
    story.chapters[currentChapter].scenes[currentScene].image = document.getElementById("imageInput").value;// 2. update the json's image with new input value
    story.chapters[currentChapter].scenes[currentScene].description = document.getElementById("descriptionInput").value; // 3. update the json's description with new input value
    story.chapters[currentChapter].scenes[currentScene].prompt = document.getElementById("promptInput").value;  // 4. update the json's prompt with new input value
    //5. json is now updated within the browser but needs to be updated on the screen
    sceneBuilder(currentChapter,currentScene); //call sceneBuilder to update the changes the json in the display panel
}
//========================================= END =========================================//

///=====================================================================================//
//                                                                                                                                                                           //
//                                                       UPDATE JSON CHOICE TEXT FUNCTION                                                              //
//                                     -updates the story json's choice text - with new values from the input boxes-                             //
//=====================================================================================//
function updateJsonChoiceText(id) {
    var choiceInput = document.getElementById("choiceInput_" + id); // 1. gets choice input by id(id is added to choice input on creation)
    var choiceButton = document.getElementById("choiceButton_" + id); // 2. gets choice button by id
    story.chapters[currentChapter].scenes[currentScene].choices[id].text = choiceInput.value; // 3. update json with current choice input value
    choiceButton.innerHTML = story.chapters[currentChapter].scenes[currentScene].choices[id].text; // 4. update choice button with jsons new choice value
    sceneBuilder(currentChapter,currentScene); 
}
//========================================= END =========================================//

///=====================================================================================//
//                                                                                                                                                                           //
//                                                   UPDATE JSON CHOICE TARGET CHAPTER & TARGET SCENE                                       //
//                                     -updates the story json's choice text - with new values from the input boxes-                             //
//=====================================================================================//
function updateJsonTargetChapterTargetScene(id) {
    var targetChapter = document.getElementById("targetChapterDropdown_" + id); 
    var targetScene = document.getElementById("targetSceneDropdown_" + id);
    var targetImage = document.getElementById("targetImage_" + id); 
    story.chapters[currentChapter].scenes[currentScene].choices[id].targetChapter = targetChapter.selectedIndex;
    story.chapters[currentChapter].scenes[currentScene].choices[id].targetScene = targetScene.selectedIndex;
    console.log("UPDATED TARGETS", story.chapters[currentChapter].scenes[currentScene].choices);
    targetImage.setAttribute("src", "../../" + story.chapters[targetChapter.selectedIndex].scenes[targetScene.selectedIndex].image);
    sceneBuilder(currentChapter,currentScene);
}
//========================================= END =========================================//

///=====================================================================================//
//                                                                                                                                                                           //
//                                                           DELETE CHOICE FUNCTION                                                                          //
//                                                                                                                                                                          //
//=====================================================================================//
function deleteChoice(id){
    var choicesArray = story.chapters[currentChapter].scenes[currentScene].choices;
    choicesArray.splice(id, 1);
    console.log("DELETED CHOICE " + id );
    sceneBuilder(currentChapter,currentScene);
    editorbuilder();
}
//========================================= END =========================================//
///=====================================================================================//
//                                                                                                                                                                           //
//                                                           ADD CHOICE FUNCTION                                                                         //
//                                                                                                                                                                          //
//=====================================================================================//
function addChoice(id){
    var choicesArray = story.chapters[currentChapter].scenes[currentScene].choices;
    choicesArray.push({
                                "text" : "Enter new choice here....",
                                "targetChapter" : "0",
                                "targetScene" : "0"
                            });
    console.log(choicesArray);
    sceneBuilder(currentChapter,currentScene);
    editorbuilder();
    
}
//========================================= END =========================================//
///=====================================================================================//
//                                                                                                                                                                           //
//                                                           DELETE SCENE FUNCTION                                                                            //
//                                                                                                                                                                          //
//=====================================================================================//
function deleteScene(targetChapter, targetScene){

    /*
    The loop below checks to see if there are more than one scene to delete because chapters must have at least one scene - otherwise causes error
    then every choice of every scene of every chapter must be checked to make sure it doesn't target the scene that is being deleted
    if the choice does target the scene being deleted, the choice is deleted
    if the choice targets a scene with a greater index number than the scene being deleted, its target index number is reduced by 1
    */

    if(story.chapters[targetChapter].scenes.length > 1) {

        for(var chapter = 0; chapter < story.chapters.length; chapter++) {
            for(var scene = 0; scene < story.chapters[chapter].scenes.length; scene++) {
                for(var choice = 0; choice < story.chapters[chapter].scenes[scene].choices.length; choice++) {
                    var choiceObject = story.chapters[chapter].scenes[scene].choices[choice];
                    if(choiceObject.targetChapter == targetChapter && choiceObject.targetScene == targetScene) {
                        deleteChoice(choice);
                    } else if(choiceObject.targetChapter == targetChapter && choiceObject.targetScene > targetScene) {
                        story.chapters[chapter].scenes[scene].choices[choice].targetScene--;
                        console.log("%cAdjusted choice: " + choice + " of scene: " + scene + " in chapter: " + chapter, 'background: #222; color: #bada55');
                    }
                }
            }                    
        }
// this removes the scene from the target chapter
        var scenesArray = story.chapters[targetChapter].scenes;
        scenesArray.splice(targetScene, 1);
        currentScene = scenesArray.length - 1;
        sceneBuilder(currentChapter,currentScene);
        editorbuilder();
    } else {

        showPopupMessage("You can't delete the last scene from a chapter!");

    }
    
}
//========================================= END =========================================//
///=====================================================================================//
//                                                                                                                                                                           //
//                                                           ADD SCENE FUNCTION                                                                                 //
//                                                                                                                                                                          //
//=====================================================================================//
function addScene(chapter){
   
   var scenesArray = story.chapters[chapter].scenes;
   var sceneNumber = scenesArray.length;

        scenesArray.push({ //greenland
            "title": "New Scene",
            "image": "_placeholder.png",
            "description": "Please enter a description.....",
            "prompt": "Enter a prompt for the reader....",
            "choices" : [
                {
                    "text" : "Choice",
                    "targetChapter" : 0,
                    "targetScene" : 0
                }
            ]
            
        });

    currentChapter = chapter;    
    currentScene = sceneNumber;

    sceneBuilder(currentChapter,currentScene);
    editorbuilder();
}
//========================================= END =========================================//

///=====================================================================================//
//                                                                                                                                                                           //
//                                                           ADD CHAPTER FUNCTION                                                                                 //
//                                                                                                                                                                          //
//=====================================================================================//
function addChapter(){
   
    var chaptersArray = story.chapters;
    var chapterNumber = chaptersArray.length;
    chaptersArray.push(
                                    { 
                                        "scenes" : [

                                            {
                                                "title": "New Scene",
                                                "image": "_placeholder.png",
                                                "description": "Please enter a description.....",
                                                "prompt": "Enter a prompt for the reader....",
                                                "choices" : [
                                                    {
                                                        "text" : "Choice",
                                                        "targetChapter" : "0",
                                                        "targetScene" : "0"
                                                    }
                                                ]
                                                
                                            }

                                        ]
                                    }
                            );
     sceneBuilder(currentChapter,currentScene);
     editorbuilder();
 }
 //========================================= END =========================================//
 
///=====================================================================================//
//                                                                                                                                                                           //
//                                                           DELETE CHAPTER FUNCTION                                                                            //
//                                                                                                                                                                          //
//=====================================================================================//
function deleteChapter(chapter){
    var chaptersArray = story.chapters;
    chaptersArray.splice(chapter, 1);
    console.log(chaptersArray);

    //if statements - need to do this with builder functions - so page is built according to new criteria

    currentChapter= chaptersArray.length - 1;
    currentScene = 0;
    sceneBuilder(currentChapter,currentScene);
    editorbuilder();
    console.log(story.chapters);
}
//========================================= END =========================================//

///=====================================================================================//
//                                                                                                                                                                           //
//                                              UPDATE VALUES AND REBUILD PAGE FUNCTIONS                                                          //
//           - current chapter & current scene variables are updated then editor and scene are rebuilt using new values-             //
//=====================================================================================//
//-------------------------------------------------------------------------------------------------------//
//                  UPDATE CURRENT CHAPTER & CURRENT SCENE FUNCTION                                      //                                                                                        
 //------------------------------------------------------------------------------------------------------//
function updateCurrentChapter_CurrentScene(chapter, scene){ //called when click a button in display panel to change scene
    currentChapter = chapter; 
    currentScene = scene;
    editorbuilder();
    sceneBuilder(currentChapter,currentScene);   
}
//-------------------------------------------------------------------------------------------------------//
//                  UPDATE CURRENT CHAPTER FUNCTION                                                                 //                                                                                        
 //------------------------------------------------------------------------------------------------------//
function updateCurrentChapter(){ //called when change chapter value in main drop down
    currentChapter = chapterDropdown.selectedIndex;
    currentScene = 0;
    editorbuilder();
    sceneBuilder(currentChapter,currentScene);
}
//-------------------------------------------------------------------------------------------------------//
//                  UPDATE CURRENT SCENE FUNCTION                                                                     //                                                                                        
 //------------------------------------------------------------------------------------------------------//
function updateCurrentScene(){ //called when change scene value in main drop down
    currentScene  = sceneDropdown.selectedIndex; 
    editorbuilder();
    sceneBuilder(currentChapter,currentScene);
}
//========================================= END =========================================//
//-------------------------------------------------------------------------------------------------------//
//                  SAVE JSON FUNCTION                                                                                         //                                                                                        
 //------------------------------------------------------------------------------------------------------//
 function saveJson() { //is called onclick of submit Json button

    console.log("here");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xmlhttp.response);
            showPopupMessage("Story Saved");
            
       }
    };
    xmlhttp.open("PUT", baseUrl + "/saveJson");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send( JSON.stringify(story) );
}
//-------------------------------------------------------------------------------------------------------//

var userImages = [];

function loadUserImages() { //is called onclick of submit Json button

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xmlhttp.response);
            userImages = JSON.parse(xmlhttp.response);
            buildImageGallery();
            showPopupMessage("User Images Loaded");            
       }
    };
    xmlhttp.open("POST", baseUrl + "/getMedia");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send();
}

function buildImageGallery() {
    var storyMediaEditor = document.getElementById("userMediaGallery");
    storyMediaEditor.innerHTML = "";
    for(var i = 0; i < userImages.length; i++) {
        console.log("Adding Image:" + userImages[i]);
        var image = document.createElement("img");
        image.setAttribute("src", "../../" + userImages[i]);
        image.setAttribute("title", userImages[i]);
        image.setAttribute("onclick", "updateSceneImage(" + i + ")");
        //image.setAttribute("class", "targetImage");
        image.setAttribute("class", "userMediaGallery-Brick");
        var card = document.createElement('div');
        card.setAttribute("class", "card");
        card.append(image);
        storyMediaEditor.append(card);
    }

}

function updateSceneImage(imageID){
    console.log(userImages[imageID]);
    document.getElementById("storyImage").setAttribute("src", "../../" + userImages[imageID]); //update story viewer image
    document.getElementById("imageInput").value = userImages[imageID]; //update image input value
    story.chapters[currentChapter].scenes[currentScene].image = userImages[imageID]; //update json
    editorbuilder(); //rebuild the editor to update choice images
}
                          
function updateSelectedScene() {

    var titleInput = document.getElementById("titleInput");
    var sceneDropdown = document.getElementById("sceneDropdown");
    sceneDropdown.options[sceneDropdown.selectedIndex].innerHTML = titleInput.value;

}

loadUserImages(); //loads users gallery on page load (media upload area)

// these two functions run the whole story editor page - by setting the scene using current chap and current scene and updating everytime a change is made
sceneBuilder(currentChapter, currentScene); // called on page load - values will be 0 , 0
editorbuilder(); //called on page load


