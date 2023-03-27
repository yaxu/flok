import React from "react";
import Sketch from "react-p5";

export default (props) => {
  var prev = -1;
  var sz = 200.0;
  const ps = [];
  
  const setup = (p5, parent) => {
    p5.createCanvas(sz, sz).parent(parent);
    ps = []
    for (var i = 0; i < p5.width; ++i) {
      ps.push(0.5);
    }
    // const input = p5.createInput(dweet_name);
    // input.position(20, sz + 40);
    // const button = p5.createButton("save");
    // button.position(input.x, input.y + input.height + 2);
    // button.mousePressed(saveline);
    // const st = p5.createElement("i");
    // st.position(button.x, button.y + button.height + 2);
    console.log(p5)
  }

  const draw = (p5) => {
    p5.background(255);
    p5.fill(128);
    p5.rect(1, 1, 198, 198);
    
    var prevx = -1;
    var prevy = -1;
    
    for (var x = 0; x < p5.width; ++x) {
      if (ps[x] == -1) {
        continue;
      }
      if (prevx >= 0) {
        p5.line(prevx, prevy * sz, x, ps[x] * sz);
      }
      prevx = x;
      prevy = ps[x];
    }
  }


  const mouseDragged = (p5, e) => {
    const mouseX = p5.mouseX;
    const mouseY = p5.mouseY;
    
    if (p5.mouseY >= sz) {
      return;
    }
    const v = mouseY / sz;
    if (prev >= 0) {
      const prevV = ps[prev];
      var diff = prevV - v;
      
      var start, stop;
      if (prev > mouseX) {
        start = mouseX;
        stop = prev;
      } else {
        stop = mouseX;
        start = prev;
      }
      const dist = stop - start;
      
      for (var x = start + 1; x < stop; ++x) {
        if (prev > mouseX) {
          ps[x] = v + diff * ((x - start) / dist);
        } else {
          ps[x] = v + diff * (1 - (x - start) / dist);
        }
      }
    }
    ps[mouseX] = mouseY / sz;
    prev = mouseX;
    //st.html("");
  }

  const mouseClicked = (p5, e)  => {
    if (p5.mouseY >= sz) {
      return;
    }
    ps[p5.mouseX] = p5.mouseY / sz;
    prev = p5.mouseX;
    //st.html("");
  }

  return <Sketch setup={setup} draw={draw} mouseDragged={mouseDragged} mouseClicked={mouseClicked} />
}
