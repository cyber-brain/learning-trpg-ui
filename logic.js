let newGameBtn = document.getElementById("new-game-btn");
let continueBtn = document.getElementById("continue-btn");
let attackBtn = document.getElementById("attack-btn");
let guardBtn = document.getElementById("guard-btn");
let potionBtn = document.getElementById("potion-btn");
let menuBtn = document.getElementById("menu-btn");
let logBtn = document.getElementById("log-btn");
let potionCounterSpan = document.getElementById("potion-counter");
var GAME;

let actorImages = document.querySelectorAll(".actor img");
for (let img of actorImages) {
    img.addEventListener("animationend", function() {
        this.classList.remove("shaking");
    })
}


continueBtn.disabled = true;

let MainMenu = {
    menuDiv: document.getElementsByClassName("main-menu")[0],
    gameScreen: document.getElementsByClassName("game-screen")[0],
    open: function () {
        this.menuDiv.classList.remove("hidden");
        this.gameScreen.classList.add("blurred");
    },
    close: function () {
        this.menuDiv.classList.add("hidden");
        this.gameScreen.classList.remove("blurred");
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function Actor() {
    this.alive = true;
    this.guarding = false;
    this.takeDamage = function (damageValue) {
        if (this.guarding) {
            damageValue = Math.ceil(damageValue / 2);
        }
        if (this.hp - damageValue > 0) {
            this.hp -= damageValue;
        } else {
            this.hp = 0;
            this.alive = false;
        }

        this.img.classList.add("shaking");

        this.guarding = false;
        this.updateHpBar()
    };
    this.attackValue = function () {
        return this.attackPower + randInt(-7, 7);
    };
    this.updateHpBar = function () {
        this.hpBar.style.width = `${Math.round(this.hp / this.maxHp * 100)}%`;
    }
}

function Player() {
    Actor.call(this);
    this.maxHp = 100;
    this.hp = 100;
    this.attackPower = 15;
    this.hpBar = document.getElementById("hp-player");
    this.heal = function (amount) {
        if (this.hp + amount > this.maxHp) {
            this.hp = this.maxHp;
        } else {
            this.hp += amount;
        }
        this.updateHpBar();
    }
    this.potionCount = 3;
    this.counterChance = 0.2;
    this.img = document.querySelector("#player-container img");
    this.updateHpBar();
    potionCounterSpan.textContent = this.potionCount;
}

function Enemy() {
    Actor.call(this);
    this.maxHp = 100;
    this.hp = 100;
    this.attackPower = 18;
    this.hpBar = document.getElementById("hp-enemy");
    this.img = document.querySelector("#enemy-container img");
    this.updateHpBar();
}

let PlayerActions = {
    attack: function (game) {
        let damage = game.player.attackValue();
        game.enemy.takeDamage(damage);

        console.log(`Turn ${game.turnCounter}: Player deals ${damage} dmg to enemy.`);
    },
    guard: function (game) {
        game.player.guarding = true;
        if (Math.random() <= game.player.counterChance) {
            game.enemy.takeDamage(game.player.attackPower * 2);
            console.log(`Turn ${game.turnCounter}: Player assumes guarding stance and counters for ${game.player.attackPower * 2} dmg.`);
        } else {
            console.log(`Turn ${game.turnCounter}: Player assumes guarding stance but fails to counter.`);
        }

    },
    potion: function (game) {
        if (game.player.potionCount > 0) {
            let hpBefore = game.player.hp;
            game.player.heal(40);
            game.player.potionCount -= 1;
            potionCounterSpan.textContent = game.player.potionCount;

            let restored = game.player.hp - hpBefore;
            console.log(`Turn ${game.turnCounter}: Player restored ${restored} HP with a potion.`);
        }
    }
}

function Game() {
    this.turnCounter = 1;
    this.player = new Player();
    this.enemy = new Enemy();
    this.log = new Array(),
    this.playTurn = function(action) {
        action(this);
        let playerHpBefore = this.player.hp;

        if (this.enemy.alive) {
            let dmgToPlayer = this.enemy.attackValue();
            this.player.takeDamage(dmgToPlayer);
            if (!this.player.alive) {
                MainMenu.open();
                continueBtn.disabled = true;
                alert("Player met their end at the claws of the monster! :'(");
            }
        } else {
            MainMenu.open();
            continueBtn.disabled = true;
            alert("Player Wins!!! Get some cake ;P");
        }

        let receivedDamage = playerHpBefore - this.player.hp;
        console.log(`Turn ${this.turnCounter}: Enemy deals ${receivedDamage} dmg to player.`);

        this.turnCounter += 1;
    }
    continueBtn.disabled = false;
}

newGameBtn.addEventListener("click", function(){
    GAME = new Game();
    MainMenu.close();
})
menuBtn.addEventListener("click", function(){
    MainMenu.open();
})
continueBtn.addEventListener("click", function(){
    MainMenu.close();
})

attackBtn.addEventListener("click", function() {
    GAME.playTurn(PlayerActions.attack);
})
guardBtn.addEventListener("click", function() {
    GAME.playTurn(PlayerActions.guard);
})
potionBtn.addEventListener("click", function() {
    GAME.playTurn(PlayerActions.potion);
})
