const Xobject = 0,
    Yobject = 1,
    Wobject = 2,
    Hobject = 3,
    NAMEobj = 4,
    ATimeobj = 5,
    AINDEXobj = 6,
    ARepeat = 7,
    ARefreshT = 8,
    MOBSpeed = 9,
    MOBVertSpeed = 10,
    MOBVertSpeedChange = 11,
    MOBTravelD = 12,
    MOBInitX = 13,
    MOBInitY = 14;

class GameAnimations {

    drawAnimation(image, columns, aX, aY, aHEIGHT, refreshRate, arrayA, repeat) {
        if (performance.now() - arrayA[ATimeobj] >= refreshRate) {
            if (arrayA[AINDEXobj] < columns - 1) arrayA[AINDEXobj]++;
            else {
                if (repeat)
                    arrayA[AINDEXobj] = 0;
                else
                    arrayA[AINDEXobj] = columns - 1;
            }

            arrayA[ATimeobj] = performance.now();
        }

        canvas.Contexts.gameCanvasCxt.drawImage(image, arrayA[AINDEXobj] * (image.width / columns), 0, image.width / columns, image.height, aX, aY, image.width / columns, image.height);
    }

    drawPlainImage(image, columns, aX, aY, arrayA) {
        canvas.Contexts.gameCanvasCxt.drawImage(image, arrayA[AINDEXobj] * (image.width / columns), 0, image.width / columns, image.height, aX, aY, image.width / columns, image.height);
    }
}

const imageColumns = {
    springACols: 2,
    torchACols: 2,
    coinACols: 8,
    leverACols: 2,
    doorACols: 2,
    flagACols: 2
};