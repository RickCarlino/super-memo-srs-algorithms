interface Card {}

function Queue(size: number) {
  const _content: Card[] = [];
  return {
    _content,
    size,
    empty: () => _content.length == 0,
    full: () => _content.length >= size,
    get: () => _content.unshift(),
    put: (card: Card) => _content.push(card),
  };
}

const CARDS_PER_CM = 5;

const BOX = [
  Queue(1 * CARDS_PER_CM),
  Queue(2 * CARDS_PER_CM),
  Queue(5 * CARDS_PER_CM),
  Queue(8 * CARDS_PER_CM),
  Queue(14 * CARDS_PER_CM),
] as const;

function add(card: Card, i: number) {
  const box = BOX[i];
  if (!box) {
    throw new Error("Attempted to put card into bad index " + i);
  }
  box.put(card);
  if (box.full()) {
    study();
  }
}

function review(_card: Card) {
  // Simulate a student that is correct 75% of the time.
  return Math.random() < 0.75;
}

for (let i = 0; i < 140; i++) {
  add("New Card", 0);
}

function study() {
  BOX.forEach((partition, index) => {
    if (partition.full()) {
      // Time to review the cards
      console.log(`Time to study partition ${index + 1}`);
      const cards_to_review: Card[] = [];
      while (!partition.empty()) {
        cards_to_review.unshift(partition.get());
      }
      cards_to_review.forEach((card) => {
        const correct = review(card);
        let new_index = 0;
        if (correct && index + 1 < BOX.length) {
          // promote
          new_index = index + 1;
        } else if (!correct && index - 1 > 0) {
          // Demote
          new_index = 0;
        } else {
          new_index = index;
        }
        add(card, new_index);
      });
    }
  });
}

study();
