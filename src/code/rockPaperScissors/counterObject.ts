import gsap, { Back } from "gsap";
import { Container, Sprite, Texture } from "pixi.js";
import { removeTween } from "../utils/gsap";
import { CounterObject, PopUpObject } from "../utils/models";
import { createContainer, offScreenYPos, setupSprite } from "../utils/pixi";

export const createPopUpObject = (parentContainer: Container) => (spriteName: string) => (targetScale: number) => {
    let sprite = new Sprite(Texture.from(`assets/${spriteName}.png`));
    setupSprite(sprite);
    parentContainer.addChild(sprite);

    sprite.scale.set(targetScale);

    const reset = () => {
        removeTween(sprite);
        sprite.alpha = 1;
        sprite.position.y = -offScreenYPos();
    }

    reset();

    const show = (sprite) => {
        let popUp = gsap.timeline();

        popUp.to(sprite, { alpha: 1, duration: 0.5, y: -250, ease: Back.easeOut.config(1) })
            .to(sprite, { duration: 0.5, alpha: 0, delay: 0.25 })
    }

    return <PopUpObject>{ reset, show: () => show(sprite) }
}

export const createCounterObject = (parentContainer: Container) => {
    const container = createContainer("CounterObject");
    parentContainer.addChild(container);

    const jak: PopUpObject = createPopUpObject(container)("jak")(0.7);
    const en: PopUpObject = createPopUpObject(container)("en")(0.9);
    const poy: PopUpObject = createPopUpObject(container)("poy")(1.1);

    const reset = () => {
        jak.reset();
        en.reset();
        poy.reset();
    }

    const showCounterIndex = (index: number) => {
        switch (index) {
            case 0:
                jak.show();
                break;
            case 1:
                en.show();
                break;
            case 2:
                poy.show();
                break;
        }
    }

    return <CounterObject>{ reset, showCounterIndex }
}