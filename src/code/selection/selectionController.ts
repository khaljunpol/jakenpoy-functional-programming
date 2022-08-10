import { Container } from "pixi.js";
import { GAME_LOOP_STATES, getResults, HAND_SELECTION, PLAYER_TYPE, randomizeCompHand, STATE_ACTIONS } from "../utils/constants";
import { ContainerObject, GameLoopObject, SelectionObjects, ShowHideSpriteObject } from "../utils/models";
import { createContainer } from "../utils/pixi";
import { createLogoObject } from "./logoObject";
import { createSelectHandObject } from "./selectHandObject";
import { hideSelection, showSelection } from "./selectionFunctions";
import { createSelectionObjects } from "./selectionObject";

const onClickSelection = (mainGameMachine: GameLoopObject) => (hand: HAND_SELECTION) => (container: Container) =>
    (setHandSelected: (type: PLAYER_TYPE) => (hand: HAND_SELECTION) => void) =>
        (setResult: (win: boolean) => (lose: boolean) => (draw: boolean) => void) => {

            setTimeout(() => {
                mainGameMachine.gameLoopMachineService.send("NEXT");
            }, 1000);

            container.interactiveChildren = false;

            let cHand = randomizeCompHand();
            setHandSelected(PLAYER_TYPE.USER)(hand);
            setHandSelected(PLAYER_TYPE.COMP)(cHand);

            // Get results from main game context
            let { win, lose, draw } = getResults(hand)(cHand);

            // Set result state to model
            setResult(win)(lose)(draw);
        }

const onUpdateGameState = (state, show, hide) => {
    if (state.context.state == GAME_LOOP_STATES.START) {
        if (state.matches(`${GAME_LOOP_STATES.START}.${STATE_ACTIONS.SETUP}`)) {
            show();
        }

        if (state.matches(`${GAME_LOOP_STATES.START}.${STATE_ACTIONS.END_PROCESS}`)) {
            hide();
        }
    }
}

export const createSelectionController = (mainGameMachine: GameLoopObject) => (mainGameContainer: Container) =>
    (setHandSelected: (type: PLAYER_TYPE) => (hand: HAND_SELECTION) => void) =>
        (setResult: (win: boolean) => (lose: boolean) => (draw: boolean) => void) => {
            const container = createContainer("SelectionContainer");
            mainGameContainer.addChild(container);
            container.visible = false;

            let objects: SelectionObjects = createSelectionObjects(container);
            let logo: ShowHideSpriteObject = createLogoObject(container);
            let select: ShowHideSpriteObject = createSelectHandObject(container);

            objects.subject.subscribe({
                next: (type) => onClickSelection(mainGameMachine)(type)(container)(setHandSelected)(setResult)
            })

            let showSelectionView = () => showSelection(container, objects.selections, logo, select);
            let hideSelectionView = () => hideSelection(container, objects.selections, logo, select);

            mainGameMachine.gameSubject.subscribe({
                next: (state) => onUpdateGameState(state, showSelectionView, hideSelectionView)
            })

            return <ContainerObject>{ container }
        }