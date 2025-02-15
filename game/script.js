document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var intervalTime = 20;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var brickHeight = 25;
    var brickWidth = 70;
    var brickRowCount = Math.round((canvas.height - 150) / brickHeight);
    var brickColumnCount = Math.round((canvas.width - 20) / brickWidth);
    var paddleX = canvas.width-paddleWidth / 2;
    var rightPressed = false;
    var leftPressed = false;
    var AffGO = false;
    var bricks = createBricks();

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    /**
     * This function is used to handle the key down event
     * @param {*} e 
     */
    function keyDownHandler(e) {
        if (e.keyCode === 39) {
            rightPressed = true;
        } else if (e.keyCode === 37) {
            leftPressed = true;
        }
    }

    /**
     * This function is used to handle the key up event
     * @param {*} e 
     */
    function keyUpHandler(e) {
        if (e.keyCode === 39) {
            rightPressed = false;
        } else if (e.keyCode === 37) {
            leftPressed = false;
        }
    }

    /**
     * 
     * @returns List of bricks
     */
    function createBricks() {
        let bricks_list = [];

        for (let i = 0; i < brickRowCount; i++) {
            for (let a = 0; a < brickColumnCount; a++) {
                if (bricks_list[i] === undefined) {
                    bricks_list.push([{ 
                        x: a*brickWidth + ((canvas.width - (brickColumnCount * brickWidth)) / 2), 
                        y: i*brickHeight + 2, color: "#" + Math.floor(Math.random()*16777215).toString(16), 
                        status: 1 
                    }]);
                } else {
                    bricks_list[i].push({ 
                        x: a*brickWidth + ((canvas.width - (brickColumnCount * brickWidth)) / 2), 
                        y: i*brickHeight + 2, color: "#" + Math.floor(Math.random()*16777215).toString(16), 
                        status: 1 
                    });
                }
            }
        }

        return bricks_list;
    }

    /**
     * This function is used to draw the ball on the canvas
     */
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    /**
     * This function is used to draw the paddle on the canvas
     */
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    /**
     * This function is used to draw the bricks on the canvas
     */
    function drawBricks() {
        for (let i = 0; i < brickRowCount; i++) {
            for (let a = 0; a < brickColumnCount; a++) {
                if (bricks[i][a].status === 1) {
                    ctx.beginPath();
                    ctx.rect(bricks[i][a].x + 2, bricks[i][a].y + 2, brickWidth, brickHeight);
                    ctx.fillStyle = bricks[i][a].color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function validateBricks() {
        let count = 0;

        bricks.forEach(brick => {
            brick.forEach(b => {
                if (b.status === 1) {
                    count++;
                }
            });
        });

        return count;
    }

    /**
     * This function is used to draw and manage the game
     */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();
        drawPaddle();
        drawBricks();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        } else {
            bricks.forEach(brick => {
                brick.forEach(b => {
                    if (b.status === 1) {
                        if (x > b.x - 6 && x < b.x + 6 + brickWidth && y > b.y - 6 && y < b.y + 6 + brickHeight) {
                            dy -= 0.1;
                            dx -= 0.1;
                            dy = -dy;
                            b.status = 0;
                        }
                    }
                });
            });
        }

        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height-ballRadius) {
            if (x > paddleX - 2 && x < paddleX + 3 + paddleWidth) {
                dy = -dy;
                AffGO = false;
            } else {
                drawBall();
                drawPaddle();

                if (AffGO == false){
                    alert("GAME OVER");
                    AffGO = true;
                }

                document.location.reload();
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        if (AffGO === false) {
            x += dx;
            y += dy;
        }

        if (!validateBricks() && AffGO === false) {
            alert("YOU WIN, CONGRATULATIONS!");
            AffGO = true;
            document.location.reload();
        }
    }

    setInterval(draw, intervalTime);
});