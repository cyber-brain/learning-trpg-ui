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

function appendToList(listElement, message, addClass) {
    let newLi = document.createElement("li");
    newLi.appendChild(document.createTextNode(message));
    if (addClass) {
        newLi.setAttribute("class", addClass)
    }
    listElement.appendChild(newLi);
}

let PlayerActions = {
    attack: function (game) {
        let damage = game.player.attackValue();
        game.enemy.takeDamage(damage);

        let msg = `Player deals ${damage} dmg to enemy.`
        appendToList(game.log, msg);
        console.log(msg);
    },
    guard: function (game) {
        game.player.guarding = true;
        if (Math.random() <= game.player.counterChance) {
            game.enemy.takeDamage(game.player.attackPower * 2);
            let msg = `Player assumes guarding stance and counters for ${game.player.attackPower * 2} dmg.`
            appendToList(game.log, msg);
            console.log(msg);
        } else {
            let msg = `Player assumes guarding stance but fails to counter.`
            appendToList(game.log, msg);
            console.log(msg);
        }

    },
    potion: function (game) {
        if (game.player.potionCount > 0) {
            let hpBefore = game.player.hp;

            game.player.heal(40);
            game.player.potionCount -= 1;
            potionCounterSpan.textContent = game.player.potionCount;

            if (game.player.potionCount === 0) {
                potionBtn.disabled = true;
            } else {
                potionBtn.disabled = false;
            }

            let restored = game.player.hp - hpBefore;
            let msg = `Player restored ${restored} HP with a potion.`
            appendToList(game.log, msg);
            console.log(msg);
        }
    }
}

function Game() {
    this.turnCounter = 1;
    this.player = new Player();
    this.enemy = new Enemy();
    this.log = document.querySelector(".log > ol"),
    this.playTurn = function(action) {
        appendToList(this.log, `Turn ${this.turnCounter}`, "underlined");
        console.log(`Turn ${this.turnCounter}`)

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
        let msg = `Enemy deals ${receivedDamage} dmg to player.`
        appendToList(this.log, msg);
        console.log(msg);
        this.turnCounter += 1;
    }
    continueBtn.disabled = false;
    this.log.innerHTML = "";
    document.querySelector("div.log").classList.add("hidden");
    document.querySelector("div.world").classList.remove("blurred");
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
logBtn.addEventListener("click", function() {
    document.querySelector("div.log").classList.toggle("hidden");
    document.querySelector("div.world").classList.toggle("blurred");
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
