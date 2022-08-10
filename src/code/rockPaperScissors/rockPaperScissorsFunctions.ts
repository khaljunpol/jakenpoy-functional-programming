
import gsap, { Back } from "gsap";
import { Container } from "pixi.js";
import { PLAYER_TYPE, RPS_GAME_STATE } from "../utils/constants";
import { animateFromTo } from "../utils/gsap";
import { offScreenXPos } from "../utils/pixi";

export const setupHandObject = (handObject) => (type: PLAYER_TYPE) => {
    handObject.position.x = -offScreenXPos();
    handObject.rotation = 1.5;

    if (type == PLAYER_TYPE.COMP) {
        handObject.position.x = offScreenXPos();
        handObject.scale.y = -1;
        handObject.rotation = 1.6;
    }
}

const enterFromToPosition = (type: PLAYER_TYPE) => {

    let from = type == PLAYER_TYPE.COMP ? offScreenXPos() : -offScreenXPos();
    let to = type == PLAYER_TYPE.COMP ? 300 : -300;

    return { from, to }
}
const exitFromToPosition = (type: PLAYER_TYPE) => {

    let from = type == PLAYER_TYPE.COMP ? 200 : -200;
    let to = type == PLAYER_TYPE.COMP ? offScreenXPos() : -offScreenXPos();

    return { from, to }
}

export const showRockPaperScissors = (container: Container) => (playerObject, compObject) => (subject) => new Promise((resolve) => {

    playerObject.reset();
    compObject.reset();

    container.visible = true;

    Promise.all([
        playerObject.enter(),
        compObject.enter(),
    ]).then(() => {
        subject.next(RPS_GAME_STATE.ENTER);
        resolve(true);
    });
});

export const prepareRockPaperScissors = (playerObject, compObject) => (subject) => new Promise((resolve) => {

    Promise.all([
        playerObject.prepare(),
        compObject.prepare(),
    ]).then(() => {
        subject.next(RPS_GAME_STATE.PREPARE);
        resolve(true);
    });
});

export const revealHandRockPaperScissors = (playerObject, compObject) => (subject) => new Promise((resolve) => {

    Promise.all([
        playerObject.reveal(),
        compObject.reveal(),
    ]).then(() => {
        subject.next(RPS_GAME_STATE.SHOW);
        resolve(true);
    });
});

export const hideRockPaperScissors = (container: Container) => (playerObject, compObject) => new Promise((resolve) => {
    Promise.all([
        playerObject.exit(),
        compObject.exit(),
    ]).then(() => {
        container.visible = false;
        resolve(true);
    });
});

export const showWinRockPaperScissors = (playerWin: boolean) => (playerObject, compObject) => {
    if (playerWin) {
        playerObject.win();
    }
    else {
        compObject.win();
    }
}

export const enterPlayer = (handObject) => (type: PLAYER_TYPE) => (subject) => new Promise((resolve) => {
    handObject.showInitialHand();

    let pos = enterFromToPosition(type);

    animateFromTo(handObject.container)(0)({ x: pos.from })(1)({
        x: pos.to, ease: Back.easeOut.config(2),
        onComplete: () => {
            subject.next(RPS_GAME_STATE.ENTER);
            resolve(true);
        }, delay: 0.5
    })
});

export const preparePlayer = (handObject) => (subject) => new Promise((resolve) => {
    let upDown = gsap.timeline({
        onComplete: () => {
            subject.next(RPS_GAME_STATE.PREPARE);
            resolve(true);
        }
    });

    upDown.to(handObject, { duration: 0.25, y: -100, ease: Back.easeOut.config(3) })
        .to(handObject, { duration: 0.25, y: 100, ease: Back.easeOut.config(3) })
        .to(handObject, { duration: 0.25, y: -100, ease: Back.easeOut.config(3) })
        .to(handObject, { duration: 0.25, y: 100, ease: Back.easeOut.config(3) })
});

export const revealHand = (handObject) => (type: PLAYER_TYPE) => (subject) => new Promise((resolve) => {
    let upDown = gsap.timeline({
        onComplete: () => {
            subject.next(RPS_GAME_STATE.SHOW);
            resolve(true);
        }
    });

    let pos = type == PLAYER_TYPE.COMP ? 200 : -200;

    let addSequence = () => {
        handObject.showSelectedHand();
        gsap.to(handObject.container, { duration: 0.25, x: pos }).yoyo(true);
    }

    upDown.to(handObject.container, { duration: 0.25, y: -100, ease: Back.easeOut.config(2) })
        .add(addSequence)
        .to(handObject.container, { duration: 0.25, y: 0, ease: Back.easeOut.config(2) })
});

export const winHand = (handObject) => (type: PLAYER_TYPE) => {

    let posfrom = type == PLAYER_TYPE.COMP ? 200 : -200;
    let posto = type == PLAYER_TYPE.COMP ? 150 : -150;

    gsap.to(handObject.scale, { duration: 0.5, x: handObject.scale.x * 1.2, y: handObject.scale.y * 1.2 });
    gsap.fromTo(handObject, { rotation: 1.4, x: posfrom }, {
        duration: 1,
        rotation: 1.6,
        x: posto,
        repeat: -1
    }).yoyo(true);
}

export const exitPlayer = (handObject) => (type: PLAYER_TYPE) => (subject) => new Promise((resolve) => {
    let pos = exitFromToPosition(type);

    animateFromTo(handObject.container)(0)({ x: pos.from })(1)({
        x: pos.to, ease: Back.easeOut.config(2),
        onComplete: () => {
            subject.next(RPS_GAME_STATE.ENTER);
            resolve(true);
        }, delay: 0.5
    })
});