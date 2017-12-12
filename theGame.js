var winnerRecord = [];

function mainGame() {
	var resultArr = [];
	var placeHold = "?";
	initMap(resultArr, 3, 3, placeHold);
	var playerArr = ["X", "Y"];
	clickEvent(resultArr, playerArr, placeHold);

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
			newSpan.id = i + ' ' + j;
			tempResult.appendChild(newSpan);
		}
		resultArr.push(tempArr);
		resultShow.appendChild(tempResult);
	}
}

function clickEvent(resultArr, playerArr, placeHold) {
	var flag = 1;

	var methodClick = function(event) {
		var idArr = event.target.id.split(" ");
		console.log(resultArr)

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
			}
		}

	}

	document.querySelectorAll('span').forEach(function(elem) {
		elem.addEventListener('click', methodClick)
	})

}

function checkWin(resultArr, placeHold, methodClick) {
	//for row same situation
	for (var i = 0; i < resultArr.length; i++) {

		var winner = null;
		if (resultArr[i][0] === resultArr[i][1] && resultArr[i][1] === resultArr[i][2] && resultArr[i][0] != placeHold) {
			// console.log(resultArr[i][0] + " win");
			winner = resultArr[i][0];
		}
	}

	for (var i = 0; i < resultArr.length; i++) {
		if (resultArr[0][i] === resultArr[1][i] && resultArr[0][i] === resultArr[2][i] && resultArr[0][i] != placeHold) {
			// console.log(resultArr[0][i] + " win");
			winner = resultArr[0][i];
		}
	}

	if (resultArr[0][0] === resultArr[1][1] && resultArr[0][0] === resultArr[2][2] && resultArr[0][0] != placeHold) {
		// console.log(resultArr[0][0] + " win");
		winner = resultArr[0][0];
	}

	if (resultArr[0][2] === resultArr[1][1] && resultArr[0][2] === resultArr[2][0] && resultArr[0][2] != placeHold) {
		// console.log(resultArr[0][2] + " win");
		winner = resultArr[0][2];
	}

	if (typeof winner === 'string') {
		document.querySelectorAll('span').forEach(function(elem) {
			elem.removeEventListener('click', methodClick);
		})
	}else{
			var isEmptyArr = resultArr.join().split(",").filter(value => value === placeHold);
		if(isEmptyArr.length===0){
			winner = "tie";
		}
	}
	if(winner != "tie"){
		console.log(winner + " win");	
	}else{
		console.log("tie");
	}
	return winner;
}

function resetGame(){
	document.querySelector(".reset").addEventListener("click",resetFunc);
}

function resetFunc(){

}

mainGame();