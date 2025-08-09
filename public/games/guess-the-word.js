let wordList = [
    { word: "apple", hint: "A common fruit that is red or green" },
    { word: "cat", hint: "A small, furry animal often kept as a pet" },
    { word: "sun", hint: "A bright object in the sky that provides light and heat" },
    { word: "book", hint: "An item used for reading, often made of paper" },
    { word: "ball", hint: "A round object used in various sports and games" },
    { word: "tree", hint: "A tall plant with a trunk and branches" },
    { word: "house", hint: "A building where people live" },
    { word: "water", hint: "A clear liquid essential for life" },
    { word: "bird", hint: "A flying animal with feathers and a beak" },
    { word: "flower", hint: "A colorful plant often admired for its beauty" },
    { word: "dog", hint: "A loyal animal often kept as a pet" },
    { word: "car", hint: "A vehicle used for transportation on roads" },
    { word: "pen", hint: "An instrument used for writing" },
    { word: "moon", hint: "A natural satellite that orbits the Earth" },
    { word: "cake", hint: "A sweet dessert often served on special occasions" },
    { word: "fish", hint: "An aquatic animal with fins and scales" },
    { word: "ball", hint: "A round object used in various sports and games" },
    { word: "clock", hint: "A device used to tell time" },
    { word: "rain", hint: "Water falling from the sky in droplets" },
    { word: "door", hint: "An entryway into a building or room" },
    { word: "hat", hint: "An item worn on the head for protection or fashion" },
    { word: "bed", hint: "A piece of furniture used for sleeping" },
    { word: "milk", hint: "A white liquid produced by mammals" },
    { word: "table", hint: "A piece of furniture with a flat top and one or more legs" },
    { word: "phone", hint: "A device used for communication" },
    { word: "cup", hint: "A small container used for drinking" },
    { word: "window", hint: "An opening in a wall that lets in light and air" },
    { word: "star", hint: "A luminous celestial object seen in the night sky" },
    { word: "book", hint: "An item used for reading, often made of paper" },
    { word: "chair", hint: "A piece of furniture with a seat for one person" },
    { word: "moon", hint: "A natural satellite that orbits the Earth" },
    { word: "music", hint: "Sounds arranged in a pleasing way" },
    { word: "bag", hint: "A container used for carrying items" },
    { word: "tree", hint: "A tall plant with a trunk and branches" },
    { word: "flower", hint: "A colorful plant often admired for its beauty" },
    { word: "snow", hint: "Frozen precipitation that falls from the sky" },
    { word: "key", hint: "A small metal object used to unlock things" },
    { word: "bike", hint: "A two-wheeled vehicle propelled by pedals" },
    { word: "map", hint: "A representation of an area, usually on paper" },
    { word: "apple", hint: "A common fruit that is red or green" },
    { word: "door", hint: "An entryway into a building or room" },
    { word: "cake", hint: "A sweet dessert often served on special occasions" },
    { word: "cloud", hint: "A visible mass of condensed water vapor in the sky" },
    { word: "ball", hint: "A round object used in various sports and games" },
    { word: "bird", hint: "A flying animal with feathers and a beak" },
    { word: "dog", hint: "A loyal animal often kept as a pet" },
    { word: "car", hint: "A vehicle used for transportation on roads" },
    { word: "rain", hint: "Water falling from the sky in droplets" },
    { word: "sun", hint: "A bright object in the sky that provides light and heat" },
    { word: "banana", hint: "A long curved fruit with a yellow skin" },
    { word: "computer", hint: "An electronic device for processing data" },
    { word: "guitar", hint: "A musical instrument with strings" },
    { word: "sunglasses", hint: "Eyewear designed to protect the eyes from sunlight" },
    { word: "sandwich", hint: "A food item consisting of bread and filling" },
    { word: "umbrella", hint: "A portable device used to protect against rain or sunlight" },
    { word: "pizza", hint: "A popular Italian dish consisting of a round, flat base of dough" },
    { word: "basketball", hint: "A team sport played on a court with a ball and hoop" },
    { word: "bicycle", hint: "A vehicle with two wheels propelled by pedals" },
    { word: "swimming", hint: "The activity or sport of moving through water using one's limbs" },
    { word: "soccer", hint: "A team sport played with a round ball by two teams of eleven players" },
    { word: "jacket", hint: "A short coat, typically with long sleeves and a fastening down the front" },
    { word: "telephone", hint: "A system for transmitting voices over a distance using wire or radio" },
    { word: "television", hint: "An electronic device used for receiving and displaying television broadcasts" },
    { word: "sandcastle", hint: "A structure made of sand, typically at a beach" },
    { word: "tiger", hint: "A large carnivorous feline mammal" },
    { word: "elephant", hint: "A large mammal with a trunk and tusks" },
    { word: "banana", hint: "A long curved fruit with a yellow skin" },
    { word: "computer", hint: "An electronic device for processing data" },
    { word: "guitar", hint: "A musical instrument with strings" },
    { word: "sunglasses", hint: "Eyewear designed to protect the eyes from sunlight" },
    { word: "sandwich", hint: "A food item consisting of bread and filling" },
    { word: "umbrella", hint: "A portable device used to protect against rain or sunlight" },
    { word: "pizza", hint: "A popular Italian dish consisting of a round, flat base of dough" },
    { word: "basketball", hint: "A team sport played on a court with a ball and hoop" },
    { word: "bicycle", hint: "A vehicle with two wheels propelled by pedals" },
    { word: "swimming", hint: "The activity or sport of moving through water using one's limbs" },
    { word: "soccer", hint: "A team sport played with a round ball by two teams of eleven players" },
    { word: "jacket", hint: "A short coat, typically with long sleeves and a fastening down the front" },
    { word: "telephone", hint: "A system for transmitting voices over a distance using wire or radio" },
    { word: "television", hint: "An electronic device used for receiving and displaying television broadcasts" },
    { word: "sandcastle", hint: "A structure made of sand, typically at a beach" },
    { word: "tiger", hint: "A large carnivorous feline mammal" },
    { word: "elephant", hint: "A large mammal with a trunk and tusks" },


    { word: "mango", hint: "A sweet and juicy fruit popular in India" },
    { word: "elephant", hint: "A large mammal with a long trunk, often seen in Indian wildlife" },
    { word: "bollywood", hint: "The Indian film industry based in Mumbai" },
    { word: "tajmahal", hint: "A famous white marble mausoleum in Agra, India" },
    { word: "samosa", hint: "A fried or baked pastry with a savory filling, a popular Indian snack" },
    { word: "ganesha", hint: "The Hindu deity with the head of an elephant, worshipped as the remover of obstacles" },
    { word: "cricket", hint: "A popular sport in India, played with a bat and ball" },
    { word: "curry", hint: "A dish with a spiced sauce, common in Indian cuisine" },
    { word: "diwali", hint: "The Hindu festival of lights celebrated in India" },
    { word: "yoga", hint: "A spiritual and physical discipline originating from ancient India" },
    { word: "chai", hint: "A type of tea, often served with milk and spices, popular in India" },
    { word: "himalayas", hint: "A mountain range in Asia, home to some of the highest peaks in the world" },
    { word: "sari", hint: "A traditional Indian garment worn by women, consisting of a long piece of fabric draped elegantly" },
    { word: "village", hint: "A small community in rural India, often characterized by simple living and close-knit relationships" },
    { word: "butterfly", hint: "A colorful insect with large wings, commonly seen in gardens and parks across India" },
    { word: "mumbai", hint: "The capital city of the Indian state of Maharashtra, known for its bustling streets and vibrant culture" },
    { word: "elephant", hint: "A large mammal with a long trunk, often seen in Indian wildlife" },
    { word: "henna", hint: "A plant-based dye used for temporary body art, commonly applied during Indian weddings and festivals" },
    { word: "hinduism", hint: "The major religion of India, characterized by a belief in reincarnation and a supreme being" },
    { word: "butter", hint: "A dairy product made from churned cream, used in cooking and as a spread" },
    { word: "india", hint: "A country in South Asia known for its rich history, diverse culture, and spicy cuisine" },
    { word: "jaguar", hint: "A luxury car brand owned by the Indian company Tata Motors" },
    { word: "mumbai", hint: "The capital city of the Indian state of Maharashtra, known for its bustling streets and vibrant culture" },
    { word: "kolkata", hint: "A major city in West Bengal, India, known for its colonial architecture and cultural festivals" },
    { word: "banyantree", hint: "A type of fig tree considered sacred in Hinduism, often seen in Indian landscapes" },
    { word: "biryani", hint: "A flavorful rice dish cooked with spices, meat, and/or vegetables, popular in Indian cuisine" },
    { word: "bollywood", hint: "The Indian film industry based in Mumbai" },
    { word: "tajmahal", hint: "A famous white marble mausoleum in Agra, India" },
    { word: "samosa", hint: "A fried or baked pastry with a savory filling, a popular Indian snack" },
    { word: "ganesha", hint: "The Hindu deity with the head of an elephant, worshipped as the remover of obstacles" },
    { word: "cricket", hint: "A popular sport in India, played with a bat and ball" },
    { word: "curry", hint: "A dish with a spiced sauce, common in Indian cuisine" },
    { word: "diwali", hint: "The Hindu festival of lights celebrated in India" },
    { word: "yoga", hint: "A spiritual and physical discipline originating from ancient India" },
    { word: "chai", hint: "A type of tea, often served with milk and spices, popular in India" },
    { word: "himalayas", hint: "A mountain range in Asia, home to some of the highest peaks in the world" },
    { word: "sari", hint: "A traditional Indian garment worn by women, consisting of a long piece of fabric draped elegantly" },
    { word: "village", hint: "A small community in rural India, often characterized by simple living and close-knit relationships" },
    { word: "butterfly", hint: "A colorful insect with large wings, commonly seen in gardens and parks across India" },
    { word: "mumbai", hint: "The capital city of the Indian state of Maharashtra, known for its bustling streets and vibrant culture" },
    { word: "elephant", hint: "A large mammal with a long trunk, often seen in Indian wildlife" },
    { word: "henna", hint: "A plant-based dye used for temporary body art, commonly applied during Indian weddings and festivals" },
    { word: "hinduism", hint: "The major religion of India, characterized by a belief in reincarnation and a supreme being" },
    { word: "butter", hint: "A dairy product made from churned cream, used in cooking and as a spread" },
    { word: "india", hint: "A country in South Asia known for its rich history, diverse culture, and spicy cuisine" },
    { word: "jaguar", hint: "A luxury car brand owned by the Indian company Tata Motors" },
    { word: "mumbai", hint: "The capital city of the Indian state of Maharashtra, known for its bustling streets and vibrant culture" },
    { word: "kolkata", hint: "A major city in West Bengal, India, known for its colonial architecture and cultural festivals" },
    { word: "banyantree", hint: "A type of fig tree considered sacred in Hinduism, often seen in Indian landscapes" },
    { word: "biryani", hint: "A flavorful rice dish cooked with spices, meat, and/or vegetables, popular in Indian cuisine" },


];


let word;
let currentIndex = 0;
const inputsContainer = document.querySelector(".inputs");
const hintTag = document.querySelector(".hint span");


function chooseRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const randomItem = wordList[randomIndex];
    word = randomItem.word.toLowerCase();
    hintTag.innerText = randomItem.hint;
    currentIndex = 0;
    renderInputFields(word.length);
}


function renderInputFields(length) {
    inputsContainer.innerHTML = "";
    for (let i = 0; i < length; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("input");
        input.maxLength = 1;
        input.dataset.index = i;
        input.addEventListener("input", handleInput);
        inputsContainer.appendChild(input);
    }

    document.querySelector(".input").focus();
}


function handleInput(event) {
    const value = event.target.value.trim().toLowerCase();
    if (value) {
        currentIndex++;
        if (currentIndex < word.length) {
            document.querySelector(`.input[data-index="${currentIndex}"]`).focus();
        } else {
            checkWord();
        }
    }
}


function checkWord() {
    const enteredWord = Array.from(document.querySelectorAll(".input")).map(input => input.value.toLowerCase()).join('');
    if (enteredWord === word) {
        alert(`Great! You guessed the word "${word}" correctly.`);
    } else {
        alert(`Wrong! The correct word is "${word}".`);
    }
    chooseRandomWord();
}



function resetInputs() {
    document.querySelectorAll(".input").forEach(input => input.value = "");
    currentIndex = 0;
    document.querySelector(".input").focus();
}


chooseRandomWord();
