import { Container } from "pixi.js";
import { Subject } from "rxjs";
import { HAND_SELECTION, PLAYER_TYPE, RPS_GAME_STATE } from "../utils/constants";
import { removeTween } from "../utils/gsap";
import { HandObject, PlayerObject } from "../utils/models";
import { createContainer } from "../utils/pixi";
import { createHandObject } from "./handObject";
import { enterPlayer, exitPlayer, preparePlayer, revealHand, setupHandObject, winHand } from "./rockPaperScissorsFunctions";



export const createPlayerObject = (parentContainer: Container) => (type: PLAYER_TYPE) => {
    const container = createContainer("PlayerObject");
    parentContainer.addChild(container);

    let playerType: PLAYER_TYPE = type;
    let subject = new Subject<RPS_GAME_STATE>();
    let handObject: HandObject = createHandObject(container);

    // add set hand type here

    setupHandObject(handObject.container)(type);

    const setHandType = (hand: HAND_SELECTION) => {
        handObject.setHandSelected(hand);
    }

    const reset = (handObject) => (type: PLAYER_TYPE) => {
        removeTween(handObject);

        handObject.scale.set(1);

        setupHandObject(handObject)(type);
    }

    return <PlayerObject>{
        reset: () => reset(handObject.container)(playerType),
        enter: () => enterPlayer(handObject)(playerType)(subject),
        prepare: () => preparePlayer(handObject.container)(subject),
        reveal: () => revealHand(handObject)(playerType)(subject),
        win: () => winHand(handObject.container)(playerType),
        exit: () => exitPlayer(handObject)(playerType)(subject),
        set: setHandType,
        getHandType: handObject.getHandSelected
    }
}
