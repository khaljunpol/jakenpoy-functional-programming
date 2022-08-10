import { Container, Sprite, Texture } from "pixi.js";
import { ShowHideSpriteObject } from "../utils/models";
import { listenToOnResize, setupSprite } from "../utils/pixi";
import { hide, show } from "./selectionFunctions";

const onResize = (sprite) => {
    if (window.innerHeight > window.innerWidth) {
        sprite.y = -560;
    }
    else {
        sprite.y = -260;
    }
}

export const createLogoObject = (container: Container) => {
    let sprite: Sprite = new Sprite(Texture.from(`../../assets/logo.png`));
    setupSprite(sprite);
    sprite.scale.set(0.7);
    sprite.alpha = 0;
    container.addChild(sprite);

    listenToOnResize(() => onResize(sprite));

    return <ShowHideSpriteObject>{ sprite, show: () => show(sprite), hide: () => hide(sprite) };
}