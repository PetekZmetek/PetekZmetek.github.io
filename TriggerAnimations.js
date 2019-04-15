const numberOfCoins = 11;
let checkPointX = 0,
    checkPointY = 0;

class TriggerAnimations extends GameAnimations {
    constructor() {
        super();
        checkPointX = 0;
        checkPointY = 0;
        this.initBasicVariables();
    }

    initBasicVariables() {
        this.leverOn = false;
        this.WIN = false;
    }

    processAnimation() {
        this.decideWhichAnimationToDraw();
    }

    decideWhichAnimationToDraw() {
        let cameraX = Math.abs(camera.camX);
        let cameraY = Math.abs(camera.camY);

        map.TriggerBlocks.forEach(triggerB => {
            if (((triggerB[Xobject] + triggerB[Wobject] >= cameraX) && (triggerB[Xobject] <= cameraX + canvas.WIDTH)) &&
                ((triggerB[Yobject] <= cameraY + canvas.HEIGHT) && (triggerB[Yobject] + triggerB[Hobject] > cameraY))) {
                if (player.playerOverlaps(triggerB[Xobject], triggerB[Xobject] + triggerB[Wobject], triggerB[Yobject], triggerB[Yobject] + triggerB[Hobject])) {
                    if (triggerB[NAMEobj] === "springA" && player.yChange > 0) {
                        triggerB[AINDEXobj] = 0;
                        player.yChange = -triggerB[MOBSpeed];
                        triggerB[ATimeobj] = performance.now();
                        audio.springJump();
                    } else if (triggerB[NAMEobj] === "ladderA") {
                        if (KEYS.W_PRESSED) {
                            player.yChange = -player.climbSpeed;
                            player.playerClimbing = true;
                        } else
                            player.playerClimbing = false;
                    } else if (triggerB[NAMEobj] === "flagA") {
                        if (checkPointX !== triggerB[Xobject]) {
                            checkPointX = triggerB[Xobject];
                            checkPointY = triggerB[Yobject];
                            audio.checkpoint();
                        }
                    } else if (triggerB[NAMEobj] === "coinA") {
                        map.TriggerBlocks = map.TriggerBlocks.filter(item => item !== triggerB);
                        player.pSCORE++;
                        pHUD.drawPlayerHUD();
                        audio.coinCollected();
                    } else if (triggerB[NAMEobj] === "leverA") {
                        if (KEYS.K_PRESSED && KEYS.handleKDown && (player.pSCORE === numberOfCoins)) {
                            if (triggerB[AINDEXobj] === 0) {
                                triggerB[AINDEXobj] = 1;
                                this.leverOn = true;
                            } else {
                                triggerB[AINDEXobj] = 0;
                                this.leverOn = false;
                            }
                            audio.leverSound();

                            KEYS.handleKDown = false;
                        }
                    } else if (triggerB[NAMEobj] === "doorA") {
                        if (this.leverOn) {
                            this.WIN = true;
                            if (player.endTime === 0)
                                player.endTime = performance.now();
                        }
                    }
                } else {
                    if (triggerB[NAMEobj] === "ladderA")
                        player.playerClimbing = false;
                    else if (triggerB[NAMEobj] === "doorA") {
                        this.WIN = false;
                        if (this.leverOn)
                            triggerB[AINDEXobj] = 1;
                        else
                            triggerB[AINDEXobj] = 0;
                    }
                }

                if (triggerB[NAMEobj] !== "playerA" && triggerB[NAMEobj] !== "ladderA") {
                    let IMAGE = AnimationImages[triggerB[NAMEobj]];
                    let COLUMNS = imageColumns[`${triggerB[NAMEobj]}Cols`];
                    let WIDTH = triggerB[Wobject];
                    let HEIGHT = triggerB[Hobject];
                    let X = triggerB[Xobject] - (Math.abs((IMAGE.width / COLUMNS) - WIDTH)) / 2;
                    let Y = triggerB[Yobject] - (Math.abs(IMAGE.height - HEIGHT));

                    if (triggerB[NAMEobj] !== "leverA" && triggerB[NAMEobj] !== "doorA")
                        this.drawAnimation(IMAGE, COLUMNS, X, Y, HEIGHT, triggerB[ARefreshT], triggerB, triggerB[ARepeat]);
                    else
                        this.drawPlainImage(IMAGE, COLUMNS, X, Y, triggerB);
                }
            }
        });
    }
}