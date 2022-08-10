import { loader } from "../loader";
export enum GAME_LOOP_STATES {
    INITIALIZE = "INITIALIZE",
    START = "START",
    PLAY = "PLAY",
    END = "END"
}

export enum STATE_ACTIONS {
    SETUP = "SETUP",
    PROCESS = "PROCESS",
    END_PROCESS = "END_PROCESS",
    ADDITIONAL_END_PROCESS = "ADDITIONAL_END_PROCESS",
    COMPLETE = "COMPLETE"
}

export enum HAND_SELECTION {
    ROCK = "ROCK",
    PAPER = "PAPER",
    SCISSORS = "SCISSORS"
}
export enum PLAYER_TYPE {
    USER = "USER",
    COMP = "COMP"
}
export enum RESULT {
    WIN = "WIN",
    LOSE = "LOSE",
    DRAW = "DRAW"
}


export enum SELECTION_STATE {
    SELECT_START = "SELECT_START",
    SELECTED = "SELECTED",
    SELECT_END = "SELECT_END"
}
export enum RPS_GAME_STATE {
    ENTER = "ENTER",
    PREPARE = "PREPARE",
    SHOW = "SHOW",
    EXIT = "EXIT"
}

export enum RESULT_STATE {
    PRESENT_START = "PRESENT_START",
    PRESENTED = "PRESENTED",
    PRESENT_COMPLETE = "PRESENT_COMPLETE"
}

export enum MACHINE_ACTIONS {
    SET_STATE_INITIALIZE = "SET_STATE_INITIALIZE",
    SET_STATE_START = "SET_STATE_START",
    SET_STATE_PLAY = "SET_STATE_PLAY",
    SET_STATE_END = "SET_STATE_END",
    SET_HAND = "SET_HAND",
    SET_RESULT = "SET_RESULT",
}

export const machineConfigData = () => {

    let data = loader.resources["machineConfig"].data;

    return data;
}


export const hand_selection = Object.keys(HAND_SELECTION);

export const getResults = (playerHand: HAND_SELECTION) => (compHand: HAND_SELECTION) => {
    switch (playerHand + compHand) {
        case 'ROCKSCISSORS':
        case 'PAPERROCK':
        case 'SCISSORSPAPER':
            return { win: true, lose: false, draw: false }
        case 'ROCKPAPER':
        case 'SCISSORSROCK':
        case 'PAPERSCISSORS':
            return { win: false, lose: true, draw: false }
        default:
            return { win: false, lose: false, draw: true }
    }
}

export const randomizeCompHand = () => {
    let values = Object.keys(HAND_SELECTION)
    let idx = Math.floor(Math.random() * values.length);
    let randValue = values[idx];

    return HAND_SELECTION[randValue];
}

export const increment = (object: number) => {
    let obj = object + 1;
    return obj;
}