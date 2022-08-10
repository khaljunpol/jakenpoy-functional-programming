import { Container } from "pixi.js";
import { Subject } from "rxjs";
import { GAME_LOOP_STATES, RESULT, RPS_GAME_STATE, STATE_ACTIONS } from "../utils/constants";
import { CounterObject, GameLoopObject, PlayerObject, RockPaperScissorsController as RockPaperScissorsContainerObject } from "../utils/models";
import { createContainer } from "../utils/pixi";
import { createCounterObject } from "./counterObject";
import { hideRockPaperScissors, prepareRockPaperScissors, revealHandRockPaperScissors, showRockPaperScissors, showWinRockPaperScissors } from "./rockPaperScissorsFunctions";

const onUpdateGameState = (state) => (container: Container) =>
    (playerObject: PlayerObject, compObject: PlayerObject) =>
        (subject: Subject<RPS_GAME_STATE>) => (counterObject: CounterObject) => {

            if (state.context.state == GAME_LOOP_STATES.PLAY) {
                // Display main container
                if (state.matches(`${GAME_LOOP_STATES.PLAY}.${STATE_ACTIONS.SETUP}`)) {
                    counterObject.reset();
                    showRockPaperScissors(container)(playerObject, compObject)(subject)
                }
            }

            // If on End Phase
            if (state.context.state == GAME_LOOP_STATES.END) {

                // If on End Process phase
                if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.END_PROCESS}`)) {

                    if (state.context.result !== RESULT.DRAW) {
                        // Emphasize the winning hand
                        showWinRockPaperScissors(state.context.result == RESULT.WIN)(playerObject, compObject)
                    }
                }

                // Hide/Exit the playing hand
                if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.ADDITIONAL_END_PROCESS}`)) {
                    hideRockPaperScissors(container)(playerObject, compObject)
                }
            }
        }

const onCompleteState = (state: RPS_GAME_STATE) => (mainGameMachine: GameLoopObject) =>
    (playerObject: PlayerObject, compObject: PlayerObject) => (subject: Subject<RPS_GAME_STATE>) =>
        (showCounterIndexIncrement: () => void) => {
            switch (state) {
                case RPS_GAME_STATE.ENTER:
                    mainGameMachine.gameLoopMachineService.send("DONE_ENTER");
                    showCounterIndexIncrement();
                    prepareRockPaperScissors(playerObject, compObject)(subject);
                    break;

                case RPS_GAME_STATE.PREPARE:
                    mainGameMachine.gameLoopMachineService.send("DONE_PREPARE");
                    revealHandRockPaperScissors(playerObject, compObject)(subject);
                    break;

                case RPS_GAME_STATE.SHOW:
                    // Continue to exit
                    mainGameMachine.gameLoopMachineService.send("DONE_SHOW");
                    break;

                case RPS_GAME_STATE.EXIT:
                    break;
            }
        }

export const createRockPaperScissorsController = (mainGameMachine: GameLoopObject) => (mainGameContainer: Container) => {
    const container = createContainer("RockPaperScissorsContainer");
    mainGameContainer.addChild(container);
    container.visible = false;

    let playerObject: PlayerObject;
    let compObject: PlayerObject;
    let counterObject: CounterObject = createCounterObject(container);

    let subject = new Subject<RPS_GAME_STATE>();

    subject.subscribe({
        next: (type) => onCompleteState(type)(mainGameMachine)(playerObject, compObject)(subject)(showCounterIndexIncrement)
    })

    mainGameMachine.gameSubject.subscribe({
        next: (state) => onUpdateGameState(state)(container)(playerObject, compObject)(subject)(counterObject)
    })

    const referencePlayers = (pObj: PlayerObject, cObj: PlayerObject) => {
        playerObject = pObj, compObject = cObj
    }

    const showCounterIndexIncrement = () => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                counterObject.showCounterIndex(i);
            }, i * 475);
        }
    }

    return <RockPaperScissorsContainerObject>{ container, referencePlayers }
}