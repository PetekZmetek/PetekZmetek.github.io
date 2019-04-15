const scaleRatio = 10;
let camX, camY;

class GameCamera {
    constructor() {
        this.cameraLeftOffset = 500;
        this.cameraBottomOffset = 300;
        this.cameraTopOffset = canvas.HEIGHT - this.cameraBottomOffset;
        this.ratio = 1;
    }

    transformCamera(pXchange, pX) {
        if (pXchange > 0 && pX > this.cameraLeftOffset)
            this.ratio -= pXchange / scaleRatio;
        else if (pXchange < 0 && pX > this.cameraLeftOffset)
            this.ratio += -(pXchange / scaleRatio);

        canvas.Contexts.gameCanvasCxt.setTransform(1, 0, 0, 1, this.ratio, 0);

        canvas.Contexts.gameCanvasCxt.setTransform(1, 0, 0, 1, 1, 1);
    }

    updateCamera() {
        if (player.X <= this.cameraLeftOffset)
            camX = 0;
        else if (player.X >= 9600 - (canvas.WIDTH - this.cameraLeftOffset))
            camX = -(9600 - canvas.WIDTH);
        else
            camX = -(player.X - this.cameraLeftOffset);


        if (player.Y + this.cameraBottomOffset >= map.totalMapHeight)
            camY = -map.CanvasMapOffsetY;
        else if (player.Y - this.cameraTopOffset <= 0)
            camY = 0;
        else
            camY = -(player.Y + this.cameraBottomOffset) + canvas.HEIGHT;

        canvas.Contexts.gameCanvasCxt.translate(camX, camY);
    }

    get camX() {
        return camX;
    }

    get camY() {
        return camY;
    }
}