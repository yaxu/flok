import("@strudel.cycles/core");

var parts = ["waist", "back", "head"];

var { action, to, part, by, dur, waist, back, head } = createParams(
  "action",
  "to",
  "part",
  "by",
  "dur",
  "waist",
  "back",
  "head"
);

window.action = action;
window.to = to;
window.part = part;
window.by = by;
window.dur = dur;
window.waist = waist;
window.back = back;
window.head = head;

Pattern.prototype.dance = function () {
  const pat = this;
  const speechPat = this.withHap((hap) => {
    return hap.withValue((value) => {
      var message = "";
      var action = value.action;
      if ("action" in value) {
        message = value.action;
        if ("part" in value) {
          message += " your " + value.part;
        }
        if (action == "move" && "to" in value) {
          const perc = Math.floor(value.to * 100);
          message += " to " + perc + "percent ";
        }
        if ("by" in value) {
          const by = Math.floor(value.by * 100);
          message += " by " + by + "percent ";
        }
        if ("dur" in value) {
          const dur = value.dur / 1000;
          message += " over " + dur + "seconds";
        }
      }
      return message;
    });
  });
  return stack(
    //speechPat.speak('[en-US|en-GB]', '[0|1]'),
    pat.serial(115200, true, true)
  );
};

Pattern.prototype.splitUnipolarBodyParts = function () {
  const pat = this;
  const pats = [];
  for (const prt of parts) {
    pats.push(
      pat.fmap((x) => ({ action: "move", part: prt, to: (x[prt] + 1) / 2 }))
    );
  }
  return stack(...pats);
};

window.move = function (w, b, h, f) {
  const parts1 = waist(f.mul(w)).back(f.mul(b)).head(f.mul(h));
  return parts1;
};

window.inhabit = function (lookup, pat) {
  return pat
    .fmap((v) => (v in lookup ? lookup[v] : pure(silence)))
    .squeezeJoin()
    .splitUnipolarBodyParts()
    .segment(64)
    .serial(115200, true, true);
};

window.sum = (...pats) =>
  pats.reduce((a, b) => a.add(b), steady({ waist: 0, back: 0, head: 0 }));

Pattern.prototype.splitSerial = function (velocity = 100) {
  return this.splitUnipolarBodyParts()
    .segment(32)
    .stack(action("velocity").to(velocity))
    .serial(115200, true, true);
};

window.moves = {
  sway: move(
    0.25, // amount of waist movement
    0.125, // amount of back movement
    -1, // amount of head movement
    sine2 // the movement 'shape'
  ),
  wiggle: move(0, 0, 1, sine2.mul(0.5).slow(1).add(sine2.mul(0.05).fast(24))),
  bow: move(0, -1, 0, tri),
  nod: move(0, -0.25, 0, fastcat(tri, saw).fast(3)),
  diagonaltwist: move(1, 1, 1, sine2),
  diagonal: move(saw, isaw, 0, sine2),
  //draw: move(0, 1, 1, kate),
  doubletake: move(0, 0, 0.5, fastcat(saw, sine2).slow(2)),
  // draw: move(0, 0, 1, kate),
};

window.patternMove = (pat) => inhabit(moves, pat);

for (var key in window.moves) {
  window[key] = window.moves[key];
}
