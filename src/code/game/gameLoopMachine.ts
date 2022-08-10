import { from, Observable, Subject } from "rxjs";
import { createMachine, interpret, Interpreter } from "xstate";
import { GAME_LOOP_STATES, HAND_SELECTION, increment, machineConfigData, MACHINE_ACTIONS, PLAYER_TYPE, RESULT } from "../utils/constants";
import { GameLoopContext, GameLoopMachine, GameLoopObject } from "../utils/models";

const gameLoopContext = <GameLoopContext>{
    state: GAME_LOOP_STATES.START,
    win: 0,
    lose: 0,
    draw: 0,
    result: RESULT.DRAW,
    playerHand: HAND_SELECTION.PAPER,
    compHand: HAND_SELECTION.PAPER
};

export const createGameLoopMachine = () => {

    let _playerHand: HAND_SELECTION;
    let _compHand: HAND_SELECTION;
    let _win: boolean;
    let _lose: boolean;
    let _draw: boolean;
    let _configData = machineConfigData();

    let gameLoopMachine = createMachine(
        _configData, {
        actions: {
            [MACHINE_ACTIONS.SET_STATE_INITIALIZE]: (context) => {
                context.state = GAME_LOOP_STATES.INITIALIZE;
            },
            [MACHINE_ACTIONS.SET_STATE_START]: (context) => {
                context.state = GAME_LOOP_STATES.START;
            },
            [MACHINE_ACTIONS.SET_STATE_PLAY]: (context) => {
                context.state = GAME_LOOP_STATES.PLAY;
            },
            [MACHINE_ACTIONS.SET_STATE_END]: (context) => {
                context.state = GAME_LOOP_STATES.END;
            },
            [MACHINE_ACTIONS.SET_HAND]: (context) => {
                context.playerHand = _playerHand;
                context.compHand = _compHand;
            },
            [MACHINE_ACTIONS.SET_RESULT]: (context) => {
                if (_draw) {
                    context.draw = increment(context.draw);
                }
                if (_win) {
                    context.win = increment(context.win);
                }
                if (_lose) {
                    context.lose = increment(context.lose);
                }
                context.result = gameLoopContext.result = _draw ? RESULT.DRAW : _win ? RESULT.WIN : RESULT.LOSE
            },
        }
    });

    let gameLoopMachineService = interpret(gameLoopMachine);

    gameLoopMachineService.start();

    let gameObservable = from(gameLoopMachineService);

    let gameSubject = new Subject();

    gameObservable.subscribe(gameSubject);

    const setHandSelected = (type: PLAYER_TYPE) => (hand: HAND_SELECTION) => {
        switch (type) {
            case PLAYER_TYPE.COMP:
                _compHand = hand;
                break;
            case PLAYER_TYPE.USER:
                _playerHand = hand;
                break;
        }
    }

    const setResult = (win: boolean) => (lose: boolean) => (draw: boolean) => {
        _win = win;
        _lose = lose;
        _draw = draw;
    }

    return <GameLoopObject>{ gameLoopContext, gameLoopMachineService, gameSubject, setHandSelected, setResult };
}
