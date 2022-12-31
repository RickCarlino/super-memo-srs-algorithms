interface Card {}

const A = 0;
const B = 1;
const C = 2;

function Queue() {
  const _content: Card[] = [];
  return {
    _content,
    empty: () => _content.length == 0,
    get: () => _content.unshift(),
    put: (card: Card) => _content.push(card),
  };
}

const SYSTEM = [
  Queue(), // Box A: every day
  Queue(), // Box B: every 2-3 days (ex: Tuesday & Friday)
  Queue(), // Box C: every week (ex: Sunday)
] as const;

function add(card: Card, i: number) {
  const box = SYSTEM[i];
  if (!box) {
    throw new Error("Attempted to put card into bad index " + i);
  }
  SYSTEM[i].put(card);
}

function review(_card: Card) {
  // Simulate a student that is correct 75% of the time.
  return Math.random() < 0.75;
}
function study_box(number: number) {
  const cards_to_review: Card[] = [];
  while (!SYSTEM[number].empty()) {
    cards_to_review.unshift(SYSTEM[number].get());
  }
  cards_to_review.forEach((card) => {
    const answer = review(card);
    let new_number: number;
    if (answer && number < C) {
      // promote
      new_number = number + 1;
    } else if (!answer && number > A) {
      // demote
      new_number = number - 1;
    } else {
      new_number = number;
    }
    add(card, new_number);
  });
}

function study(day: Date) {
  switch (day.getDay()) {
    case 1: // Monday
      study_box(A);
      return;
    case 2: // Tuesday
      study_box(A);
      study_box(B);
      return;
    case 3: // Wednesday
      study_box(A);
      return;
    case 4: // Thursday
      study_box(A);
      return;
    case 5: // Friday
      study_box(A);
      study_box(B);
      return;
    case 6: // Saturday
      study_box(A);
      return;
    case 7: // Sunday
      study_box(A);
      study_box(C);
      return;
    default:
      throw new Error("Impossible");
  }
}

for (let i = 0; i < 140; i++) {
  add("New Card", 0);
}

const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const today = new Date();

for (let i = 0; i < 10; i++) {
  study(subtractDays(today, 10 - i));
}
