const sEffectsVolume = 0.125,
    jumpSoundVolume = 0.5,
    ThemeMusicVolume = 0.025;

class GameAudio {
    constructor() {
        this.winPlaying = false;
        this.themePlaying = false;

        this.initGameSounds();
        this.playerGameThemeMusic();
    }

    playerGameThemeMusicStop() {
        GameSound["gameThemeMusicLEVEL2"].stop();
        GameSound["gameThemeMusicLEVEL1"].stop();
    }

    playerGameThemeMusic() {
        GameSound["gameThemeMusicLEVEL" + String(LEVELnmb + 1)].play();
    }

    playerJumpSound() {
        GameSound.jumpSound.play();
    }

    coinCollected() {
        GameSound.coinCollected.play();
    }

    springJump() {
        GameSound.springSound.play();
    }

    checkpoint() {
        GameSound.checkpoint.play();
    }

    playerHit() {
        GameSound.playerHit.play();
    }

    playerDeath() {
        GameSound.playerDeath.play();
    }

    playerMobHit() {
        GameSound.playerMobHit.play();
    }

    leverSound() {
        GameSound.leverSound.play();
    }

    playerWIN() {
        this.winPlaying = true;
        GameSound.jingleWin.play();
    }

    initGameSounds() {
        let i = 0;

        for (let property in GameSound) {
            let LOOP, VOLUME;

            if (property === "gameThemeMusicLEVEL1" || property === "gameThemeMusicLEVEL2") {
                LOOP = true;
                VOLUME = ThemeMusicVolume;
            } else if (property === "jumpSound") {
                LOOP = false;
                VOLUME = jumpSoundVolume;
            } else {
                LOOP = false;
                VOLUME = sEffectsVolume;
            }

            GameSound[property] = new Howl({
                src: GameSoundSources[i++],
                loop: LOOP,
                volume: VOLUME
            });
        }
    }
}

let GameSound = {
    gameThemeMusicLEVEL1: null,
    gameThemeMusicLEVEL2: null,

    coinCollected: null,
    springSound: null,
    jumpSound: null,
    playerHit: null,
    playerMobHit: null,
    leverSound: null,
    jingleWin: null,
    checkpoint: null,
    playerDeath: null
};

let GameSoundSources = [
    "GameSounds/gameThemeMusicLEVEL1.mp3",
    "GameSounds/gameThemeMusicLEVEL2.mp3",

    "GameSounds/coinCollected.mp3",
    "GameSounds/springSound.mp3",
    "GameSounds/jumpSound.mp3",
    "GameSounds/playerHit.mp3",
    "GameSounds/playerMobHit.wav",
    "GameSounds/leverSound.wav",
    "GameSounds/jingleWin.mp3",
    "GameSounds/checkpoint.mp3",
    "GameSounds/playerDeath.mp3"
];