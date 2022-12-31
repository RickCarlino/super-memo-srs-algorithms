function Queue<T>(size: number) {
  const _content: T[] = [];
  return {
    _content,
    size,
    empty: () => _content.length == 0,
    full: () => _content.length >= size,
    get: () => _content.unshift(),
    put: (card: T) => _content.push(card),
  };
}

const TABLE_REPETITION_INTERVALS = [4]; // First review after 4 days

for (let i = 1; i < 16; i++) {
  const prev = TABLE_REPETITION_INTERVALS[i - 1];
  const next = Math.round(prev * 1.7);
  TABLE_REPETITION_INTERVALS.push(next);
}

const DATA_BOOK: Page[] = [];
const SCHEDULE_BOOK: Record<string, number[]> = {};

function review_question(question: unknown, repetitions: number) {
  // The chance of answering correctly increases with the number of repetitions.
  const chance = repetitions * 4 + 1;
  return Math.random() < chance;
}

interface Repetition {
  No: number;
  Dat: string;
  U: number;
}

class Page {
  public repetitions: Repetition[];
  public questions: string[];
  public answers: string[];

  constructor(questions: string[], answers: string[]) {
    this.questions = questions;
    this.answers = answers;
    this.repetitions = [];
  }

  review = () => {
    const remaining_questions = [...this.questions];
    let iteration = 1;
    let U = 0;
    while (!remaining_questions.length) {
      const questions_to_review: string[] = [];
      while (!remaining_questions.length) {
        const hmm = remaining_questions.pop();
        hmm && questions_to_review.push(hmm);
      }
      questions_to_review.forEach((question) => {
        if (!review_question(question, iteration)) {
          remaining_questions.push(question);
          if (iteration == 1) {
            U = U + 1;
          }
        }
      });
      iteration = iteration + 1;
    }

    this.repetitions.push({
      No: this.repetitions.length + 1,
      Dat: JSON.stringify(new Date()),
      U,
    });
  };
}

// Add a new page for illustration purposes
DATA_BOOK.push(
  new Page(
    ["Question 1", "Question 2", "Question 3"],
    ["Answer 1", "Answer 2", "Answer 3"]
  )
);

const page_number = DATA_BOOK.length - 1;
const now = new Date();
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

TABLE_REPETITION_INTERVALS.forEach((interval) => {
  const review_date = JSON.stringify(addDays(now, interval));
  if (!SCHEDULE_BOOK[review_date]) {
    SCHEDULE_BOOK[review_date] = [];
  }
  console.log(`Page ${page_number} to review on ${review_date}`);
  SCHEDULE_BOOK[review_date] = [page_number];
});

for (let i = 0; i < 365; i++) {
  const day = JSON.stringify(addDays(now, i));
  if (!SCHEDULE_BOOK[day]) {
    break;
  }
  SCHEDULE_BOOK[day].forEach((page) => {
    console.log(`Reviewing page ${page} on ${day}`);
    DATA_BOOK[page].review();
  });
}
