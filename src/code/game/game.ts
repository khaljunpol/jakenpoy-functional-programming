
import { loadAssets, loader } from "../loader";
import { createResultsController } from "../results/resultsController";
import { createPlayerObject } from "../rockPaperScissors/playerObject";
import { createRockPaperScissorsController } from "../rockPaperScissors/rockPaperScissorsController";
import { createSelectionController } from "../selection/selectionController";
import { GAME_LOOP_STATES, HAND_SELECTION, PLAYER_TYPE, STATE_ACTIONS } from "../utils/constants";
import { ContainerObject, GameLoopObject, PlayerObject, RockPaperScissorsController, ShowHideScoreContainerObject } from "../utils/models";
import { centerOnResize, createGameView } from "../utils/pixi";
import { createGameController } from "./gameController";
import { createGameLoopMachine } from "./gameLoopMachine";
import { createScoreObject } from "./scoreObject";

const startGame = () => {

    const app = createGameView();

    const gameLoopMachine: GameLoopObject = createGameLoopMachine();

    const setHandSelected = (type: PLAYER_TYPE) => (hand: HAND_SELECTION) => {
        switch (type) {
            case PLAYER_TYPE.COMP:
                compObject.set(hand);
                break;
            case PLAYER_TYPE.USER:
                playerObject.set(hand);
                break;
        }

        gameLoopMachine.setHandSelected(type)(hand);
    }

    const setResult = (win: boolean) => (lose: boolean) => (draw: boolean) => {
        gameLoopMachine.setResult(win)(lose)(draw);
    }

    const gameController: ContainerObject = createGameController();
    const selectionController: ContainerObject = createSelectionController(gameLoopMachine)(gameController.container)(setHandSelected)(setResult);
    const rpsController: RockPaperScissorsController = createRockPaperScissorsController(gameLoopMachine)(gameController.container);
    const resultsController: ContainerObject = createResultsController(gameLoopMachine);

    const playerObject: PlayerObject = createPlayerObject(rpsController.container)(PLAYER_TYPE.USER);
    const compObject: PlayerObject = createPlayerObject(rpsController.container)(PLAYER_TYPE.COMP);

    rpsController.referencePlayers(playerObject, compObject);

    gameController.container.addChild(selectionController.container, rpsController.container, resultsController.container);

    const scoreObject: ShowHideScoreContainerObject = createScoreObject(gameController.container);

    app.stage.addChild(gameController.container);

    gameLoopMachine.gameSubject.subscribe({
        next: (state) => onUpdateGameState(state)(scoreObject)
    })

    centerOnResize(gameController.container);

    window.dispatchEvent(new Event('resize'));
}

const onUpdateGameState = (state) => (scoreObject: ShowHideScoreContainerObject) => {

    if (state.context.state == GAME_LOOP_STATES.END) {
        if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.SETUP}`)) {
            scoreObject.show();
        }

        if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.END_PROCESS}`)) {
            let { win, lose, draw } = state.context;
            scoreObject.setResult(win)(lose)(draw);
        }
    }

    if (state.context.state == GAME_LOOP_STATES.START) {
        if (state.matches(`${GAME_LOOP_STATES.START}.${STATE_ACTIONS.SETUP}`)) {
            scoreObject.hide();
        }
    }
}

export const game = () => {
    loadAssets();

    loader.onComplete.add(() => {
        startGame();
    })
} 