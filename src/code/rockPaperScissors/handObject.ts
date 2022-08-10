import { Container, Sprite } from "pixi.js";
import { HAND_SELECTION } from "../utils/constants";
import { HandObject } from "../utils/models";
import { createContainer, createSpriteDictionary, resetSpriteDictionary } from "../utils/pixi";

export const createHandObject = (parentContainer: Container) => {
    const container = createContainer("HandObject");
    parentContainer.addChild(container);

    let sprites: Record<string, Sprite> = {};
    let selectedHand: HAND_SELECTION = HAND_SELECTION.ROCK;

    createSpriteDictionary(sprites)(container)(HAND_SELECTION)(0.2);

    const setHandSelected = (hand: HAND_SELECTION) => {
        selectedHand = hand;
    }

    const showInitialHand = () => {
        resetSpriteDictionary(sprites);
        sprites[HAND_SELECTION.ROCK].visible = true;
    }

    const showSelectedHand = () => {
        for (let key in sprites) {
            sprites[key].visible = false;

            if (key == selectedHand) {
                sprites[key].visible = true;
            }
        }
    }

    return <HandObject>{ container, setHandSelected, showInitialHand, showSelectedHand, getHandSelected: selectedHand };
}