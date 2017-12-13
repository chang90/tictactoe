function mainGame() {
	gameState = "start";
	var resultArr = [];
	var placeHold = "?";
	initMap(resultArr, 3, 3, placeHold);
	clickEvent(resultArr, playerArr, placeHold);
	resetGame(resultArr,placeHold);
}

//init game map
function initMap(resultArr, row, column, placeHold) {
	var resultShow = document.querySelector(".game");
	// console.log(resultShow)
	//make map
	for (var i = 0; i < column; i++) {
		var tempArr = [];
		var tempResult = document.createElement("div");

		for (var j = 0; j < row; j++) {
			tempArr.push(placeHold);
			var newSpan = document.createElement("span");
			newSpan.textContent = placeHold;
			newSpan.id = i + '_' + j;
			tempResult.appendChild(newSpan);
		}
		resultArr.push(tempArr);
		resultShow.appendChild(tempResult);
	}
}

function clickEvent(resultArr, playerArr, placeHold) {
	var flag = 1;

	var methodClick = function(event) {
		var idArr = event.target.id.split("_");
		// console.log(resultArr)

		if (flag == 0) {
			flag = 1;
		} else {
			flag = 0;
		}

		if (resultArr[Number(idArr[0])][Number(idArr[1])] === placeHold) {
			event.target.textContent = playerArr[flag];
			resultArr[Number(idArr[0])][Number(idArr[1])] = playerArr[flag];
			event.target.style.backgroundColor = "pink";

			var winner = checkWin(resultArr, placeHold, methodClick);
			if (typeof(winner) === 'string') {
				winnerRecord.push(winner);
				gameState = "end";
				sideBarResult();
			}
		}
	}

	document.querySelectorAll('span').forEach(function(elem) {
		elem.addEventListener('click', methodClick)
	})

}

function checkWin(resultArr, placeHold, methodClick) {
	var winner = null;

	//for row same situation
	for (var i = 0; i < resultArr.length; i++) {

		if (resultArr[i][0] === resultArr[i][1] && resultArr[i][1] === resultArr[i][2] && resultArr[i][0] != placeHold) {
			// console.log(resultArr[i][0] + " win");
			winner = resultArr[i][0];
			for(var j = 0; j<3; j++){
				document.getElementById(i+"_"+j).classList.add("horizontalLine");
			}
		}
	}

	//for column same situation
	for (var i = 0; i < resultArr.length; i++) {
		if (resultArr[0][i] === resultArr[1][i] && resultArr[0][i] === resultArr[2][i] && resultArr[0][i] != placeHold) {
			// console.log(resultArr[0][i] + " win");
			winner = resultArr[0][i];
			for(var j = 0; j<3; j++){
				document.getElementById(j+"_"+i).classList.add("verticalLine");
			}
		}
	}
  //for slash situation
	if (resultArr[0][0] === resultArr[1][1] && resultArr[0][0] === resultArr[2][2] && resultArr[0][0] != placeHold) {
		// console.log(resultArr[0][0] + " win");
		winner = resultArr[0][0];
			for(var j = 0; j<3; j++){
			document.getElementById(j+"_"+j).classList.add("backslash");
		}	

	}

	if (resultArr[0][2] === resultArr[1][1] && resultArr[0][2] === resultArr[2][0] && resultArr[0][2] != placeHold) {
		// console.log(resultArr[0][2] + " win");
		winner = resultArr[0][2];
		for(var j = 0; j<3; j++){
				document.getElementById(j+"_"+(2-j)).classList.add("slash");
			}		
	}

	if (typeof winner === 'string') {
		document.querySelectorAll('span').forEach(function(elem) {
			elem.removeEventListener('click', methodClick);
		})
	} else {
		var isEmptyArr = resultArr.join().split(",").filter(value => value === placeHold);
		if (isEmptyArr.length === 0) {
			winner = "tie";
		}
	}
	// if (winner != "tie") {
	// 	console.log(winner + " win");
	// } else {
	// 	console.log("tie");
	// }
	return winner;
}

function sideBarResult() {
	var recordList = document.querySelector(".recordList");
	recordList.innerHTML = "";
	winnerRecord.forEach(
		function(element, index) {
    	console.log(element);
    	var newRecord = document.createElement("div");
    	newRecord.textContent =  index+1 +" Round Winner: "+element;
    	recordList.appendChild(newRecord)
    })
	// document.querySelector(".recordList").textContent = winnerRecord;
}

function resetGame(resultArr,placeHold) {
	var reset = document.createElement("button");
	reset.textContent = "reset";
	reset.addEventListener("click", function(){resetFunc(resultArr,placeHold);});
	document.querySelector(".buttonBox").appendChild(reset);
}

function resetFunc(resultArr,placeHold) {
	// if the game is incomplete
	if(gameState ==="start"){
		var winner = null;
		var totalStep = resultArr.join().split(",").filter(value => value != placeHold).length;
		// debugger
		if(totalStep%2 === 0){
			winner = playerArr[1];
		}else{
			winner = playerArr[0];
		}
		winnerRecord.push(winner);
		gameState = "end";
		sideBarResult();

	}
	//remove the game
	document.querySelector('.game').innerHTML = '';
	document.querySelector('.buttonBox').innerHTML = '';

	mainGame();
}


var winnerRecord = [];
// var gameState = "start";
var playerArr = ["X", "Y"];
mainGame();
// resetGame();