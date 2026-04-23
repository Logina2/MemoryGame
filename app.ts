const images: string[] = ['0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
let flippedCards: HTMLElement[] = [];
let matchedPairs: number = 0;
let lockBoard: boolean = false;
let seconds: number = 0;
let timerInterval: any;

const board = document.getElementById('game-board') as HTMLElement;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const progressBar = document.getElementById('progress-bar') as HTMLElement;
const timerElement = document.getElementById('timer') as HTMLElement;
const gameMessage = document.getElementById('game-message') as HTMLElement;

startBtn.onclick = () => {
    if (startBtn.parentElement) {
        startBtn.parentElement.classList.add('d-none');
    }
    gameMessage.innerText = "Find all pairs!";
    resetGame();
    renderBoard();
    startTimer();
};

function resetGame(): void {
    matchedPairs = 0;
    seconds = 0;
    flippedCards = [];
    lockBoard = false;
    timerElement.innerText = '0';
    progressBar.style.width = '0%';
    progressBar.innerText = '0%';
}

function renderBoard(): void {
    board.innerHTML = '';
    const deck: string[] = [...images, ...images].sort(() => Math.random() - 0.5);

    deck.forEach(imgSrc => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'col-4 col-md-3 col-lg-2 card-container';

        cardContainer.innerHTML = `
            <div class="card-inner" data-name="${imgSrc}">
                <div class="card-front">?</div>
                <div class="card-back">
                    <img src="images/${imgSrc}" style="width:100%; height:100%; object-fit:contain;">
                </div>
            </div>`;

        const cardInner = cardContainer.querySelector('.card-inner') as HTMLElement;
        cardInner.onclick = () => flip(cardInner);
        board.appendChild(cardContainer);
    });
}

function flip(card: HTMLElement): void {
    if (lockBoard || card.classList.contains('flipped') || flippedCards.length === 2) return;

    card.classList.add('flipped');
    playSound('flipSound');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch(): void {
    const [card1, card2] = flippedCards;
    const name1 = card1?.getAttribute('data-name');
    const name2 = card2?.getAttribute('data-name');

    if (name1 === name2) {
        matchedPairs++;
        updateUI();
        playSound('matchSound');
        flippedCards = [];

        if (matchedPairs === images.length) {
            winGame();
        }
    } else {
        lockBoard = true;
        playSound('failSound');
        setTimeout(() => {
            card1?.classList.remove('flipped');
            card2?.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 800);
    }
}

function updateUI(): void {
    const percent: number = Math.floor((matchedPairs / images.length) * 100);
    progressBar.style.width = `${percent}%`;
    progressBar.innerText = `${percent}%`;
}

function startTimer(): void {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.innerText = seconds.toString();
    }, 1000);
}

function winGame(): void {
    clearInterval(timerInterval);
    playSound('winSound');
    gameMessage.innerText = `Great Job! You finished in ${seconds} seconds.`;
    startBtn.parentElement?.classList.remove('d-none');
    startBtn.innerText = "Play Again";
}

function playSound(id: string): void {
    const audio = document.getElementById(id) as HTMLAudioElement;
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => { });
    }
}