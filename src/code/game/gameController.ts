import { ContainerObject } from "../utils/models";
import { createContainer } from "../utils/pixi";


export const createGameController = () => {
    const container = createContainer("JakEnPoyGameContainer");

    return <ContainerObject>{ container }
}