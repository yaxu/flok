import React from "react";
import Sketch from "react-p5";

const globals = {};
const sz = 200.0;

const MySketch = (props) => {
  const {sessionClient, name} = props;
  const ydoc = sessionClient._doc;
  const yarray = ydoc.getArray(name)
  window.yarray = yarray
  
  const setup = (p5, parent) => {
    if (!window.drawings) {
      window.drawings = {};
    }

    globals[props.name] = { prev: -1};
    
    window.drawings[props.name] = globals[props.name].ps;

    p5.createCanvas(sz, sz).parent(parent);

    while(yarray.length < 200) {
      yarray.insert(0, [0.5])
    }

    //for (var i = 0; i < p5.width; ++i) {
    //globals[props.name].ps.push(0.5);
    //}

  };

  const draw = (p5) => {
    p5.background(255);
    p5.fill(128);
    p5.rect(1, 1, 198, 198);

    var prevx = -1;
    var prevy = -1;

    for (var x = 0; x < p5.width; ++x) {
      if (yarray.get(x) == -1) {
        continue;
      }
      if (prevx >= 0) {
        p5.line(prevx, prevy * sz, x, yarray.get(x) * sz);
      }
      prevx = x;
      prevy = yarray.get(x);
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
    const prev = globals[props.name].prev;
    if (!inside(p5)) {
      return;
    }

    if (p5.mouseY >= sz) {
      return;
    }
    const v = mouseY / sz;
    if (prev >= 0) {
      const prevV = yarray.get(prev);
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
          yarray.delete(x, 1)
          yarray.insert(x, [v + diff * ((x - start) / dist)]);
        } else {
          yarray.delete(x, 1)
          yarray.insert(x, [v + diff * (1 - (x - start) / dist)]);
        }
      }
    }
    yarray.delete(mouseX, 1)
    yarray.insert(mouseX, [mouseY / sz]);
    globals[props.name].prev = mouseX;
    //st.html("");
  };

  const mouseClicked = (p5, e) => {
    if (!inside(p5)) {
      return;
    }
    if (p5.mouseY >= sz) {
      return;
    }
    yarray.delete(p5.mouseX)
    yarray.insert(p5.mouseX, [p5.mouseY / sz]);
    globals[props.name].prev = p5.mouseX;
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
