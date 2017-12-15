function game(player1,player2){

	var currentPlayer = null;
	var winnerRecord = [];
	var playerArr = [];

	playerArr.push(player1);
	if(player2){
		playerArr.push(player2);
	}
	var flag = whoIsFirst();

  var computerPlayer = false;
  if (playerArr.length === 1){
  	computerPlayer = true;
  }
	mainGame();

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

	function whoIsFirst(resultArr,placeHold){
		var flag = Math.round(Math.random());
		if(flag===1){
			alert(playerArr[0] + " is first!")
		}
		else{
			if(playerArr.length ===1){
				alert("computer is first!");
			}else{
				alert(playerArr[1] + " is first!")
			}

		}
		return flag;
	}

	function clickEvent(resultArr, playerArr, placeHold) {
		if (computerPlayer==true && flag == 0){
			currentPlayer = "AI";
			aiMove(resultArr,placeHold);
		}
		var methodClick = function(event) {

		var idArr = event.target.id.split("_");
		
		if (resultArr[Number(idArr[0])][Number(idArr[1])] === placeHold) {


				//the losser will get offensive move in next round
				if(resultArr.join().split(",").filter(value => value != placeHold).length===0){
					if(winnerRecord.slice(-1)[0]===playerArr[0]){
						flag = 0;
					}else if(winnerRecord.slice(-1)[0]===playerArr[1]){
						flag = 1;
					}				
				}
				
				if (flag === 0) {
					flag = 1;
				} else {
					flag = 0;
				}

				if(computerPlayer === true && flag ===1){
					currentPlayer = "AI";
				}else{
					currentPlayer = playerArr[flag];
				}

				if (resultArr[Number(idArr[0])][Number(idArr[1])] === placeHold) {
					event.target.textContent = playerArr[flag];
					resultArr[Number(idArr[0])][Number(idArr[1])] = playerArr[flag];
					event.target.style.backgroundColor = "lightBlue";

					var winner = checkWin(resultArr, placeHold, methodClick);
					if (typeof(winner) === 'string') {
						if(winner === "%"){
							winner = "AI";
						}
						winnerRecord.push(winner);
						gameState = "end";
						sideBarResult();
					}
				}
				//play with computer
				if(computerPlayer === true && gameState == "start"){
					currentPlayer = "AI";
					// console.error("AI not finish!")

					aiMove(resultArr,placeHold);
					var winner = checkWin(resultArr, placeHold, methodClick);
					if (typeof(winner) === 'string') {
						if(winner === "%"){
							winner = "AI";
						}
						winnerRecord.push(winner);
						gameState = "end";
						sideBarResult();
					}
				}
			}
		}

		document.querySelector('.game').querySelectorAll('span').forEach(function(elem) {
			elem.addEventListener('click', methodClick)
		})
	}

  //computer AI player
	function aiMove(resultArr,placeHold){
		
		if(resultArr.join().split(",").filter(value => value === placeHold).length>0){
			
			var targetPoint = [];
			//
			for(var i=0;i<3;i++){
				if(resultArr[i].filter(elem => elem == playerArr[0]).length==2 && 
					resultArr[i].filter(elem => elem == placeHold).length==1){
					  targetPoint = [i,(resultArr[i].indexOf(placeHold))];
						console.log("find targetPoint");
				}
			}

			for(var i=0;i<3;i++){
				var columnArr = [resultArr[0][i],resultArr[1][i],resultArr[2][i]];
				if(columnArr.filter(elem => elem == playerArr[0]).length==2 && 
					columnArr.filter(elem => elem == placeHold).length==1){
					  targetPoint = [(columnArr.indexOf(placeHold)),i];
						console.log("find targetPoint");
				}
			}

			var slashArr = [resultArr[0][0],resultArr[1][1],resultArr[2][2]];
			if(slashArr.filter(elem => elem == playerArr[0]).length==2 && 
				slashArr.filter(elem => elem == placeHold).length==1){
				if(slashArr.indexOf(placeHold) == 0){
					targetPoint = [0,0];
				}else if(slashArr.indexOf(placeHold) == 1){
					targetPoint = [1,1];
				}else{
					targetPoint = [2,2];
				}
					console.log("find targetPoint");
			}

			var slashBackArr = [resultArr[0][2],resultArr[1][1],resultArr[2][0]];
			if(slashBackArr.filter(elem => elem == playerArr[0]).length==2 && 
				slashBackArr.filter(elem => elem == placeHold).length==1){
				if(slashBackArr.indexOf(placeHold) == 0){
					targetPoint = [0,2];
				}else if(slashBackArr.indexOf(placeHold) == 1){
					targetPoint = [1,1];
				}
				else{
					targetPoint = [2,0];
				}
				console.log("find targetPoint");
			}

			if(resultArr[1][1] === placeHold){
				randomX = 1;
				randomY = 1;
			}else if(targetPoint.length>0){
				randomX = targetPoint[1];
				randomY = targetPoint[0];
			}else{
				var randomX = Math.floor(Math.random()*3);
				var randomY = Math.floor(Math.random()*3);

				while(resultArr[randomY][randomX] != placeHold){
					randomX = Math.floor(Math.random()*3);
					randomY = Math.floor(Math.random()*3);
					
				}
			}
				
			resultArr[randomY][randomX] = "%";
			document.getElementById(randomY+"_"+randomX).textContent = resultArr[randomY][randomX];
			if (flag === 0) {
				flag = 1;
			} else {
				flag = 0;
			}
		}
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
				return winner;
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
				return winner;
			}
		}

	  //for slash situation
		if (resultArr[0][0] === resultArr[1][1] && resultArr[0][0] === resultArr[2][2] && resultArr[0][0] != placeHold) {
			// console.log(resultArr[0][0] + " win");
			winner = resultArr[0][0];
				for(var j = 0; j<3; j++){
				document.getElementById(j+"_"+j).classList.add("backslash");
			}
			return winner;
		}

		if (resultArr[0][2] === resultArr[1][1] && resultArr[0][2] === resultArr[2][0] && resultArr[0][2] != placeHold) {
			// console.log(resultArr[0][2] + " win");
			winner = resultArr[0][2];
			for(var j = 0; j<3; j++){
				document.getElementById(j+"_"+(2-j)).classList.add("slash");
			}
			return winner;
		}

		if (typeof winner === 'string') {
			document.querySelector('.game').querySelectorAll('span').forEach(function(elem) {
				elem.removeEventListener('click', methodClick);
			})
		} else {
			var isEmptyArr = resultArr.join().split(",").filter(value => value === placeHold);
			if (isEmptyArr.length === 0) {
				winner = "tie";
			}
		}

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
	    }
	  )

	  if(winnerRecord.length >= 5){
	  	var player1Num = winnerRecord.filter(elem => elem == playerArr[0]).length;
	  	var player2Num = winnerRecord.filter(elem => elem == playerArr[1]).length;
	  	if(computerPlayer === true){
	  		player2Num = winnerRecord.filter(elem => elem == "AI").length;
	  	}
	  	
	 		var newRecord = document.createElement("div");
	 		newRecord.id = "totalScore";

			var score = document.createElement("div");
	 		score.textContent = player1Num +":"+player2Num;
	 		recordList.appendChild(score);

	  	if(player1Num > player2Num){
	    	newRecord.textContent = playerArr[0] + " win the game!";
	  	}else if(player1Num < player2Num){
	  		if(computerPlayer === true){
	  			newRecord.textContent = "AI win the game!";
	  		}else{
	    		newRecord.textContent = playerArr[1] + " win the game!";
	  		}
	  	}else{
	  		newRecord.textContent = 'Tie!';
	  	}
	    recordList.appendChild(newRecord);
	    winnerRecord = [];
	  }
		
	}

	function resetGame(resultArr,placeHold) {
		var reset = document.createElement("button");
		reset.textContent = "reset";
		reset.addEventListener("click", function(){resetFunc(resultArr,placeHold);});
		document.querySelector(".buttonBox").appendChild(reset);
	}

	function resetFunc(resultArr,placeHold) {
		if(resultArr.join().split(",").filter(value => value != placeHold).length != 0){
			// if the game is incomplete
			if(gameState ==="start"){
				var winner = currentPlayer;
				winnerRecord.push(winner);
				gameState = "end";
				sideBarResult();

			}
			//remove the game
			document.querySelector('.game').innerHTML = '';
			document.querySelector('.buttonBox').innerHTML = '';

			mainGame();
		}
	}
}
function initBeginPage(){
	var playWithAI = document.querySelector("#playWithAI");
	var player2NameInput = document.querySelector("#player2NameInput");

	playWithAI.addEventListener('change', 
		function(){
    	player2NameInput.disabled = !player2NameInput.disabled;
		})
}

function getPlayer(){
	var playWithAI = document.querySelector("#playWithAI");
	var player1NameInput = document.querySelector("#player1NameInput");
	var player2NameInput = document.querySelector("#player2NameInput");
	var goButton = document.querySelector("#goButton");
	var showInfo = document.querySelector(".showInfo");


	goButton.addEventListener("click",
		function(){
			
			//play with AI
			if(playWithAI.checked){
				var player1 = player1NameInput.value;
				player1 = player1.slice(0,1);
				if(player1 === "%"||player1 === " "){
					alert("player name cannot be '%' or space, input again:")
				}else{
					playerGroup = [player1];
					showInfo.style.display = "none";
					console.log("close");
					document.querySelector(".player1Name").textContent = player1;
			    document.querySelector(".player2Name").textContent = "AI";
					game(playerGroup[0]);
				}
			}
			else{
				var player1 = player1NameInput.value;
				player1 = player1.slice(0,1);
				var player2 = player2NameInput.value;
				player1 = player1.slice(0,1);
				if(player1 === player2 || player1 == "%" || player2 == "%"){
					alert("player name cannot be '%' or same, input again:")
				}else{
					playerGroup = [player1,player2];
					showInfo.style.display = "none";
					console.log("close");
					document.querySelector(".player1Name").textContent = player1;
	        document.querySelector(".player2Name").textContent = player2;
					game(playerGroup[0],playerGroup[1]);
				}
			}
		})

	// do{
	// 	var player1 = prompt("please input player1 name:","X");
	// 	player1 = player1.slice(0,1);
	// 	while(player1 === "%"){
	// 		player1 = prompt("player name cannot be '%', input again:","X");
	// 		player1 = player1.slice(0,1);
	// 	}
	// 	var playerWithComputer = confirm("Do you want to play with computer?");
	// 	if (playerWithComputer==true){
	// 		document.querySelector(".player1Name").textContent = player1;
	// 		document.querySelector(".player2Name").textContent = "AI";
	// 	  return [player1];
	// 	}

	// 	var player2 = prompt("please input player2 name:","Y");
	// 	player2 = player2.slice(0,1);
	// 	if(player1 === player2){
	// 		alert("please enter another player name!")
	// 	}
	// }while(player1 === player2 || player2 == "%");
	// document.querySelector(".player1Name").textContent = player1;
	// document.querySelector(".player2Name").textContent = player2;
	// return [player1, player2];
}

window.onload = function(){
	initBeginPage();
	var playerGroup = [];
	getPlayer();
	// game(playerGroup[0], playerGroup[1]);
	
}