import { Container } from "pixi.js";
import { Subject } from "rxjs";
import { GAME_LOOP_STATES, getResults, RESULT, RESULT_STATE, STATE_ACTIONS } from "../utils/constants";
import { ContainerObject, GameLoopObject, ResultObject } from "../utils/models";
import { createContainer } from "../utils/pixi";
import { hideResultView, showResultView } from "./resultFunctions";
import { createResultObject } from "./resultObject";

const onUpdateGameState = (state) => (container: Container) =>
    (resultObject: ResultObject) => (subject: Subject<RESULT_STATE>) => {
        // If on End phase
        if (state.context.state == GAME_LOOP_STATES.END) {

            // If on Setup phase
            if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.SETUP}`)) {

                // Get results from main game context
                let { win, lose, draw } = getResults(state.context.playerHand)(state.context.compHand);
                let result = draw ? RESULT.DRAW : win ? RESULT.WIN : RESULT.LOSE;

                // Display result
                showResultView(container)(result)(resultObject)(subject);
            }

            // If on extra END state
            if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.ADDITIONAL_END_PROCESS}`)) {
                // Hide the results panel
                hideResultView(resultObject)(subject).then(() => {
                    container.visible = false;
                });
            }
        }
    }

const onCompleteState = (state: RESULT_STATE) => (mainGameMachine) => (subject: Subject<RESULT_STATE>) => {
    switch (state) {
        case RESULT_STATE.PRESENT_START:
            mainGameMachine.gameLoopMachineService.send("DONE_PRESENT_START");
            subject.next(RESULT_STATE.PRESENTED);
            break;

        case RESULT_STATE.PRESENTED:
            mainGameMachine.gameLoopMachineService.send("DONE_PRESENTED");
            subject.next(RESULT_STATE.PRESENT_COMPLETE);
            break;

        case RESULT_STATE.PRESENT_COMPLETE:

            break;
    }
}

export const createResultsController = (mainGameMachine: GameLoopObject) => {
    const container = createContainer("ResultsContainer");

    const resultObject: ResultObject = createResultObject(container);

    let subject = new Subject<RESULT_STATE>();

    subject.subscribe({
        next: (type) => onCompleteState(type)(mainGameMachine)(subject)
    })

    mainGameMachine.gameSubject.subscribe({
        next: (state) => onUpdateGameState(state)(container)(resultObject)(subject)
    })

    return <ContainerObject>{ container }
}