import { Container, Sprite } from "pixi.js"
import { Subject } from "rxjs"
import { HAND_SELECTION } from "../utils/constants"
import { animateFromTo, animateTo, removeTween, removeTweens } from "../utils/gsap"
import { SelectionObject, ShowHideSpriteObject } from "../utils/models"

export const show = (sprite: Sprite) => {
    animateFromTo(sprite)(0)({ alpha: 0 })(0.5)({ alpha: 1 })
}

export const hide = (sprite: Sprite) => {
    animateFromTo(sprite)(0)({ alpha: 1 })(0.5)({ alpha: 0 })
}

export const createOnClickSelectFunction = (target: Sprite) => (type: HAND_SELECTION) => (subject: Subject<HAND_SELECTION>) => {
    return () => {
        animateTo(target.scale)(0.5)({ x: 0.3, y: 0.3 });
        subject.next(type);
    };
}

export const showSelection = (container: Container, selections: SelectionObject[], logoObject: ShowHideSpriteObject, selectObject: ShowHideSpriteObject) => new Promise((resolve) => {
    container.interactiveChildren = false;
    container.visible = true;

    removeTween(logoObject.sprite);
    removeTween(selectObject.sprite);
    removeTweens(selections);
    selections.forEach(selection => {
        selection.reset();
    });

    logoObject.show();
    selectObject.show();

    let slctns = selections.map((x) => x.container);

    animateFromTo(slctns)(0)({ alpha: 0 })(0.5)({
        alpha: 1, onComplete: () => {
            container.interactiveChildren = true;
            resolve(true);
        }, delay: 0.5
    })
});

export const hideSelection = (container: Container, selections: SelectionObject[], logoObject: ShowHideSpriteObject, selectObject: ShowHideSpriteObject) => new Promise((resolve) => {
    logoObject.hide();
    selectObject.hide();

    let slctns = selections.map((x) => x.container);

    animateFromTo(slctns)(0)({ alpha: 1 })(0.5)({
        alpha: 0, onComplete: () => {
            container.visible = false;
            resolve(true);
        }, delay: 0.5
    })
});