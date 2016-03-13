var translationEle = document.getElementById("translation");
var check = false;
var delayCheck = true;
var delayCheck2 = true;
var myWindow;

function closeWindow()
{
	setTimeout(function()
	{
		window.close();
	},500);
}

function openWin(sourceLink){
	
	if (check == true){
		myWindow.close();
	}

	delayCheck = false;
	myWindow = window.open(sourceLink);

	setTimeout(function(){
		closeWin();
	},2000);
	setTimeout(function(){
		delayCheck = true;
	},3500);

	if (check == false){
		check = true;
	}
}

function closeWin(){
	myWindow.close();
}

function playAudio(fileName){
	if(delayCheck2){
		var audio = new Audio(fileName);
   		audio.play();
   		delayCheck2 = false;
   		delayCheck = false;
   		setTimeout(function(){
		delayCheck2 = true;
	},2000);
   		setTimeout(function(){
		delayCheck = true;
	},1500);
	}
	
}
	

function displayToTranslationBox(translation){
    document.getElementById('translation-result').innerHTML = translation;
    if (!changeLanguage){
    if (translation == "Yes"){
    	playAudio("public/yes.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/1711.mp3");//
    }
    if (translation == "Good"){
    	playAudio("public/good.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/1710.mp3");//
    }
    if (translation == "Okay"){
    	playAudio("public/ok.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/1723.mp3");//
    }
    if (translation == "No, Sorry"){
    	playAudio("public/no.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/1715.mp3");//
    }
    if (translation == "Correct"){
    	playAudio("public/correct.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/1721.mp3");
    }/*
    if (translation == "Two"){
    	openWin("http://howjsay.com/pronounciation-of-two");
    }*/
	}

	else{
		if (translation == "Yes"){
			playAudio("public/oui.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/22326.mp3");//
    }
    if (translation == "Good"){
    	playAudio("public/marvel.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/22138.mp3");//
    }
    if (translation == "Okay"){
    	playAudio("public/bien.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/11890.mp3");//
    }
    if (translation == "No, Sorry"){
    	playAudio("public/pasbien.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/11891.mp3");//
    }
    if (translation == "Correct"){
    	playAudio("public/correct.mp3");
    	//openWin("http://s1download-universal-soundbank.com/mp3/sounds/1721.mp3");
    }/*
    if (translation == "Two"){
    	openWin("http://howjsay.com/pronounciation-of-two");
    }*/
	}
}


function translationSetup(frame){
if(delayCheck == true)
{
	var fingerPositions = [];
	var fingerCount = 0;

	var fingerObject = null;
	var fingerType = null;
	var handType = null;

	var handGrabStrength = null;

	// Name of each finger and bones
	var fingerTypeMap = ["Thumb", "Index finger", "Middle finger", "Ring finger", "Pinky finger"];
	var boneTypeMap = ["Metacarpal", "Proximal phalanx", "Intermediate phalanx", "Distal phalanx"];

	for(var h = 0; h < frame.hands.length; h++){
		if(frame.hands[h] !== undefined){
			handGrabStrength = frame.hands[h].grabStrength.toPrecision(2);

			// Loop through fingers
			for(var f = 0; f < frame.hands[h].fingers.length; f++){

				fingerObject = frame.hands[h].fingers[f];
				handType = frame.hands[h].type.toString();
				fingerType = fingerTypeMap[f];

				if(fingerObject.extended){
					fingerCount++;
				}

				fingerPositions[f] = convertFingerPositionsIntoXYZ(fingerObject.stabilizedTipPosition, handType, fingerType);

			}
		}
	}
	attemptTranslation(fingerPositions, fingerCount, handGrabStrength);
}
}

function convertFingerPositionsIntoXYZ(positions, hand, finger){
	var x = parseInt(positions[0]);
	var y = parseInt(positions[1]);
	var z = parseInt(positions[2]);

	return {
		hand, finger, x, y, z

		};
}

function attemptTranslation(fingerPositions, fingersExtended, handGrabStrength){
	var translationResult = "No Sign Detected";
	var fingerData = fingerPositions;

	var extendedFingers = fingersExtended;
	var grabStrength = parseFloat(handGrabStrength);

	// Sign Data
	var signObject  = null;
	var signName = "";
	var signExtendedFingers = "";
	var signPosition = null;
	var signTranslationWord = "";

	var requiredExtendedFingerCount = null;
	

	// Use if a fingers needs a position 
	var requiredFingers = null;

	var requiredPositions = {
		x: 0,
		y: 0,
		z: 0,
	};

	var xData = [];
	var yData = [];
	var zData = [];

	for(var s = 0; s < signArray.signs.length; s++){
		signObject = signArray.signs[s];

		signName = signObject.name;
		signExtendedFingers = signObject.extendedFingers;
		signPosition = signObject.position;
		signTranslationWord = signObject.translation;
		
		if(signExtendedFingers !== null && signPosition !== null){
			requiredFingers = signPosition.fingers.split(',');
			for(var i = 0; i < fingerPositions.length; i++){
				for(var f = 0; f < requiredFingers.length; f++){
					if(requiredFingers[f] === fingerPositions[i].finger){
						xData[f] = fingerPositions[i].x;				
						yData[f] = fingerPositions[i].y;
						zData[f] = fingerPositions[i].z;	
					}
				}
			}

			var dist = calculateDistanceBetweenTwoPoints3D(xData, yData, zData);
			console.log(dist);
		}
		
		if(signExtendedFingers != null && signPosition === null){
			if(parseInt(signExtendedFingers) === extendedFingers && grabStrength === 0.0){
				translationResult = signTranslationWord;
				
			}
		}

		if (signExtendedFingers === null && signPosition != null)
		{				
			requiredFingers = signPosition.fingers.split(',');
			requiredPositions.x = signPosition.position.x;
			requiredPositions.y = signPosition.position.y;
			requiredPositions.z = signPosition.position.z;

			var requiredDis = Math.sqrt(Math.pow(requiredPositions.x, 2) + Math.pow(requiredPositions.y, 2) + Math.pow(requiredPositions.z, 2));

			for(var i = 0; i < fingerPositions.length; i++){
				for(var f = 0; f < requiredFingers.length; f++){
					if(requiredFingers[f] === fingerPositions[i].finger){
						xData[f] = fingerPositions[i].x;				
						yData[f] = fingerPositions[i].y;
						zData[f] = fingerPositions[i].z;	
					}
				}
			}
			var dist = calculateDistanceBetweenTwoPoints3D(xData, yData, zData);

			// Handles Pinching motions
			if(dist <= requiredDis && grabStrength <= 0.200){
				translationResult = signTranslationWord;
			}
		}
		
		if(signExtendedFingers === null && signPosition === null){
			// Check for a fist
			if(grabStrength === 1.0){
				translationResult = signTranslationWord;	
			} 
		}

		// Checks if the sign is making the sign "Good". 
		if(signExtendedFingers === 1 && signPosition != null){
			requiredFingers = signPosition.fingers.split(',');

			console.log(requiredFingers);
			if(grabStrength === 1 && extendedFingers === 1){
				translationResult = signTranslationWord;
			}
		}
	}
	var prevTranslationResult = "";

	if (translationResult != prevTranslationResult)
	{
		prevTranslationResult = translationResult;
		displayToTranslationBox(translationResult);
	}
	
}


// Only supports two points at presents
// Returns the distance between two points in a 3d space
function calculateDistanceBetweenTwoPoints3D(x,y,z){
	var x = x[1] - x[0];
	var y = y[1] - y[0];
	var z = z[1] - z[0];

	var dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
	return dist;
}