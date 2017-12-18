function game(player1, player2) {

	var currentPlayer = null;
	var playerArr = [];

	playerArr.push(player1);
	if (player2) {
		playerArr.push(player2);
	}

	whoIsFirst(playerArr);

	var computerPlayer = false;
	if (playerArr.length === 1) {
		computerPlayer = true;
	}
	mainGame(playerArr, computerPlayer);
}

function mainGame(playerArr, computerPlayer) {
	gameState = "start";
	var resultArr = [];
	var placeHold = "?";
	initMap(resultArr, 3, 3, placeHold, playerArr);
	clickEvent(resultArr, playerArr, placeHold, computerPlayer);
	resetGame(resultArr, playerArr, placeHold, computerPlayer);
}

//init game map
function initMap(resultArr, row, column, placeHold, playerArr) {
	var resultShow = document.querySelector(".game");
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

function whoIsFirst(playerArr) {
	flag = Math.round(Math.random());
	
	if (flag === 0) {
		alert(playerArr[0] + " is first!")
	} else {
		if (playerArr.length === 1) {
			alert("computer is first!");
		} else {
			alert(playerArr[1] + " is first!")
		}

	}
}

function clickEvent(resultArr, playerArr, placeHold, computerPlayer) {

	var methodClick = function(event) {
		var idArr = event.target.id.split("_");

		if (resultArr[Number(idArr[0])][Number(idArr[1])] === placeHold) {
			if (computerPlayer === true && flag === 1) {
				currentPlayer = "AI";
			} else {
				currentPlayer = playerArr[flag];
			}



			if (resultArr[Number(idArr[0])][Number(idArr[1])] === placeHold) {
				event.target.textContent = playerArr[flag];
				resultArr[Number(idArr[0])][Number(idArr[1])] = playerArr[flag];
				event.target.style.backgroundColor = "lightBlue";

				var winner = checkWin(resultArr, placeHold, methodClick);
				if (typeof(winner) === 'string') {
					if (winner === "%") {
						winner = "AI";
					}
					winnerRecord.push(winner);
					gameState = "end";
					sideBarResult(playerArr, computerPlayer);
					return;
				}
				flag = Number(!flag);
				changeBackground();

				//play with computer
				if (computerPlayer === true && gameState == "start") {
					aiMove(resultArr, placeHold, playerArr, methodClick);
				}

			}
		}
	}

	// when game start and AI go first
	if (computerPlayer == true && flag == 1) {
		aiMove(resultArr, placeHold, playerArr, methodClick);
	}
  changeBackground();
	// when user click the button, call methodClick
	document.querySelector('.game').querySelectorAll('span').forEach(function(elem) {
		elem.addEventListener('click', methodClick)
	})
}

//computer AI player
function aiMove(resultArr, placeHold, playerArr, methodClick) {
	currentPlayer = "AI";

	if (resultArr.join().split(",").filter(value => value === placeHold).length > 0) {

		var targetPoint = [];
		//
		for (var i = 0; i < 3; i++) {
			if (resultArr[i].filter(elem => elem == playerArr[0]).length == 2 &&
				resultArr[i].filter(elem => elem == placeHold).length == 1) {
				targetPoint = [i, (resultArr[i].indexOf(placeHold))];
				console.log("find targetPoint");
			}
		}

		for (var i = 0; i < 3; i++) {
			var columnArr = [resultArr[0][i], resultArr[1][i], resultArr[2][i]];
			if (columnArr.filter(elem => elem == playerArr[0]).length == 2 &&
				columnArr.filter(elem => elem == placeHold).length == 1) {
				targetPoint = [(columnArr.indexOf(placeHold)), i];
				console.log("find targetPoint");
			}
		}

		var slashArr = [resultArr[0][0], resultArr[1][1], resultArr[2][2]];
		if (slashArr.filter(elem => elem == playerArr[0]).length == 2 &&
			slashArr.filter(elem => elem == placeHold).length == 1) {
			if (slashArr.indexOf(placeHold) == 0) {
				targetPoint = [0, 0];
			} else if (slashArr.indexOf(placeHold) == 1) {
				targetPoint = [1, 1];
			} else {
				targetPoint = [2, 2];
			}
			console.log("find targetPoint");
		}

		var slashBackArr = [resultArr[0][2], resultArr[1][1], resultArr[2][0]];
		if (slashBackArr.filter(elem => elem == playerArr[0]).length == 2 &&
			slashBackArr.filter(elem => elem == placeHold).length == 1) {
			if (slashBackArr.indexOf(placeHold) == 0) {
				targetPoint = [0, 2];
			} else if (slashBackArr.indexOf(placeHold) == 1) {
				targetPoint = [1, 1];
			} else {
				targetPoint = [2, 0];
			}
			console.log("find targetPoint");
		}

		if (resultArr[1][1] === placeHold) {
			randomX = 1;
			randomY = 1;
		} else if (targetPoint.length > 0) {
			randomX = targetPoint[1];
			randomY = targetPoint[0];
		} else {
			var randomX = Math.floor(Math.random() * 3);
			var randomY = Math.floor(Math.random() * 3);

			while (resultArr[randomY][randomX] != placeHold) {
				randomX = Math.floor(Math.random() * 3);
				randomY = Math.floor(Math.random() * 3);

			}
		}

		resultArr[randomY][randomX] = "%";
		document.getElementById(randomY + "_" + randomX).textContent = resultArr[randomY][randomX];

		var winner = checkWin(resultArr, placeHold, methodClick);
		if (typeof(winner) === 'string') {
			if (winner === "%") {
				winner = "AI";
			}
			winnerRecord.push(winner);
			gameState = "end";
			sideBarResult(playerArr, true);
		}
		flag = Number(!flag);
		changeBackground();
	}
}

function checkWin(resultArr, placeHold, methodClick) {
	var winner = null;
	var isEmptyArr = resultArr.join().split(",").filter(value => value === placeHold);

	for (var i = 0; i < resultArr.length; i++) {

		//for row same situation
		if (resultArr[i][0] === resultArr[i][1] && resultArr[i][1] === resultArr[i][2] && resultArr[i][0] != placeHold) {
			winner = resultArr[i][0];
			for (var j = 0; j < 3; j++) {
				document.getElementById(i + "_" + j).classList.add("horizontalLine");
			}
			break;
		}

		//for column same situation
		else if (resultArr[0][i] === resultArr[1][i] && resultArr[0][i] === resultArr[2][i] && resultArr[0][i] != placeHold) {
			// console.log(resultArr[0][i] + " win");
			winner = resultArr[0][i];
			for (var j = 0; j < 3; j++) {
				document.getElementById(j + "_" + i).classList.add("verticalLine");
			}
			break;
		}

		//for slash situation
		else if (resultArr[0][0] === resultArr[1][1] && resultArr[0][0] === resultArr[2][2] && resultArr[0][0] != placeHold) {
			// console.log(resultArr[0][0] + " win");
			winner = resultArr[0][0];
			for (var j = 0; j < 3; j++) {
				document.getElementById(j + "_" + j).classList.add("backslash");
			}
			break;
		} 

		else if (resultArr[0][2] === resultArr[1][1] && resultArr[0][2] === resultArr[2][0] && resultArr[0][2] != placeHold) {
			// console.log(resultArr[0][2] + " win");
			winner = resultArr[0][2];
			for (var j = 0; j < 3; j++) {
				document.getElementById(j + "_" + (2 - j)).classList.add("slash");
			}
			break;
		} 

		//tie situation
		else if (isEmptyArr.length === 0) {
			winner = "tie";
			break;
		}
	}

	if (typeof winner === 'string') {
		document.querySelector('.game').querySelectorAll('span').forEach(function(elem) {
			elem.removeEventListener('click', methodClick);
		})
	}

	return winner;
}

function sideBarResult(playerArr, computerPlayer) {
	var recordList = document.querySelector(".recordList");
	recordList.innerHTML = "";
	winnerRecord.forEach(
		function(element, index) {
			console.log(element);
			var newRecord = document.createElement("div");
			newRecord.textContent = index + 1 + " Round Winner: " + element;
			recordList.appendChild(newRecord)
		}
	)

	if (winnerRecord.length >= 5) {
		var player1Num = winnerRecord.filter(elem => elem == playerArr[0]).length;
		var player2Num = winnerRecord.filter(elem => elem == playerArr[1]).length;
		if (computerPlayer === true) {
			player2Num = winnerRecord.filter(elem => elem == "AI").length;
		}

		var newRecord = document.createElement("div");
		newRecord.id = "totalScore";

		var score = document.createElement("div");
		score.textContent = player1Num + ":" + player2Num;
		recordList.appendChild(score);

		if (player1Num > player2Num) {
			newRecord.textContent = playerArr[0] + " win the game!";
		} else if (player1Num < player2Num) {
			if (computerPlayer === true) {
				newRecord.textContent = "AI win the game!";
			} else {
				newRecord.textContent = playerArr[1] + " win the game!";
			}
		} else {
			newRecord.textContent = 'Tie!';
		}
		recordList.appendChild(newRecord);
		winnerRecord = [];
	}
}

function resetGame(resultArr, playerArr, placeHold, computerPlayer) {
	var reset = document.createElement("button");
	reset.textContent = "reset";
	reset.addEventListener("click", function() {
		resetFunc(resultArr, playerArr, placeHold, computerPlayer);
	});
	document.querySelector(".buttonBox").appendChild(reset);
}

function resetFunc(resultArr, playerArr, placeHold, computerPlayer) {
	if (resultArr.join().split(",").filter(value => value != placeHold).length != 0) {
		// if the game is incomplete
		if (gameState === "start") {
			var winner = currentPlayer;
			winnerRecord.push(winner);
			gameState = "end";
			sideBarResult(playerArr, computerPlayer);

		}
		//remove the game
		document.querySelector('.game').innerHTML = '';
		document.querySelector('.buttonBox').innerHTML = '';

		//decide who is first in next round
		//the losser will get offensive move in next round
		//if it is tie, the player who start second in the last round will start first
		if (winnerRecord.slice(-1)[0] === playerArr[0]) {
			flag = 1;
		} else if (winnerRecord.slice(-1)[0] === playerArr[1] || winnerRecord.slice(-1)[0] === "AI") {
			flag = 0;
		} else{
			flag = Number(!flag);
		}
		changeBackground();

		mainGame(playerArr, computerPlayer);
	}
}

function initBeginPage() {
	var playWithAI = document.querySelector("#playWithAI");
	var player2NameInput = document.querySelector("#player2NameInput");

	playWithAI.addEventListener('change',
		function() {
			player2NameInput.disabled = !player2NameInput.disabled;
		});

	var sidebarSwitch = document.querySelector(".sidebarSwitch");
	sidebarSwitch.addEventListener('click',
		function(){
			sidebarSwitch.classList.toggle("change");
			document.querySelector("aside").classList.toggle("closeAside");
		})
}

function getPlayer() {
	var playWithAI = document.querySelector("#playWithAI");
	var player1NameInput = document.querySelector("#player1NameInput");
	var player2NameInput = document.querySelector("#player2NameInput");
	var goButton = document.querySelector("#goButton");
	var showInfo = document.querySelector(".showInfo");
	var changeGameMode = document.querySelector(".changeGameMode");


	goButton.addEventListener("click",
		function() {

			//play with AI
			if (playWithAI.checked) {
				var player1 = player1NameInput.value;
				player1 = player1.slice(0, 1);
				if (player1 === "%" || player1 === " " || player1 === "" )  {
					alert("player name cannot be '%' or space or blank, input again:");
				} else {
					playerGroup = [player1];
					changeGameMode.style.display = "block";
					showInfo.classList.add("hide");
					console.log("close");
					document.querySelector(".player1Name").textContent = player1;
					document.querySelector(".player2Name").textContent = "AI";
					game(playerGroup[0]);
				}
			} else {
				var player1 = player1NameInput.value;
				player1 = player1.slice(0, 1);
				var player2 = player2NameInput.value;
				player1 = player1.slice(0, 1);
				if (player1 === player2 || player1 == "%" || player2 == "%" ||
				 player1 === " " || player1 === "" || player2 === " " || player2 === "") {
					alert("player name cannot be '%' or same or blank, input again:");
				} else {
					playerGroup = [player1, player2];
					changeGameMode.style.display = "block";
					showInfo.classList.add("hide");
					console.log("close");
					document.querySelector(".player1Name").textContent = player1;
					document.querySelector(".player2Name").textContent = player2;
					game(playerGroup[0], playerGroup[1]);
				}
			}
		});
}

function resetPlayer(){
	var changeGameMode = document.querySelector(".changeGameMode");
	changeGameMode.addEventListener("click", function(){
		playerGroup = [];
		resultArr = [];
		winnerRecord = [];
		//remove the game view
		document.querySelector('.game').innerHTML = '';
		document.querySelector('.buttonBox').innerHTML = '';
		document.querySelector(".showInfo").classList.remove("hide");
		document.querySelector(".recordList").innerHTML = "";
		changeGameMode.style.display = "none";
	})
}

function changeBackground(){
	var allSpan = document.querySelector(".game").querySelectorAll('span');
	allSpan.forEach(function(elem){
		if(flag==1){
			elem.classList.remove("blue");
			elem.classList.add("red");
		}else{
			elem.classList.remove("red");
			elem.classList.add("blue");			
		}
	})
}

initBeginPage();
var playerGroup = [];
var winnerRecord = [];
var resultArr = [];
var flag;
getPlayer();
resetPlayer();