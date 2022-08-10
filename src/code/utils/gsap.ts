import gsap from "gsap";
import { Container } from "pixi.js";

export const animateTo = (target: any) => (dur: number) => (params: {}) => {
    gsap.to(target, { duration: dur, ...params })
}

export const animateFromTo = (target: any) => (fromDur: number) => (fromParams: {}) => (dur: number) => (params: {}) => {
    gsap.fromTo(target, { duration: fromDur, ...fromParams }, { duration: dur, ...params })
}

export const removeTween = (target) => {
    gsap.killTweensOf(target);
}

export const removeTweens = (targets) => {
    targets.forEach(target => {
        removeTween(target);
    });
}

export const showHideContainer = (container: Container, show: boolean) => (duration: number) => new Promise((resolve) => {
    animateFromTo(container)(0)({ alpha: show ? 0 : 1 })(duration)({
        alpha: show ? 1 : 0,
        onComplete: () => {
            resolve(true);
        }
    })
});

export const timeline = () => {
    return gsap.timeline();
}