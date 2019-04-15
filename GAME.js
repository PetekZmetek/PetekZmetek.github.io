let canvas, keyListener, map, camera, animations, triggerA, mobs, player, pHUD, audio, meter;
var animRequest, LEVELnmb = 0;

let LEVELS = ["Map/LEVEL_1.json", "Map/LEVEL_2.json"];

var GAME = {
    initGame: function () {
        this.mapSource = LEVELS[0];
        this.loadMap(this.loadMapDependantClasses);
    },

    loadMap: function (callback) {
        $.ajax({
            url: this.mapSource,
            async: true,
            success: callback
        });
    },

    loadMapDependantClasses: function (result) {
        let tldM = result;
        let tldMStable = Object.assign({}, result);

        canvas = new CANVAS();
        map = new MapProcessor(tldM, tldMStable);
        keyListener = new KeyListener();
        animations = new GameAnimations();
        triggerA = new TriggerAnimations();
        mobs = new Mobs();
        player = new PLAYER();
        camera = new GameCamera();
        pHUD = new HUD();
        meter = new FPSMeter();
        audio = new GameAudio();

        GAME.preRender();
        requestAnimationFrame(GAME.gameLOOP);
    },

    nextLevel: function () {
        if (this.mapSource === LEVELS[1]) {
            alert("THANKS FOR PLAYING!");
            location.reload();
        } else {
            this.mapSource = LEVELS[1];
            LEVELnmb = 1;
        }
        audio.playerGameThemeMusicStop();
        this.loadMap(this.loadMapDependantClasses);
    },

    restartGame: function () {
        audio.playerGameThemeMusicStop();
        pHUD.drawPlayerHUD();

        audio = new GameAudio();
        player = new PLAYER();
        triggerA.initBasicVariables();
    },

    preRender: function () {
        cancelAnimationFrame(animRequest);

        map.drawBackgroundWhenLoaded();
        map.drawMapBlocksWhenLoaded();
        pHUD.drawHUDWhenLoaded();
    },

    gameLOOP: function () {
        meter.tickStart();

        canvas.clearScreen();

        camera.updateCamera();


        canvas.drawCanvas(canvas.Contexts.gameCanvasCxt, canvas.Canvases.lowerBuildingBlocksC);
        canvas.drawCanvas(canvas.Contexts.gameCanvasCxt, canvas.Canvases.lowerBlocksC);

        triggerA.processAnimation();
        player.processPlayer();

        canvas.drawCanvas(canvas.Contexts.gameCanvasCxt, canvas.Canvases.upperBlocksC);
        canvas.drawCanvas(canvas.Contexts.gameCanvasCxt, canvas.Canvases.randomBlocksC);

        mobs.processMobs();

        meter.tick();
        animRequest = requestAnimationFrame(GAME.gameLOOP);
    }
};

window.onload = function () {
    GAME.initGame();
};