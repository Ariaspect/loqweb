import P5 from "p5";

export default class DraggableBox {
  _p5: P5;
  _pos: P5.Vector;

  w: number;
  h: number;

  constructor(p5: P5, pos: P5.Vector) {
    this._p5 = p5;
    this._pos = pos;

    this.w = 50;
    this.h = 50;
  }

  // over() {
  //   const p5 = this._p5;
  //   // Is mouse over object
  //   if (
  //     p5.mouseX > this.x &&
  //     p5.mouseX < this.x + this.w &&
  //     p5.mouseY > this.y &&
  //     p5.mouseY < this.y + this.h
  //   ) {
  //     this.rollover = true;
  //   } else {
  //     this.rollover = false;
  //   }
  // }

  // update() {
  //   const p5 = this._p5;
  //   // Adjust location if being dragged
  //   if (this.dragging) {
  //     this.x = p5.mouseX + this.offsetX;
  //     this.y = p5.mouseY + this.offsetY;
  //   }
  // }

  display() {
    const p5 = this._p5;
    p5.stroke(0);
    p5.fill(50);
    p5.rect(this._pos.x, this._pos.y, this.w, this.h);
  }

  clicked(mouseX: number, mouseY: number) {
    return (
      mouseX > this._pos.x &&
      mouseX < this._pos.x + this.w &&
      mouseY > this._pos.y &&
      mouseY < this._pos.y + this.h
    );
  }

  // pressed() {
  //   // Did I click on the rectangle?
  //   if (
  //     mouseX > this.x &&
  //     mouseX < this.x + this.w &&
  //     mouseY > this.y &&
  //     mouseY < this.y + this.h
  //   ) {
  //     this.dragging = true;
  //     // If so, keep track of relative location of click to corner of rectangle
  //     this.offsetX = this.x - mouseX;
  //     this.offsetY = this.y - mouseY;
  //   }
  // }

  //   released() {
  //     // Quit dragging
  //     this.dragging = false;
  //   }
}
