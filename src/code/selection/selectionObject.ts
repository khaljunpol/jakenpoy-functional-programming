import { Container, Sprite, Texture } from "pixi.js";
import { Subject } from "rxjs";
import { hand_selection, HAND_SELECTION } from "../utils/constants";
import { SelectionObject, SelectionObjects } from "../utils/models";
import { addOnClick, createContainer, listenToOnResize, setupSprite } from "../utils/pixi";
import { createOnClickSelectFunction } from "./selectionFunctions";


const onResize = (objects) => (offset) => {
    let ofs = -offset;

    if (window.innerHeight > window.innerWidth) {
        objects.forEach(selection => {
            selection.container.position.x = 0;
            selection.container.position.y = ofs;
            ofs += offset;
        });
    }
    else {
        objects.forEach(selection => {
            selection.container.position.y = 0;
            selection.container.position.x = ofs;
            ofs += offset;
        });
    }
}

export const createSelectionObjects = (container: Container) => {
    const selections = [];

    const subject = new Subject<HAND_SELECTION>();

    hand_selection.forEach(obj => {
        let newSelection = createSelectionObject(obj.toLowerCase())(HAND_SELECTION[obj])(subject);
        selections.push(newSelection);
        container.addChild(newSelection.container);
    });


    listenToOnResize(() => onResize(selections)(340));

    return <SelectionObjects>{ subject, selections };
}

export const createSelectionObject = (name: string) => (type: HAND_SELECTION) => (subject: Subject<HAND_SELECTION>) => {
    const container = createContainer("SelectionObject");

    let sprite: Sprite = new Sprite(Texture.from(`../../assets/${name}.png`));
    setupSprite(sprite);
    sprite.scale.set(0.2);
    container.addChild(sprite);

    addOnClick(createOnClickSelectFunction(sprite)(type)(subject))(sprite);

    const reset = () => {
        sprite.scale.set(0.2);
    }

    return <SelectionObject>{ container, reset }
}