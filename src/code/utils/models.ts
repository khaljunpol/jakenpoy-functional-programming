import { Container, Sprite } from "pixi.js";
import { Subject } from "rxjs";
import { Interpreter } from "xstate";
import { GAME_LOOP_STATES, HAND_SELECTION, PLAYER_TYPE, RESULT, RESULT_STATE, RPS_GAME_STATE, SELECTION_STATE, STATE_ACTIONS } from "./constants";

export interface GameLoopContext {
    state: GAME_LOOP_STATES,
    win: number,
    lose: number,
    draw: number,
    result: RESULT,
    playerHand: HAND_SELECTION,
    compHand: HAND_SELECTION
}

export interface GameLoopSchema {
    states: {
        [GAME_LOOP_STATES.INITIALIZE]: {};
        [GAME_LOOP_STATES.START]: {
            states: {
                [STATE_ACTIONS.SETUP]: {};
                [STATE_ACTIONS.PROCESS]: {
                    [SELECTION_STATE.SELECT_START]: {};
                    [SELECTION_STATE.SELECTED]: {};
                };
                [STATE_ACTIONS.END_PROCESS]: {};
                [STATE_ACTIONS.COMPLETE]: {};
            };
        };
        [GAME_LOOP_STATES.PLAY]: {
            states: {
                [STATE_ACTIONS.SETUP]: {};
                [STATE_ACTIONS.PROCESS]: {
                    states: {
                        [RPS_GAME_STATE.ENTER]: {};
                        [RPS_GAME_STATE.PREPARE]: {};
                        [RPS_GAME_STATE.SHOW]: {};
                        [RPS_GAME_STATE.EXIT]: {};
                    };
                };
                [STATE_ACTIONS.END_PROCESS]: {};
                [STATE_ACTIONS.COMPLETE]: {};
            };
        };
        [GAME_LOOP_STATES.END]: {
            states: {
                [STATE_ACTIONS.SETUP]: {};
                [STATE_ACTIONS.PROCESS]: {
                    states: {
                        [RESULT_STATE.PRESENT_START]: {};
                        [RESULT_STATE.PRESENTED]: {};
                        [RESULT_STATE.PRESENT_COMPLETE]: {};
                    };
                };
                [STATE_ACTIONS.END_PROCESS]: {};
                [STATE_ACTIONS.ADDITIONAL_END_PROCESS]: {};
                [STATE_ACTIONS.COMPLETE]: {};
            };
        };
    };
}


export interface GameLoopObject {
    gameLoopContext: GameLoopContext;
    gameLoopMachineService: Interpreter<GameLoopMachine>;
    gameSubject: Subject<Interpreter<GameLoopMachine>>;
    setHandSelected: (type: PLAYER_TYPE) => (hand: HAND_SELECTION) => void;
    setResult: (win: boolean) => (lose: boolean) => (draw: boolean) => void;
}

export interface GameLoopMachine {
    context: GameLoopContext;
    event: any;
    state: GameLoopSchema;
}

export interface ContainerObject {
    container: Container
}


export interface ShowHideContainerObject extends ContainerObject {
    show: () => void;
    hide: () => void;
}

export interface ShowHideScoreContainerObject extends ShowHideContainerObject {
    setResult: (win: number) => (lose: number) => (draw: number) => void;
}

export interface ShowHideSpriteObject {
    sprite: Sprite;
    show: () => void;
    hide: () => void;
}
export interface SelectionObject extends ContainerObject {
    reset: () => {};
}

export interface RockPaperScissorsController extends ContainerObject {
    referencePlayers: (pObj: PlayerObject, cObj: PlayerObject) => void
}

export interface SelectionObjects {
    subject: Subject<HAND_SELECTION>;
    selections: SelectionObject[]
}

export interface HandObject extends ContainerObject {
    setHandSelected: (hand: HAND_SELECTION) => void;
    showInitialHand: () => void;
    showSelectedHand: () => void;
    getHandSelected: HAND_SELECTION
}

export interface PlayerObject {
    getHandType: HAND_SELECTION;
    reset: () => void;// (container: Container) => (type: PLAYER_TYPE) => void;
    win: () => void;// (container: Container) => (type: PLAYER_TYPE) => void;
    set: (hand: HAND_SELECTION) => void;
    prepare: () => Promise<void>; // (container: Container) => (subject: Subject<RPS_GAME_STATE>) => Promise<void>;
    enter: () => Promise<void>; //(handObject: HandObject) => (type: PLAYER_TYPE) => (subject: Subject<RPS_GAME_STATE>) => Promise<void>;
    reveal: () => Promise<void>; //(handObject: HandObject) => (type: PLAYER_TYPE) => (subject: Subject<RPS_GAME_STATE>) => Promise<void>;
    exit: () => Promise<void>; //(handObject: HandObject) => (type: PLAYER_TYPE) => (subject: Subject<RPS_GAME_STATE>) => Promise<void>;
}

export interface CounterObject {
    reset: () => void;
    showCounterIndex: (index: number) => void;
}

export interface PopUpObject {
    reset: () => void;
    show: () => void;
}

export interface ResultObject {
    reset: (sprites: Record<string, Sprite>) => void;
    setResult: (result: RESULT) => void;
    showSelectedResult: () => void;
    showResult: () => void;
    hideResult: () => void;
}