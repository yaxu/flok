import React from "react";
import Sketch from "react-p5";

const MySketch = (props) => {
  var prev = -1;
  var sz = 200.0;
  const ps = [];

  const setup = (p5, parent) => {
    console.log("props:");
    console.log(props);
    if (!window.drawings) {
      window.drawings = {};
    }
    window.drawings[props.name] = ps;

    p5.createCanvas(sz, sz).parent(parent);
    for (var i = 0; i < p5.width; ++i) {
      ps.push(0.5);
    }

    console.log(p5);
  };

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
  };

  const inside = (p5) => {
    return (
      p5.mouseX >= 0 &&
      p5.mouseX < p5.width &&
      p5.mouseY >= 0 &&
      p5.mouseY < p5.height
    );
  };

  const mouseDragged = (p5, e) => {
    const mouseX = p5.mouseX;
    const mouseY = p5.mouseY;

    if (!inside(p5)) {
      return;
    }

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
  };

  const mouseClicked = (p5, e) => {
    if (!inside(p5)) {
      return;
    }
    if (p5.mouseY >= sz) {
      return;
    }
    ps[p5.mouseX] = p5.mouseY / sz;
    prev = p5.mouseX;
    //st.html("");
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mouseDragged={mouseDragged}
      mouseClicked={mouseClicked}
    />
  );
};

MySketch.displayName = "MySketch";
export default MySketch;
