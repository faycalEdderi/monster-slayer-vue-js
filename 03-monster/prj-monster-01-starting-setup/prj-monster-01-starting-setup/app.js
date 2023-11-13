function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function triggerDeathAnimation() {
  localStorage.setItem("showDeathAnimation", "true");
  window.location.href = "death.html";
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      hideGameOver: false,
      hideAttack: true,
      msg: "",
      img: "",
      playerWin: 0,
      monsterWin: 0,
      messageLog: [],
    };
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // draw
        this.msg = "It's a draw";
        this.setImg("failed.png");
        this.hideGameOver = true;
      } else if (value <= 0) {
        //    triggerDeathAnimation();
        this.hideGameOver = true;
        this.setImg("death.png");
        this.msg = "YOU DIE";
        this.monsterWin++;
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // draw
        this.img = "failed.png";
        this.msg = "It's a draw";
        this.hideGameOver = true;

        this.playerWin++;
        this.monsterWin++;
      } else if (value <= 0) {
        this.hideGameOver = true;
        this.setImg("cup.png");

        this.msg = "ENNEMY FELLED";
        this.playerWin++;
      }
    },
  },

  computed: {
    monsterBarStyle() {
      if (this.monsterHealth < 0) {
        this.hideAttack = false;
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyle() {
      if (this.playerHealth < 0) {
        this.hideAttack = false;

        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },

    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },

  methods: {
    attackMonster() {
      const attack = getRandomValue(5, 12);
      this.currentRound++;
      this.monsterHealth -= attack;
      this.attackPlayer();

      this.addLogMessage("You", "attack", attack);
    },

    attackPlayer() {
      const attack = getRandomValue(8, 15);
      this.playerHealth -= attack;
      this.addLogMessage("Monster", "attack", attack);
    },

    specialAttackMonster() {
      const attack = getRandomValue(10, 20);
      this.currentRound++;
      this.monsterHealth -= attack;
      this.attackPlayer();
      this.addLogMessage("You", "special-attack", attack);
    },
    healPlayer() {
      this.currentRound++;
      const healtValue = getRandomValue(10, 35);
      if (this.playerHealth + healtValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healtValue;
      }
      this.addLogMessage("You", "heal", healtValue);

      this.attackPlayer();
    },
    restart() {
      // Set initial values to reinitialize data
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.hideGameOver = false;
      this.hideAttack = true;
      this.msg = "";
      this.img = "";
      this.messageLog = [];
      // location.reload();
    },
    surrender() {
      this.hideAttack = false;
      this.hideGameOver = true;
      this.msg = "You surrendered";
      this.monsterWin++;
      this.setImg("flag.png");
    },
    setImg(imgName) {
      this.img = "img/" + imgName;
    },
    addLogMessage(who, what, value) {
      this.messageLog.unshift({
        actionBy : who,
        actionType : what,
        actionValue : value
      });
    },
  },
});

app.mount("#game");
