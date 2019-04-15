const BACKGROUND_COLOR = "#453C3C";

class CANVAS {
    constructor() {
        this.Canvases = {
            uiCanvas: null,
            randomBlocksC: null,
            upperBlocksC: null,
            gameCanvas: null,
            lowerBlocksC: null,
            lowerBuildingBlocksC: null,
            backgroundCanvas: null
        };

        this.initCanvases();
        this.initContexts();

        this.clearScreen();
    }

    initCanvases() {
        this.WIDTH = 1280;
        this.HEIGHT = 720;

        let div = document.getElementById("stage");
        let divChlds = div.childNodes;
        let canvasElements = [];

        for (let i = 0; i < divChlds.length; i++) {
            if (divChlds[i].nodeName === "CANVAS") {
                let VISIBILITY = "hidden";

                if (divChlds[i].id === "gameCanvas" || divChlds[i].id === "uiCanvas" || divChlds[i].id === "backgroundCanvas") {

                    divChlds[i].width = this.WIDTH;
                    divChlds[i].height = this.HEIGHT;

                    divChlds[i].style.border = "1px solid white";

                    VISIBILITY = "visible";
                }

                divChlds[i].style.visibility = VISIBILITY;
                divChlds[i].imageSmoothingEnabled = false;

                const context = divChlds[i].getContext("2d");
                context.clearRect(0, 0, divChlds[i].width, divChlds[i].height);

                canvasElements.push(divChlds[i]);
            }
        }

        let index = 0;

        for (let property in this.Canvases)
            this.Canvases[property] = canvasElements[index++];
    }

    initContexts() {
        this.Contexts = {};

        for (let property in this.Canvases)
            this.Contexts[`${property}Cxt`] = this.Canvases[property].getContext("2d");
    }

    drawCanvas(context, canvasToDraw) {
        context.drawImage(canvasToDraw, 0, 0);
    }

    clearScreen() {
        this.Contexts.gameCanvasCxt.setTransform(1, 0, 0, 1, 0, 0);
        this.Contexts.gameCanvasCxt.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    }
}