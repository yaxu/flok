var myStore = "alpacadraw";

var dweet_name = "alex";
var dweet_prefix = "alpaca-dance-";

var ps = [];

export function drawPreload() {
  // read the initial information
  dweetio.get_latest_dweet_for(
    dweet_prefix + dweet_name,
    function (err, dweet) {
      ps = dweet[0].content; // Dweet is always an array of 1

      console.log(dweet.thing); // The generated name
      console.log(dweet.content); // The content of the dweet
      console.log(dweet.created); // The create date of the dweet
    }
  );
}

var prev = -1;

var sz = 200.0;

export function drawSetup(p5) {
  p5.createCanvas(sz, sz + 100);
  for (var i = 0; i < p5.width; ++i) {
    ps.push(0.5);
  }
  const input = p5.createInput(dweet_name);
  input.position(20, sz + 40);
  const button = p5.createButton("save");
  button.position(input.x, input.y + input.height + 2);
  button.mousePressed(saveline);
  const st = p5.createElement("i");
  st.position(button.x, button.y + button.height + 2);
}

function saveline() {
  dweet_name = dweet_prefix + input.value();
  dweetio.dweet_for(dweet_name, ps, function (err, dweet) {
    console.log(dweet.thing); // The generated name
    console.log(dweet.content); // The content of the dweet
    console.log(dweet.created); // The create date of the dweet
  });
  st.html("saved");
}

export function drawDraw(p5) {
  p5.background(255);
  p5.fill(0);
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

export function drawMouseDragged(e) {
  if (mouseY >= sz) {
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
  st.html("");
}

export function drawMouseClicked(e) {
  if (mouseY >= sz) {
    return;
  }
  ps[mouseX] = mouseY / sz;
  prev = mouseX;
  st.html("");
}
