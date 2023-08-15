import P5 from "p5";
import { Sketch } from "@p5-wrapper/react";
import DraggableBox from "./components/draggable";

const sketch: Sketch = (p5) => {
  const blocks: DraggableBox[] = [];
  p5.setup = () => {
    p5.createCanvas(500, 500);
    for (let i = 0; i < 1; i++)
      blocks.push(
        new DraggableBox(
          p5,
          new P5.Vector(450 * Math.random(), 405 * Math.random(), 0)
        )
      );
  };
  p5.mousePressed = () => {
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].clicked(p5.mouseX, p5.mouseY);
    }
  };
  p5.draw = () => {
    // if (p5.mouseIsPressed) {
    //   const block = new Draggable(p5, new P5.Vector(p5.mouseX, p5.mouseY));
    //   blocks.push(block);
    // }
    blocks.map((block) => block.display());
  };
};
export default sketch;
