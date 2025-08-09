const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.querySelector("#quoteDisplay");
const quoteInputElement = document.querySelector("#quoteInput");
const timerElement = document.querySelector("#timer");
const wordsPerMinuteElement = document.querySelector("#wpm");
const divider = document.querySelector("hr");

let startTime = null;
let timerInterval = null;


const localQuotes = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "The best way to predict the future is to create it.",
  "You are never too old to set another goal or to dream a new dream.",
  "Do what you can, with what you have, where you are.",
  "It always seems impossible until it's done.",
  "Happiness depends upon ourselves.",
  "If opportunity doesn’t knock, build a door.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "You miss 100% of the shots you don’t take.",
  "A journey of a thousand miles begins with a single step.",
  "Everything you’ve ever wanted is on the other side of fear.",
  "Quality means doing it right when no one is looking.",
  "Work hard in silence, let your success be your noise.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Opportunities don’t happen. You create them.",
  "Dream big and dare to fail.",
  "Start where you are. Use what you have. Do what you can.",
  "Stay hungry, stay foolish.",
  "Do what you love and the money will follow.",
  "The best revenge is massive success.",
  "Be so good they can’t ignore you.",
  "Don’t let yesterday take up too much of today.",
  "Every moment is a fresh beginning.",
  "When nothing goes right, go left.",
  "Difficulties in life are intended to make us better, not bitter.",
  "You don’t need to be perfect to inspire others.",
  "In the middle of every difficulty lies opportunity.",
  "If you want to lift yourself up, lift up someone else.",
  "Don’t count the days, make the days count.",
  "Your limitation—it’s only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It’s going to be hard, but hard does not mean impossible.",
  "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do what is right, not what is easy.",
  "The only way to achieve the impossible is to believe it is possible.",
  "The secret of getting ahead is getting started.",
  "You can’t cross the sea merely by standing and staring at the water.",
  "The best way to appreciate your job is to imagine yourself without one.",
  "Success is how high you bounce when you hit bottom.",
  "A goal without a plan is just a wish.",
  "Doubt kills more dreams than failure ever will.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Go the extra mile. It’s never crowded.",
  "All our dreams can come true if we have the courage to pursue them.",
  "A person who never made a mistake never tried anything new.",
  "You don’t have to be great to start, but you have to start to be great.",
  "Opportunities multiply as they are seized.",
  "Make each day your masterpiece.",
  "We may encounter many defeats but we must not be defeated.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "There is no substitute for hard work.",
  "What we think, we become.",
  "You are enough just as you are.",
  "Difficult roads often lead to beautiful destinations.",
  "The best view comes after the hardest climb.",
  "Don’t limit your challenges. Challenge your limits.",
  "Do not let what you cannot do interfere with what you can do.",
  "Happiness is not something ready made. It comes from your own actions.",
  "Don’t let small minds convince you that your dreams are too big.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "Courage is resistance to fear, mastery of fear—not absence of fear.",
  "Everything has beauty, but not everyone sees it.",
  "Life is not about finding yourself. Life is about creating yourself.",
  "Perfection is not attainable, but if we chase perfection we can catch excellence.",
  "Turn your wounds into wisdom.",
  "The expert in anything was once a beginner.",
  "Live the life you have imagined.",
  "Believe in yourself and all that you are.",
  "Action is the foundational key to all success.",
  "It is never too late to be what you might have been.",
  "Success is not how high you have climbed, but how you make a positive difference to the world.",
  "I never lose. Either I win or I learn.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "If you want to fly, give up everything that weighs you down.",
  "You only live once, but if you do it right, once is enough.",
  "Happiness is not by chance, but by choice.",
  "Be fearless in the pursuit of what sets your soul on fire.",
  "It’s not whether you get knocked down, it’s whether you get up.",
  "Your time is limited, so don’t waste it living someone else’s life.",
  "The biggest adventure you can take is to live the life of your dreams.",
  "Never give up on a dream just because of the time it will take to accomplish it.",
  "Live for today, plan for tomorrow, party tonight.",
  "Only those who dare to fail greatly can ever achieve greatly.",
  "You will face many defeats in life, but never let yourself be defeated.",
  "Success usually comes to those who are too busy to be looking for it.",
  "It’s never too late to be what you might have been.",
  "Nothing is impossible, the word itself says 'I’m possible'!",
  "Keep your eyes on the stars and your feet on the ground."
];

function getRandomQuote() {
  return localQuotes[Math.floor(Math.random() * localQuotes.length)];
}

async function getNextQuote() {
  const quote = getRandomQuote();
  quoteDisplayElement.textContent = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.textContent = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = "";
  wordsPerMinuteElement.textContent = "0";
}



quoteInputElement.addEventListener("input", debounce(() => {
  if (!startTime) {
    startTimer();
  }
  const quoteArray = quoteDisplayElement.querySelectorAll("span");
  const valueArray = quoteInputElement.value.split("");
  let count = 0;

  quoteArray.forEach((characterSpan, i) => {
    const character = valueArray[i];

    if (character === undefined) {
      characterSpan.classList.remove("right", "wrong");
    } else if (character === characterSpan.textContent) {
      characterSpan.classList.add("right");
      characterSpan.classList.remove("wrong");
      count++;
    } else {
      characterSpan.classList.remove("right");
      characterSpan.classList.add("wrong");
    }
  });


  const wordsPerMinute = Math.round(count * 60 / (getTimerTime() * 5) * 10) / 10;
  wordsPerMinuteElement.textContent = isNaN(wordsPerMinute) ? "0" : wordsPerMinute;

  if (count === quoteArray.length) {
    const timeTaken = getTimerTime();
    const wps = wordsPerMinuteElement.textContent;
    const message = `Congratulations! You typed the quote correctly.\nTime taken: ${timeTaken} seconds\nWords per minute: ${wps}`;
    getNextQuote();
    alert(message);
    handleAlertDismissal();
  }
}, 400));


async function handleAlertDismissal() {
  quoteInputElement.value = "";
  wordsPerMinuteElement.textContent = "0";
  clearInterval(timerInterval);
  timerElement.textContent = "0";
  startTime = null;
}



function startTimer() {
  startTime = new Date();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerElement.textContent = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}



function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}


getNextQuote(); // Initial quote




