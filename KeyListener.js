class KeyListener {
    constructor() {
        this.initKeyListener();
    }

    initKeyListener() {
        window.onkeydown = function (e) {
            let key = e.keyCode;

            switch (key) {
                case KEYS.VK_W:
                    KEYS.W_PRESSED = true;
                    break;
                case KEYS.VK_A:
                    KEYS.A_PRESSED = true;
                    break;
                case KEYS.VK_S:
                    KEYS.S_PRESSED = true;
                    break;
                case KEYS.VK_D:
                    KEYS.D_PRESSED = true;
                    break;
                case KEYS.VK_K:
                    KEYS.K_PRESSED = true;
                    break;
            }
        };

        window.onkeyup = function (e) {
            let key = e.keyCode;

            switch (key) {
                case KEYS.VK_W:
                    KEYS.W_PRESSED = false;
                    KEYS.handleWDown = true;
                    break;
                case KEYS.VK_A:
                    KEYS.A_PRESSED = false;
                    break;
                case KEYS.VK_S:
                    KEYS.S_PRESSED = false;
                    break;
                case KEYS.VK_D:
                    KEYS.D_PRESSED = false;
                    break;
                case KEYS.VK_K:
                    KEYS.K_PRESSED = false;
                    KEYS.handleKDown = true;
                    break;
            }
        }
    }
}

let KEYS = {
    VK_W: 87,
    VK_A: 65,
    VK_S: 83,
    VK_D: 68,
    VK_K: 75,

    W_PRESSED: false,
    A_PRESSED: false,
    S_PRESSED: false,
    D_PRESSED: false,
    K_PRESSED: false,

    handleWDown: true,
    handleKDown:true
};