const m = {
  state: "locked",

  transitions: {
    locked: {
      coin: { next: "unlocked", action: () => console.log("Unlocked!") },
      push: { next: "locked" }
    },
    unlocked: {
      coin: { next: "unlocked" },
      push: { next: "locked", action: () => console.log("Locked again!") }
    }
  },

  input(event) {
    const t = this.transitions[this.state][event];
    if (t) {
      if (t.action) t.action();
      this.state = t.next;
    }
    return this;
  }
};

m.input("coin").input("push");
console.log(m.state); // "locked"