class App {
    constructor() {
        this.el = document.querySelector('.container');
        this.timerBar = document.querySelector('.time_bar_inner');

        this.status = false;

        this.cardCount = 16;
        this.cardType = ['😺', '🐶', '🦊', '🐹', '🐻', '🐼', '🦁', '🐰'];

        this.cardArr = [];
        this.openCards = [];

        this.cardFlipDelay = 300;
        this.showTime = 3000;

        this.maxCount = 24;
        this.count = this.maxCount;
        this.timer = null;

        this.init();

        this.start();
    }

    init() {
        const shuffledCardTypes = [...this.cardType, ...this.cardType];
        shuffledCardTypes.sort(() => (Math.random() < 0.5 ? -1 : 1));

        shuffledCardTypes.forEach((type) => this.cardArr.push(new Card(type, this)));
    }

    start() {
        this.allCardHandle(this.cardArr, 'open');

        setTimeout(() => {
            this.allCardHandle(this.cardArr, 'close');
            this.timerBar.style.animation = `time ${this.maxCount + 1}s linear forwards`;
            this.timer = setInterval(() => {
                this.count -= 1;
                if (this.count < 0) {
                    this.result(false);
                }
            }, 1000);
        }, this.showTime);
    }

    allCardHandle(arr, value) {
        arr.forEach((card) => {
            card[value]();
        });
    }

    checkMatch() {
        if (this.openCards[0].type === this.openCards[1].type) {
            this.openCards.forEach((card) => card.el.classList.add('collact'));
            this.openCards = [];
            if (this.checkResult()) {
                this.result(true);
            }
        } else {
            setTimeout(this.allCardHandle(this.openCards, 'close'), this.cardFlipDelay + 150);
            this.openCards = [];
        }
    }

    checkResult() {
        return this.cardArr.every((card) => card.isOpen);
    }

    result(value) {
        clearInterval(this.timer);
        this.status = true;
        this.timerBar.style.animationPlayState = 'paused';

        const pop = document.createElement('div');
        pop.classList.add('result');
        pop.innerHTML = value ? '😘' : '🥺';
        this.el.append(pop);
    }
}

class Card {
    constructor(type, app) {
        this.app = app;
        this.type = type;

        this.isOpen = false;

        this.init();
    }

    init() {
        const div = document.createElement('div');
        div.classList.add('card');
        div.style.transition = `${this.app.cardFlipDelay}ms ease-in-out`;

        const front = document.createElement('div');
        front.classList.add('front');
        const back = document.createElement('div');
        back.classList.add('back');

        front.innerHTML = this.type;
        div.append(front, back);

        this.el = div;
        this.app.el.append(div);

        this.render();

        this.eventListener();
    }

    eventListener() {
        this.el.addEventListener('click', () => {
            if (this.app.status) return;
            if (this.isOpen) return;
            if (this.app.openCards.length === 2) return;

            this.app.openCards.push(this);
            this.open();
            if (this.app.openCards.length === 2) {
                setTimeout(() => {
                    this.app.checkMatch();
                }, this.app.cardFlipDelay + 150);
            }
        });
    }

    open() {
        this.isOpen = true;
        this.render();
    }

    close() {
        this.isOpen = false;
        this.render();
    }

    render() {
        if (this.isOpen) {
            this.el.classList.add('open');
        } else {
            this.el.classList.remove('open');
        }
    }
}

new App();
