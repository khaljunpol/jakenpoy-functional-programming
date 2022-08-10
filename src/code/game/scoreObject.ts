import { Container, Text, TextStyle } from "pixi.js";
import { animateFromTo, showHideContainer } from "../utils/gsap";
import { ShowHideContainerObject, ShowHideScoreContainerObject } from "../utils/models";
import { createContainer, setupText } from "../utils/pixi";

const style = <TextStyle>{
    fontSize: 80, align: 'center',
    fill: ["#000000"],
    stroke: "#ffffff",
    strokeThickness: 5,
}

const drawstyle = <TextStyle>{
    fontSize: 40, align: 'center',
    fill: ["#000000"],
    stroke: "#ffffff",
    strokeThickness: 5,
}

export const createScoreObject = (parentContainer: Container) => {
    const container = createContainer("ScoreObject");
    parentContainer.addChild(container);

    let isShown = false;

    let winText: Text;
    let loseText: Text;
    let drawText: Text;
    let dashText: Text;

    container.alpha = 0;
    container.position.y = 200;

    dashText = new Text("-", style);
    winText = new Text("0", style);
    loseText = new Text("0", style);
    drawText = new Text("DRAW: 0", drawstyle);
    setupText(dashText);
    setupText(winText);
    setupText(loseText);
    setupText(drawText);

    container.addChild(winText, dashText, loseText, drawText);

    winText.position.x = -300;
    loseText.position.x = 300;
    drawText.position.y = 100;

    const setResult = (win: number) => (lose: number) => (draw: number) => {
        winText.text = win.toString();
        loseText.text = lose.toString();
        drawText.text = "DRAW: " + draw.toString();
    }

    return <ShowHideScoreContainerObject>{
        container, 
        setResult,
        show: () => {
            if (!isShown) {
                showHideContainer(container, true)(0.5);
                isShown = true;
            }
        },
        hide: () => {
            if (isShown) {
                showHideContainer(container, false)(0.5)
                isShown = false;
            }
        }
    }
}