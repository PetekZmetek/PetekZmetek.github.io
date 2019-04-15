const HORIZONTAL_VELOCITY = 4,
    HORIZONTAL_ACCELERATION = 0.125,
    VERTICAL_VELOCITY = 15,
    GRAVITY = 0.8,
    SPRING_VEL = 31,
    climbSpeed = 3.5,
    UNIVERSAL_PLAYER_WIDTH = 96,
    INTERVAL_BETWEEN_MOB_COLLISIONS_MILIS = 2000,
    REFRESH_RATE_MILLIS = 125,
    DAMAGE_FLICK_RATE = 50,
    playerAObj = "playerA";
let xChange = 0,
    yChange = 0,
    index = 0,
    playerClimbing = false,
    pLIVES = 5,
    pDAMAGE = 5,
    pSCORE = 0,
    pTimeSinceLastCollision,
    endTime = 0,
    currentSheet,
    currentCols,
    startT,
    ORIENTATION = "RIGHT";

class PLAYER extends GameAnimations {
    constructor() {
        super();
        this.initPlayer();
    }

    // ******* PROCESSING FUNCTIONS ******* //

    processPlayer() {
        this.evaluateInputFromTheListener();
        this.movePlayer();
        this.evaluateCollision(this.X, this.WIDTH, this.HEIGHT);
        this.evaluateState();
        this.drawPlayer();
    }

    movePlayer() {
        this.playerA[Xobject] += xChange;

        if (!playerClimbing)
            yChange += GRAVITY;
        this.playerA[Yobject] += yChange;
    }

    drawPlayer() {
        let HEIGHT = this.HEIGHT;
        let X = this.X - (UNIVERSAL_PLAYER_WIDTH - this.WIDTH) / 2;
        let Y = this.Y - Math.abs(currentSheet.height - HEIGHT);

        let currentTime = performance.now();

        if (currentTime - pTimeSinceLastCollision < INTERVAL_BETWEEN_MOB_COLLISIONS_MILIS)
            this.flickerPlayerImage(currentSheet, currentTime, pTimeSinceLastCollision);
        else
            currentSheet.style.visibility = "visible";

        if (currentSheet.style.visibility === "visible")
            this.drawAnimation(currentSheet, currentCols, X, Y, HEIGHT, this.playerA[ARefreshT], this.playerA, this.playerA[ARepeat]);
    }

    flickerPlayerImage(currentSheet, currentTime, lastCollision) {
        let flickInterval = Math.floor((currentTime - lastCollision) / DAMAGE_FLICK_RATE);

        let VISIBILITY = flickInterval % 2 === 0;

        currentSheet.style.visibility = VISIBILITY ? "visible" : "hidden";
    }

    // ******* EVALUATIVE FUNCTIONS ******* //

    playerManageLives() {
        if (pLIVES > 0) {
            pLIVES--;
            pDAMAGE = 5;
            GAME.restartGame();
        } else
            pLIVES = 5 + 1;
    }

    playerManageDamages() {
        if (pDAMAGE > 0)
            pDAMAGE--;
        else {
            pLIVES--;
            pDAMAGE = 5;
            GAME.restartGame();
        }
    }

    playerOverlaps(lT2X, rB2X, lT2Y, rB2Y) {
        if (this.X > rB2X || lT2X > (this.X + this.WIDTH))
            return false;
        if ((this.Y + this.HEIGHT) < lT2Y || rB2Y < (this.Y))
            return false;

        return true;
    }

    evaluateCollision(X, WIDTH, HEIGHT) {
        map.CollisionBlocks.forEach(obstR => {
            if (this.playerOverlaps(obstR[Xobject], obstR[Xobject] + obstR[Wobject], obstR[Yobject], obstR[Yobject] + obstR[Hobject])) {
                if (obstR[NAMEobj] !== "death") {
                    if (((X + WIDTH) >= obstR[Xobject]) && ((X + WIDTH) <= (obstR[Xobject] + xChange)) && (xChange >= 0)) {
                        this.playerA[Xobject] = obstR[Xobject] - WIDTH;
                        xChange = 0;
                    } else if ((X <= (obstR[Xobject] + obstR[Wobject])) && (X >= (obstR[Xobject] + obstR[Wobject] - Math.abs(xChange))) && (xChange <= 0)) {
                        this.playerA[Xobject] = obstR[Xobject] + obstR[Wobject];
                        xChange = 0;
                    } else {
                        if (yChange >= 0) {
                            if (yChange >= 25) {
                                audio.playerHit();
                                this.playerManageLives();
                            }
                            this.playerA[Yobject] = obstR[Yobject] - HEIGHT;
                            yChange = 0;
                        } else if (yChange <= 0) {
                            this.playerA[Yobject] = obstR[Yobject] + obstR[Hobject];
                            yChange = 0.0001;
                        }
                    }
                } else {
                    this.playerManageLives();
                    audio.playerDeath();
                }
            }
        });
    }

    evaluateInputFromTheListener() {
        if (KEYS.A_PRESSED && !KEYS.D_PRESSED) {
            if (xChange <= 0)
                ORIENTATION = "LEFT";

            // CAN BE TURNED OFF ANYTIME
            if (xChange > 0)
                xChange = -xChange;

            if (xChange !== -HORIZONTAL_VELOCITY)
                xChange -= HORIZONTAL_ACCELERATION;

        } else if (KEYS.D_PRESSED && !KEYS.A_PRESSED) {
            if (xChange >= 0)
                ORIENTATION = "RIGHT";

            // CAN BE TURNED OFF ANYTIME
            if (xChange < 0)
                xChange = -xChange;

            if (xChange !== HORIZONTAL_VELOCITY)
                xChange += HORIZONTAL_ACCELERATION;

        } else if (!KEYS.D_PRESSED || !KEYS.A_PRESSED) {
            if (xChange > 0)
                xChange -= HORIZONTAL_ACCELERATION;
            else if (xChange < 0)
                xChange += HORIZONTAL_ACCELERATION;
            else
                xChange = 0;
        }

        xChange = parseFloat(xChange.toFixed(5));

        if (KEYS.W_PRESSED && KEYS.handleWDown) {
            if (yChange === 0) {
                yChange = -VERTICAL_VELOCITY;
                audio.playerJumpSound();
            }

            KEYS.handleWDown = false;
        }
    }

    evaluateState() {
        if (triggerA.WIN && xChange === 0) {
            if (endTime === 0)
                endTime = performance.now();

            this.decideTheCorrectSheet(PlayerImages.pHappyN, PlayerImages.pHappyF, ORIENTATION);
            this.playerA[AINDEXobj] = 0;

            if (!audio.winPlaying)
                audio.playerWIN();

            if (performance.now() - endTime >= 3000) {
                GAME.nextLevel();
                endTime = 0;
            }
        }
        // CLIMBING
        else if (playerClimbing)
            this.decideTheCorrectSheet(PlayerImages.pClimbingN, PlayerImages.pClimbingN, ORIENTATION);
        // RUNNING RIGHT
        else if (xChange > 0 && yChange === 0)
            this.decideTheCorrectSheet(PlayerImages.pWalkingN, PlayerImages.pWalkingF, ORIENTATION);
        // RUNNING LEFT
        else if (xChange < 0 && yChange === 0)
            this.decideTheCorrectSheet(PlayerImages.pWalkingN, PlayerImages.pWalkingF, ORIENTATION);
        // JUMPING
        else if (yChange !== 0) {
            this.decideTheCorrectSheet(PlayerImages.pJumpingN, PlayerImages.pJumpingF, ORIENTATION);
            this.playerA[AINDEXobj] = 0;
        }
        // STANDING
        else if (xChange === 0 && yChange === 0) {
            this.decideTheCorrectSheet(PlayerImages.pIdleN, PlayerImages.pIdleF, ORIENTATION);
            this.playerA[AINDEXobj] = 0;
        }

        currentCols = currentSheet.width / UNIVERSAL_PLAYER_WIDTH;
    }

    // ******* INITIALIZATION FUNCTIONS ******* //

    initPlayer() {
        map.initSheets([PlayerImages], [PlayerImageSources]);
        this.initStartPosition(map.TriggerBlocks);
        yChange = 0;
        xChange = 0;

        currentSheet = PlayerImages.pIdleN;
        currentCols = currentSheet.width / UNIVERSAL_PLAYER_WIDTH;

        startT = performance.now();
        pTimeSinceLastCollision = -INTERVAL_BETWEEN_MOB_COLLISIONS_MILIS;
    }

    initStartPosition(triggerA) {
        this.playerA = [];

        triggerA.forEach(trigger => {
            if (trigger[NAMEobj] === playerAObj)
                this.playerA = trigger.slice();
        });

        if (checkPointX !== 0 && checkPointY !== 0) {
            if (this.playerA[0] !== checkPointX && this.playerA[1] !== checkPointY) {
                this.playerA[0] = checkPointX;
                this.playerA[1] = checkPointY;
            }
        }
    }

    decideTheCorrectSheet(sheetNormal, sheetFlipped, orientation) {
        if (currentSheet !== sheetNormal && orientation === "RIGHT")
            currentSheet = sheetNormal;
        else if (currentSheet !== sheetFlipped && orientation === "LEFT")
            currentSheet = sheetFlipped;
    }

    get X() {
        return this.playerA[Xobject];
    }

    get Y() {
        return this.playerA[Yobject];
    }

    get WIDTH() {
        return this.playerA[Wobject];
    }

    get HEIGHT() {
        return this.playerA[Hobject];
    }

    get SPRING_VEL() {
        return SPRING_VEL;
    }

    get xChange() {
        return xChange;
    }

    get yChange() {
        return yChange;
    }

    set yChange(value) {
        yChange = value;
    }

    get climbSpeed() {
        return climbSpeed;
    }

    set playerClimbing(value) {
        playerClimbing = value;
    }

    get pLIVES() {
        return pLIVES;
    }

    set pLIVES(value) {
        pLIVES = value;
    }

    get pSCORE() {
        return pSCORE;
    }

    get pDAMAGE() {
        return pDAMAGE;
    }

    set pDAMAGE(value) {
        pDAMAGE = value;
    }

    set pSCORE(value) {
        pSCORE = value;
    }

    set endTime(value) {
        endTime = value;
    }

    get GRAVITY() {
        return GRAVITY;
    }

    get pTimeSinceLastCollision() {
        return pTimeSinceLastCollision;
    }

    set pTimeSinceLastCollision(value) {
        pTimeSinceLastCollision = value;
    }

    get INTERVAL_BETWEEN_MOB_COLLISIONS_MILIS() {
        return INTERVAL_BETWEEN_MOB_COLLISIONS_MILIS;
    }
}

let pNbsHUDSources = [
    "pHUD/pLives/hudNmbs.png",

    "pHUD/pLives/pIcon.png",
    "pHUD/pLives/hudX.png",
    "pHUD/pLives/hudHearts.png"
]

let pNbsHUD = {
    hudNmbs: null,

    pIcon: null,
    hudX: null,
    hudHearts: null
};

let PlayerImages = {
    pWalkingN: null,
    pWalkingF: null,
    pIdleN: null,
    pIdleF: null,
    pJumpingN: null,
    pJumpingF: null,
    pClimbingN: null,
    pClimbingF: null,
    pHappyN: null,
    pHappyF: null
};

let PlayerImageSources = [
    "pI/pWalkingNormal.png",
    "pI/pWalkingFlipped.png",
    "pI/pIdleNormal.png",
    "pI/pIdleFlipped.png",
    "pI/pJumpingNormal.png",
    "pI/pJumpingFlipped.png",
    "pI/pClimbingNormal.png",
    "pI/pClimbingNormal.png",
    "pI/pHappyNormal.png",
    "pI/pHappyFlipped.png"
];