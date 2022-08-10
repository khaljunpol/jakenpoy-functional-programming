import { Container, Sprite, Texture } from "pixi.js";
import { ShowHideSpriteObject } from "../utils/models";
import { listenToOnResize, setupSprite } from "../utils/pixi";
import { hide, show } from "./selectionFunctions";

const onResize = (sprite) => {
    if (window.innerHeight > window.innerWidth) {
        sprite.y = 650;
    }
    else {
        sprite.y = 250;
    }
}

export const createSelectHandObject = (container: Container) => {
    let sprite: Sprite = new Sprite(Texture.from(`../../assets/select.png`));
    setupSprite(sprite);
    sprite.scale.set(0.4);
    sprite.alpha = 0;
    container.addChild(sprite);

    listenToOnResize(() => onResize(sprite));

    return <ShowHideSpriteObject>{ sprite, show: () => show(sprite), hide: () => hide(sprite) };
}