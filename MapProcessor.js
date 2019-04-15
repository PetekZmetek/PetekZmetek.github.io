const Background = "BACKGROUND",
    LowerBuildingBlocks = "LowerBuildingBlocks",
    LowerBlocks = "LowerBlocks",
    UpperBlocks = "UpperBlocks",
    RandomBlocks = "RandomBlocks";
const NumberOfLayers = 4,
    BackgroundLayers = 1,
    nGrassB = 80,
    nRandomB = 1176,
    nGrassShrroms = 48,
    nTriggerImages = 42;
nBuildings = 400;
universalOffsetX = -40,
    universalOffsetY = -330;
let lowerBuildingBlocksIndex, lowerBlocksIndex, upperBlocksIndex, randomBlocksIndex;

class MapProcessor {
    constructor(tldM, tempM) {
        this.LEVEL = tempM;
        this.initMapProcessor(tldM);
    }

    // ************ CORE DRAWING FUNCTIONS ************ //

    drawMapBlocksWhenLoaded() {
        for (let bImage in MapImages) {
            if (MapImages.hasOwnProperty(bImage)) {
                MapImages[bImage].onload = () => {
                    this.drawLowerBuildingBlocks(bImage);
                    this.drawLowerBlocks(bImage);
                    this.drawUpperBlocks(bImage);
                    this.drawRandomBlocks(bImage);
                }
            }
        }
    }

    drawBackgroundWhenLoaded() {
        for (let bckgImg in MapBackgrounds) {
            if (MapBackgrounds.hasOwnProperty(bckgImg)) {
                MapBackgrounds[bckgImg].onload = function () {
                    this.drawBackground(bckgImg);
                }.bind(this);
            }
        }
    }

    // ************ DRAWING FUNCTIONS ************ //

    drawBlockLayer(bImage, layerNumber, cxt) {
        if (bImage === "grassBlocks") {
            this.drawBlocks(cxt, this.AllMapBlocks[layerNumber], MapImages[bImage], 0);
        } else if (bImage === "randomBlocks")
            this.drawBlocks(cxt, this.AllMapBlocks[layerNumber], MapImages[bImage], nGrassB);
        else if (bImage === "plantsShrooms")
            this.drawBlocks(cxt, this.AllMapBlocks[layerNumber], MapImages[bImage], nGrassB + nRandomB);
        else if (bImage === "triggerImages")
            this.drawBlocks(cxt, this.AllMapBlocks[layerNumber], MapImages[bImage], nGrassB + nRandomB + nGrassShrroms);
        else if (bImage === "buildings")
            this.drawBlocks(cxt, this.AllMapBlocks[layerNumber], MapImages[bImage], nGrassB + nRandomB + nGrassShrroms + nTriggerImages);
        else if (bImage === "castle")
            this.drawBlocks(cxt, this.AllMapBlocks[layerNumber], MapImages[bImage], nGrassB + nRandomB + nGrassShrroms + nTriggerImages + nBuildings);
    }

    drawRandomBlocks(bImage) {
        this.drawBlockLayer(bImage, randomBlocksIndex, canvas.Contexts.randomBlocksCCxt);
    }

    drawUpperBlocks(bImage) {
        this.drawBlockLayer(bImage, upperBlocksIndex, canvas.Contexts.upperBlocksCCxt);
    }

    drawLowerBlocks(bImage) {
        this.drawBlockLayer(bImage, lowerBlocksIndex, canvas.Contexts.lowerBlocksCCxt);
    }

    drawLowerBuildingBlocks(bImage) {
        this.drawBlockLayer(bImage, lowerBuildingBlocksIndex, canvas.Contexts.lowerBuildingBlocksCCxt);
    }

    drawBlocks(cxt, aBlocks, bImage, difference) {
        for (let y = 0; y < this.mapHEIGHT; y++) {
            for (let x = 0; x < this.mapWIDTH; x++) {
                if (aBlocks[y][x] !== 0) {
                    cxt.drawImage(bImage, ((aBlocks[y][x] - difference - 1) % (bImage.width / this.tileWIDTH)) * this.tileWIDTH,
                        Math.floor((aBlocks[y][x] - difference - 1) / (bImage.width / this.tileWIDTH)) * this.tileHEIGHT, this.tileWIDTH, this.tileHEIGHT,
                        x * this.tileWIDTH, y * this.tileHEIGHT, this.tileWIDTH, this.tileHEIGHT);
                }
            }
        }
    }

    drawBackground(bckgImg) {
        canvas.Contexts.backgroundCanvasCxt.drawImage(MapBackgrounds[bckgImg], 0, 0, canvas.WIDTH, canvas.HEIGHT);
    }

    // ************ INITIALIZATION METHODS ************ //

    initMapProcessor(tMAP) {
        this.initBasicLayers(tMAP);
        this.initImportantVariables(tMAP);
        this.initAllBlocks(NumberOfLayers, tMAP);
        this.initLayersOfObjects(tMAP);

        this.initSheets([MapImages, MapBackgrounds, AnimationImages, MobImages], [MapSources, BackgroundSources, AnimationSources, MobImagesSources]);
    }

    initBasicLayers(tMAP) {
        tMAP.layers.forEach(layer => {
            if (layer.name === Background)
                BackgroundSources[0] = layer.image;
            else if (layer.name === LowerBlocks)
                lowerBlocksIndex = tMAP.layers.indexOf(layer) - BackgroundLayers;
            else if (layer.name === UpperBlocks)
                upperBlocksIndex = tMAP.layers.indexOf(layer) - BackgroundLayers;
            else if (layer.name === RandomBlocks)
                randomBlocksIndex = tMAP.layers.indexOf(layer) - BackgroundLayers;
            else if (layer.name === LowerBuildingBlocks)
                lowerBuildingBlocksIndex = tMAP.layers.indexOf(layer) - BackgroundLayers;
        });
    }

    initImportantVariables(tMAP) {
        this.mapWIDTH = tMAP.width;
        this.mapHEIGHT = tMAP.height;

        this.tileWIDTH = tMAP.tilewidth;
        this.tileHEIGHT = tMAP.tileheight;

        this.totalMapHeight = this.mapHEIGHT * this.tileHEIGHT;
        this.CanvasMapOffsetY = Math.abs(canvas.HEIGHT - this.totalMapHeight);
    }

    initLayersOfObjects(tMAP) {
        this.TriggerBlocks = [];
        this.CollisionBlocks = [];
        this.Mobs = [];

        for (let i = NumberOfLayers + BackgroundLayers; i < tMAP.layers.length; i++) {
            if (tMAP.layers[i].name === "Triggers")
                this.addObjectToObjectGroup(tMAP.layers[i].objects, this.TriggerBlocks);
            else if (tMAP.layers[i].name === "Collisions")
                this.addObjectToObjectGroup(tMAP.layers[i].objects, this.CollisionBlocks);
            else if (tMAP.layers[i].name === "Mobs")
                this.addObjectToObjectGroup(tMAP.layers[i].objects, this.Mobs);
        }
    }

    addObjectToObjectGroup(objectA, BlockGroup) {
        objectA.forEach(object => {
            let x = object.x;
            let y = object.y;
            let width = object.width;
            let height = object.height;
            let name = object.name;

            if (object.type === "animation") {
                let refreshR = object.properties[0].value;
                let repeat = object.properties[1].value;

                this.addObjectToAGroup(BlockGroup, x, y, width, height, name, 0, 0, repeat, refreshR);
                return;
            } else if (object.type === "animationSpring") {
                let refreshR = object.properties[0].value;
                let repeat = object.properties[1].value;
                let speed = object.properties[2].value;

                this.addObjectToAGroup(BlockGroup, x, y, width, height, name, 0, 0, repeat, refreshR, speed);
                return;
            } else if (object.type === "mobAnimation") {
                let distT = object.properties[0].value;
                let refreshR = object.properties[1].value;
                let repeat = object.properties[2].value;
                let speed = object.properties[3].value;
                let vertSpeed = object.properties[4].value;
                let vertSpeedChange = 0;
                let initX = x + width / 2;
                let initY = y + height;

                this.addObjectToAGroup(BlockGroup, x, y, width, height, name, 0, 0, repeat, refreshR, speed, vertSpeed, vertSpeedChange, distT, initX, initY);
                return;
            }

            BlockGroup.push([x, y, width, height, name, 0, 0]);
        });
    }

    addObjectToAGroup(blockGroup, ...properties) {
        blockGroup.push([...properties]);
    }

    initAllBlocks(numberOfLayers, tMAP) {
        this.AllMapBlocks = [];

        for (let i = BackgroundLayers; i < numberOfLayers + BackgroundLayers; i++)
            this.AllMapBlocks.push(this.initBlockData(i, tMAP));
    }

    initBlockData(layerNumber, tMAP) {
        let mapBlocks = [];
        let tempA = tMAP.layers[layerNumber].data;

        for (let i = 0; i < tempA.length; i++) {
            if ((i % this.mapWIDTH) === 0) {
                mapBlocks.push([]);
                mapBlocks[mapBlocks.length - 1][i % this.mapWIDTH] = tempA[i];
            } else {
                mapBlocks[Math.floor(i / this.mapWIDTH)][i % this.mapWIDTH] = tempA[i];
            }
        }

        return mapBlocks;
    }

    initSheets([...imageObject], [...sourceArray]) {
        for (let i = 0; i < imageObject.length; i++) {
            let index = 0;
            for (let property in imageObject[i]) {
                imageObject[i][property] = new Image();
                imageObject[i][property].src = sourceArray[i][index++];
            }
        }
    }

    get numberOfCoins() {
        return numberOfCoins;
    }
}


// ************ MAP IMAGES ************ //

let BackgroundSources = [
    ""
];

let MapBackgrounds = {
    mapBackground: null
};

let MapSources = [
    "Map Images/grassBlocks.png",
    "Map Images/randomBlocks.png",
    "Map Images/mapPlants.png",
    "Map Images/triggerImages.png",
    "Map Images/buildings.png",
    "Map Images/castle.png"
];

let MapImages = {
    grassBlocks: null,
    randomBlocks: null,
    plantsShrooms: null,
    triggerImages: null,
    buildings: null,
    castle: null
};

let AnimationSources = [
    "Animation Images/springA.png",
    "Animation Images/coinA.png",
    "Animation Images/torchA.png",
    "Animation Images/leverA.png",
    "Animation Images/doorA.png",
    "Animation Images/flagA.png"
];

let AnimationImages = {
    springA: null,
    coinA: null,
    torchA: null,
    leverA: null,
    doorA: null,
    flagA: null
};

let MobImagesSources = [
    "Mobs Images/beeA.png",
    "Mobs Images/beeAF.png",
    "Mobs Images/sawA.png",
    "Mobs Images/sawAF.png",
    "Mobs Images/frogA.png",
    "Mobs Images/frogAF.png",
    "Mobs Images/flyA.png",
    "Mobs Images/flyAF.png",
    "Mobs Images/snailA.png",
    "Mobs Images/snailAF.png",
    "Mobs Images/slimeBlckA.png",
    "Mobs Images/slimeBlckAF.png",
    "Mobs Images/slimeA.png",
    "Mobs Images/slimeAF.png",
    "Mobs Images/ladybugA.png",
    "Mobs Images/ladybugAF.png",
    "Mobs Images/mouseA.png",
    "Mobs Images/mouseAF.png"
];

let MobImages = {
    beeA: null,
    beeAF: null,
    sawA: null,
    sawAF: null,
    frogA: null,
    frogAF: null,
    flyA: null,
    flyAF: null,
    snailA: null,
    snailAF: null,
    slimeBlckA: null,
    slimeBlckAF: null,
    slimeA: null,
    slimeAF: null,
    ladybugA: null,
    ladybugAF: null,
    mouseA: null,
    mouseAF: null
};