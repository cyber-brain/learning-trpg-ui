let newGameBtn = document.getElementById("new-game");
let overlayMenu = document.getElementsByClassName("menu-overlay")[0];
let attackBtn = document.getElementById("attack");
let guardBtn = document.getElementById("guard");
let potionBtn = document.getElementById("potion");
let enemyHpBar = document.getElementById("enemy-hp-value");
let playerHpBar = document.getElementById("player-hp-value");

function takeDamage(damageValue) {
    if (this.guarding) {
        damageValue /= 2;
    }
    if (this.hp - damageValue > 0) {
        this.hp -= damageValue;
    } else {
        this.hp = 0;
        this.alive = false;
    }
    this.hpBar.style.width = `${enemy.hp}%`;
}

function heal(target, amount) {
    target.hp += amount;
}

let enemy = {
    hp: 100,
    alive: true,
    attackPower: 5,
    takeDamage: takeDamage,
    guarding: true,
    hpBar: enemyHpBar,
}

let player = {
    hp: 100,
    alive: true,
    attackPower: 20,
    takeDamage: takeDamage,
    guarding: false,
    hpBar: playerHpBar
}

newGameBtn.addEventListener("click", newGame);
attackBtn.addEventListener("click", attack);
guardBtn.addEventListener("click", guard);
potionBtn.addEventListener("click", potion);

function newGame () {
    overlayMenu.style.display = "none";
}

function attack () {
    enemy.takeDamage(player.attackPower);
    console.log(enemy);
    enemyTurn();
    console.log(player);
}

function guard () {
    player.guarding = true;
    enemyTurn();
    player.guarding = false;
    console.log(player);
}

function potion () {
    heal(player, 30);
    console.log(player);
    enemyTurn()
    console.log(player);
}

function enemyTurn() {
    player.takeDamage(enemy.attackPower);
}
