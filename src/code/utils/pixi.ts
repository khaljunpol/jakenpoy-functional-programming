import { Application, Container, DisplayObject, Sprite, Text, Texture } from "pixi.js";

export const createGameView = () => {

    const WD = 1280;
    const HT = 720;

    const app = new Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resizeTo: window,
        autoDensity: true
    })

    app.view.style.position = "fixed";
    document.getElementById("game-container").appendChild(app.view);

    listenToOnResize(() => {

        app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    return app;
}

export const createSpriteDictionary = (sprites: Record<string, Sprite>) => (container: Container) => (TYPE) => (scale) => {
    let selection = Object.keys(TYPE);

    selection.forEach(obj => {
        let newSprite = new Sprite(Texture.from(`assets/${obj.toLowerCase()}.png`));

        if (!sprites.hasOwnProperty(TYPE[obj])) {
            sprites[TYPE[obj]] = newSprite;
        }

        container.addChild(newSprite);

        setupSprite(newSprite);
        newSprite.scale.set(scale);
        newSprite.visible = false;
    });
}

export const resetSpriteDictionary = (sprites: Record<string, Sprite>) => {
    for (let key in sprites) {
        sprites[key].visible = false;
    }
}

export const listenToOnResize = onResizeFunction => {
    window.addEventListener('resize', onResizeFunction);
}

export const centerAndRescaleOnResize = (app: Application) => (container) => {



}

export const centerOnResize = container => {
    const resize = () => {
        container.x = window.innerWidth / 2;
        container.y = window.innerHeight / 2;
    }

    listenToOnResize(() => resize());
}

export const offScreenXPos = () => {
    return (window.innerWidth / 2) + 300;
}

export const offScreenYPos = () => {
    return (window.innerHeight / 2) + 300;
}

export const createContainer = (name) => {
    const container = new Container();
    container.name = name;
    return container;
}

export const setupText = (sprite: Text) => {

    sprite.pivot.set(0.5);
    sprite.anchor.set(0.5);

    return sprite;
}

export const setupSprite = (sprite: Sprite) => {

    sprite.pivot.set(0.5);
    sprite.anchor.set(0.5);

    return sprite;
}

export const removeOnClick = (graphic: DisplayObject) => {
    graphic.interactive = false
    graphic.buttonMode = false
    graphic.off('pointerdown')
    return graphic
}

export const addOnClick = callback => (graphic: DisplayObject) => {
    removeOnClick(graphic)
    graphic.interactive = true
    graphic.buttonMode = true
    graphic.on('pointerdown', callback)
    return graphic
}