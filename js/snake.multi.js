$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var cw = 15; // cell width

	var ds; // direction snake
	var df; // direction food

	var score;
	var isPlaying = false;
	var gameLoop;

	var snake;
	var food;
		// left, up,right,  down
	var keysArrow = [37,38,39,40];
	var keysWasd  = [65,87,68,83];
	var keysVim 	= [72,75,76,74];


	var keyControls = {
		'wasd': keysWasd,
		'vim' : keysVim,
		'arrow': keysArrow
	};

	var keysSnake = keysArrow;
	var keysFood  = keysWasd;

	var dirs = ['up','right','down','left'];
	var keysRelativeSnake = false;
	var keysRelativeFood  = false	;

	$("#snakeControls").change(function(){
		keysSnake = keyControls[$(this).val()];
	});
	$("#foodControls").change(function(){
		keysFood = keyControls[$(this).val()];
	});

	function startGameLoop(){
		if(typeof gameLoop != "undefined") clearInterval(gameLoop);
		gameLoop = setInterval(gameFunction, 80); //12fps
		isPlaying = true;
	}

	function pauseGameLoop(){
		clearInterval(gameLoop);
		isPlaying = false;
	}

	function restart(msg){
		pauseGameLoop();
		isSpawning = true;
		setTimeout(function(){
			paintStatus(msg);
		},100);
		setTimeout(function(){
			paintStatus(msg);
			init();
		},2000);
	}

	function init() {
		isSpawning = false;
		ds = "right"; //default direction
		createSnake();
		createFood();
		score = 0;
		paint();
	}
	init();

	function createSnake(){
		var length = 5; //Length of the snake
		snake = []; //Empty array to start with
		for(var i = length-1; i>=0; i--) {
			snake.push({x: i, y:0});
		}
	}

	function createFood() {
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};
	}

	function gameFunction(){
		updatePositions();
		paint();
	}

	function paint() {
		paintCanvas();
		paintSnake();
		paintCell(food, 0);
		paintScore();
	}

	function updatePositions(){
		var head = {
			x:snake[0].x,
			y:snake[0].y
		};

		// snake controls
		if 		 (ds == "right") 	head.x++;
		else if(ds == "left")		head.x--;
		else if(ds == "up") 		head.y--;
		else if(ds == "down") 	head.y++;
		// food controls
		if 		 (df == "right") 	food.x++;
		else if(df == "left") 	food.x--;
		else if(df == "up") 		food.y--;
		else if(df == "down") 	food.y++;

		if( isCollidedWithWall(head) || checkCollision(head, snake) ) {
			restart("SNAKE Crashed!!!"); // Snake collided, snake lost
		} else if( isCollidedWithWall(food) || isCaptured(head, food) ) {
			restart("FOOD Captured!!!"); // food collided , snake won
			//createFood();
		} else {
			 score++;
		}

		if(score%5) snake.pop(); //pops out the last cell
		snake.unshift(head); //puts back the tail as the first cell
	}

	function isCaptured(head, food){
		if(head.x == food.x && head.y == food.y){
			return true;
		}
		for(var i = 0; i < snake.length; i++){
			if(snake[i].x == food.x && snake[i].y == food.y)
			 return true;
		}
		return false;
	}

	function isCollidedWithWall(point){
		 return (point.x == -1 || point.x == w/cw || point.y == -1 || point.y == h/cw) ;
	}

	function paintCanvas() {
		ctx.clearRect(0, 0, w, h);
	}

	function paintSnake(){
		for(var i = 0; i < snake.length; i++) {
			paintCell(snake[i], 1);
		}
	}

	function paintCell(point, isSnake) {
		ctx.beginPath();
		ctx.fillStyle = (isSnake) ? "#2B3":"orange";
		ctx.arc(point.x*cw+cw/2, point.y*cw+cw/2, cw/2, 0, 2 * Math.PI);
		ctx.strokeStyle = "black";
		ctx.fill();
		ctx.stroke();
	}

	function paintScore(){
		var scoreText = "Score: " + score;
		ctx.font="15px Arial";
		ctx.textAlign = "left";
		ctx.fillText(scoreText, 5, h-5);
	}

	function paintStatus(str){
		ctx.font = "bold 30px verdana, sans-serif";
		ctx.fillStyle = "#ff0000";
		ctx.textAlign = "center";
		ctx.fillText(str, w/2, h/2);
	}

	function checkCollision(head, array) {
		for(var i = 1; i < array.length; i++) {
			if(array[i].x == head.x && array[i].y == head.y)
				return true;
		}
		return false;
	}

	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		e.preventDefault();

		if(keysRelativeSnake){
			if 		 (key == keysSnake[0])  ds = dirs[(dirs.indexOf(ds)+3)%4];
			else if(key == keysSnake[2]) 	ds = dirs[(dirs.indexOf(ds)+1)%4];
		} else {
			if 		 (key == keysSnake[0] && ds != "right") ds = "left";
			else if(key == keysSnake[1] && ds != "down") 	ds = "up";
			else if(key == keysSnake[2] && ds != "left") 	ds = "right";
			else if(key == keysSnake[3] && ds != "up") 		ds = "down";
		}

		if(keysRelativeFood){
			if 		 (key == keysFood[0])	df = dirs[(dirs.indexOf(ds)+3)%4];
			else if(key == keysFood[2])	df = dirs[(dirs.indexOf(ds)+1)%4];
		} else {
			if(key == keysFood[0]) df = "left";
			else if(key == keysFood[1]) df = "up";
			else if(key == keysFood[2]) df = "right";
			else if(key == keysFood[3]) df = "down";
		}

		if(key == "82") { // R
			startGameLoop();
		} else if(key == "80") { //P
			pauseGameLoop();
		}

		if(!isPlaying && !isSpawning && key!="80"){
			startGameLoop();
		}
	});

})
