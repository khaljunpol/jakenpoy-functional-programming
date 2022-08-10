import { Container, Sprite } from "pixi.js";
import { RESULT } from "../utils/constants";
import { showHideContainer } from "../utils/gsap";
import { ResultObject } from "../utils/models";
import { createContainer, createSpriteDictionary, resetSpriteDictionary } from "../utils/pixi";

export const createResultObject = (parentContainer: Container) => {
    const container = createContainer("ResultObject");
    parentContainer.addChild(container);

    let sprites: Record<string, Sprite> = {};
    let result: RESULT = RESULT.DRAW;

    createSpriteDictionary(sprites)(container)(RESULT)(1);
    container.position.y = -250;

    const setResult = (res: RESULT) => {
        result = res;
    }

    const showSelectedResult = () => {
        for (let key in sprites) {
            sprites[key].visible = false;

            if (key == result) {
                sprites[key].visible = true;
            }
        }
    }

    return <ResultObject>{ reset: () => resetSpriteDictionary(sprites), setResult, showSelectedResult, showResult: () => showHideContainer(container, true)(1), hideResult: () => showHideContainer(container, false)(1) }
}