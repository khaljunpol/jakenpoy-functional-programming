import { Loader } from "pixi.js";

export const loader = new Loader();

export const loadAssets = () => {
    
    loader.add("scissors", "../assets/scissors.png")
        .add("rock", "../assets/rock.png")
        .add("paper", "../assets/paper.png")
        .add("win", "../assets/win.png")
        .add("lose", "../assets/lose.png")
        .add("draw", "../assets/draw.png")
        .add("jak", "../assets/jak.png")
        .add("en", "../assets/en.png")
        .add("poy", "../assets/poy.png")
        .add("logo", "../assets/logo.png")
        .add("select", "../assets/select.png")
        .add("machineConfig", "../assets/machineConfig.json")
        .load()
}