import { Container } from "pixi.js";
import { RESULT, RESULT_STATE } from "../utils/constants";

export const showResultView = (container: Container) => (result: RESULT) => (resultObject) => (subject) => new Promise((resolve) => {
    container.visible = true;

    resultObject.reset();
    resultObject.setResult(result);
    resultObject.showSelectedResult();

    resultObject.showResult().then(() => {
        subject.next(RESULT_STATE.PRESENT_START);
        resolve(true);
    });
});

export const hideResultView = (resultObject) => (subject) => new Promise((resolve) => {
    resultObject.hideResult().then(() => {
        resolve(true);
    });
});