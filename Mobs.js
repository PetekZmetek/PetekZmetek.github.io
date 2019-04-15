const mobsColumns = 2;
var then = performance.now();

class Mobs extends GameAnimations {
    processMobs() {
        let cameraX = Math.abs(camera.camX);
        let cameraY = Math.abs(camera.camY);

        map.Mobs.forEach(mob => {
            if (mob[NAMEobj] === "slimeBlckA")
                this.moveSlimeBlck(mob, mob[Yobject], mob[MOBInitY], mob[Hobject]);

            if (((mob[Xobject] + mob[Wobject] >= cameraX) && (mob[Xobject] <= cameraX + canvas.WIDTH)) &&
                ((mob[Yobject] <= cameraY + canvas.HEIGHT) && (mob[Yobject] + mob[Hobject] > cameraY))) {
                if (player.playerOverlaps(mob[Xobject], mob[Xobject] + mob[Wobject], mob[Yobject], mob[Yobject] + mob[Hobject])) {
                    let currentTime = performance.now();

                    if (currentTime - player.pTimeSinceLastCollision >= INTERVAL_BETWEEN_MOB_COLLISIONS_MILIS) {
                        player.playerManageDamages();
                        pHUD.drawPlayerHUD();
                        audio.playerMobHit();
                        player.pTimeSinceLastCollision = performance.now();
                    }
                }

                if (!(mob[NAMEobj] === "slimeBlckA"))
                    this.moveMobs(mob, mob[MOBTravelD], mob[MOBInitX], mob[MOBSpeed]);

                let IMAGE;

                if (mob[MOBSpeed] > 0)
                    IMAGE = MobImages[mob[NAMEobj]];
                else
                    IMAGE = MobImages[`${mob[NAMEobj]}F`];

                let WIDTH = mob[Wobject];
                let HEIGHT = mob[Hobject];
                let X = mob[Xobject] - (Math.abs((IMAGE.width / mobsColumns) - WIDTH)) / 2;
                let Y = mob[Yobject] - (Math.abs(IMAGE.height - HEIGHT));

                this.drawAnimation(IMAGE, mobsColumns, X, Y, mob[Hobject], mob[ARefreshT], mob, mob[ARepeat]);
            }
            //canvas.Contexts.gameCanvasCxt.fillStyle = "red";
            //canvas.Contexts.gameCanvasCxt.fillRect(mob[Xobject], mob[Yobject], mob[Wobject], mob[Hobject]);
        });
    }

    moveMobs(mob, distT, initX, speed) {
        if (((mob[Xobject] + mob[Wobject] > initX + distT) && speed > 0) || ((mob[Xobject] < initX - distT) && speed < 0))
            mob[MOBSpeed] = -mob[MOBSpeed];

        mob[Xobject] += mob[MOBSpeed];
    }

    moveSlimeBlck(mob, Y, initY, Height) {
        if (Y + Height >= initY - mob[MOBVertSpeedChange])
            mob[MOBVertSpeedChange] = -mob[MOBVertSpeed];

        mob[MOBVertSpeedChange] += player.GRAVITY;
        mob[Yobject] += mob[MOBVertSpeedChange];
    }
}