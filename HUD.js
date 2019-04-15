class HUD {
    constructor() {
        this.livesOffset = 64;
        this.scoreOffset = 40;

        this.initHUD();
    }

    drawHUDWhenLoaded() {
        for (let hudImg in pNbsHUD) {
            if (pNbsHUD.hasOwnProperty(hudImg)) {
                pNbsHUD[hudImg].onload = () => {
                    this.drawPlayerHUD();
                }
            }
        }
    }

    initHUD() {
        map.initSheets([pNbsHUD], [pNbsHUDSources]);
    }

    drawPlayerHUD() {
        canvas.Contexts.uiCanvasCxt.clearRect(0, 0, canvas.WIDTH, canvas.HEIGHT);

        this.drawLives();
        this.drawHearts();
        this.drawScore();
    }

    drawLives() {
        canvas.Contexts.uiCanvasCxt.drawImage(pNbsHUD.pIcon, 0 * this.livesOffset, 0);
        canvas.Contexts.uiCanvasCxt.drawImage(pNbsHUD.hudX, 1 * this.livesOffset, 0);

        let nbsImgNmbW = pNbsHUD.hudNmbs.width / 10;
        let nbsImgNmbH = pNbsHUD.hudNmbs.height;

        canvas.Contexts.uiCanvasCxt.drawImage(pNbsHUD.hudNmbs, player.pLIVES * nbsImgNmbW, 0, nbsImgNmbW, nbsImgNmbH, 2 * this.livesOffset, 0, nbsImgNmbW, nbsImgNmbH);
    }

    drawHearts() {
        let hImgW = pNbsHUD.hudHearts.width / 2;
        let hImgH = pNbsHUD.hudNmbs.height;

        for (let i = 0; i < 5; i++) {
            let imageToDraw;

            if (i + 1 > player.pDAMAGE)
                imageToDraw = 0;
            else
                imageToDraw = 1;

            canvas.Contexts.uiCanvasCxt.drawImage(pNbsHUD.hudHearts, imageToDraw * hImgW, 0, hImgW, hImgH, i * this.livesOffset, 100, hImgW, hImgH);
        }
    }

    drawScore() {
        let strScore = player.pSCORE.toString();
        let offset = strScore.length + 1;

        let nbsImgNmbW = pNbsHUD.hudNmbs.width / 10;
        let nbsImgNmbH = pNbsHUD.hudNmbs.height;

        for (let c = 0; c < strScore.length; c++, offset--) {
            let scoreNmb = parseInt(strScore.charAt(c));
            canvas.Contexts.uiCanvasCxt.drawImage(pNbsHUD.hudNmbs, scoreNmb * nbsImgNmbW, 0, nbsImgNmbW, nbsImgNmbH, canvas.WIDTH - offset * this.scoreOffset, 0, nbsImgNmbW, nbsImgNmbH);
        }
    }
}