require('./seedrandom.min.js')
// jbonsai

module.exports = class bonsai {
    constructor(x, y) {
        this._x = x
        this._y = y

        this._config = {
            live: 0,
            infinite: 0,
            verbosity: 0,
            lifeStart: 30,
            multiplier: 5,
            baseType: 1,
            seed: "random",
            stop: false,

            shootCounter: 0,

            timeWait: 4,
            timeStep: 50, //milisec
            totalTime: 0,

            leaves: ["&"]
        }

        this._buffer = []
    }

    rand() {
        return Math.floor(Math.random() * 10000)
    }

    rollDice(base) {
        return (this.rand() % base) + 1
    }

    seed(seed) {
        Math.seedrandom(seed)
    }

    DrawAt(x, y, char, color) {

        if (x < 0 || x >= this._x || y < 0 || y >= this._y)
            return

        if (char.length < 1 || char == " ")
            return

        if (char.length == 1) {

            //retrun if overlap current bonsai leaves
            /*
            if (this._config.leaves.includes(this.getAt(x, y)))
                return
            */

            if (this.getAt(x, y) != "")
                return

            if (!this._buffer.find(K => K.x == x && K.y == y)) {
                this._buffer.push({
                    x: x,
                    y: y,
                    char: char,
                    color: color,
                    tick: this._config.totalTime,
                    despawn_tick: -1
                })
            }
            else {
                for (let i = 0; i < this._buffer.length; i++) {
                    if (this._buffer[i].x == x && this._buffer[i].y == y && this._buffer[i].despawn_tick == -1) {
                        this._buffer[i].despawn_tick = this._config.totalTime
                    }
                }

                this._buffer.push({
                    x: x,
                    y: y,
                    char: char,
                    color: color,
                    tick: this._config.totalTime,
                    despawn_tick: -1
                })
            }
        }
        else {
            for (let index = 0; index < char.length; index++) {
                this.DrawAt(x + index, y, char[index], color)
            }
        }
    }

    getAt(x, y) {
        let result = ""
        for (let i = 0; i < this._buffer.length; i++) {
            let current = this._buffer[i]
            if (current.x == x && current.y == y)
                result = current.char
        }
        return result
    }

    drawBase(baseType = 1) {
        let x = Math.floor(this._x / 2),
            y = Math.floor(this._y - 4)
        // draw base art
        switch (baseType) {
            case 1: {
                // vase size 32x4

                //first line
                this.DrawAt(x - 16, y, ":", "#7f8490")
                this.DrawAt(x - 15, y, "___________", "#9ed072")
                this.DrawAt(x - 4, y, "./~~~\\.", "#fc5d7c")
                this.DrawAt(x + 3, y, "___________", "#9ed072")
                this.DrawAt(x + 14, y++, ":", "#7f8490")

                //other lines
                this.DrawAt(x - 16, y++, " \\                           /", "#7f8490")
                this.DrawAt(x - 16, y++, "  \\_________________________/", "#7f8490")
                this.DrawAt(x - 16, y, "  (_)                     (_)", "#7f8490")
                break;
            }

            case 2: {
                // vase size 32x4
                this.DrawAt(x - 7, y, "(", "#7f8490")
                this.DrawAt(x - 6, y, "---", "#9ed072")
                this.DrawAt(x - 3, y, "./~~~\\.", "#fc5d7c")
                this.DrawAt(x + 4, y, "---", "#9ed072")
                this.DrawAt(x + 7, y++, ")", "#7f8490")

                this.DrawAt(x - 7, y++, " (           )", "#7f8490")
                this.DrawAt(x - 7, y++, "  (_________)", "#7f8490")
                break;
            }
        }
    }
    setDeltas(type, life, age, multiplier = 5) {
        let dx = 0;
        let dy = 0;
        let dice;
        switch (type) {
            case "trunk": // trunk

                // new or dead trunk
                if (age <= 2 || life < 4) {
                    dy = 0;
                    dx = (this.rand() % 3) - 1;
                }
                // young trunk should grow wide
                else if (age < (multiplier * 3)) {

                    // every (multiplier * 0.8) steps, raise tree to next level
                    if (age % Math.floor(multiplier * 0.5) == 0) dy = -1;
                    else dy = 0;

                    dice = this.rollDice(10);
                    if (dice >= 0 && dice <= 0) dx = -2;
                    else if (dice >= 1 && dice <= 3) dx = -1;
                    else if (dice >= 4 && dice <= 5) dx = 0;
                    else if (dice >= 6 && dice <= 8) dx = 1;
                    else if (dice >= 9 && dice <= 9) dx = 2;
                }
                // middle-aged trunk
                else {
                    dice = this.rollDice(10);
                    if (dice > 2) dy = -1;
                    else dy = 0;
                    dx = (this.rand() % 3) - 1;
                }
                break;

            case "shootLeft": // left shoot: trend left and little vertical movement
                dice = this.rollDice(10);
                if (dice >= 0 && dice <= 1) dy = -1;
                else if (dice >= 2 && dice <= 7) dy = 0;
                else if (dice >= 8 && dice <= 9) dy = 1;

                dice = this.rollDice(10);
                if (dice >= 0 && dice <= 1) dx = -2;
                else if (dice >= 2 && dice <= 5) dx = -1;
                else if (dice >= 6 && dice <= 8) dx = 0;
                else if (dice >= 9 && dice <= 9) dx = 1;
                break;

            case "shootRight": // right shoot: trend right and little vertical movement
                dice = this.rollDice(10);
                if (dice >= 0 && dice <= 1) dy = -1;
                else if (dice >= 2 && dice <= 7) dy = 0;
                else if (dice >= 8 && dice <= 9) dy = 1;

                dice = this.rollDice(10);
                if (dice >= 0 && dice <= 1) dx = 2;
                else if (dice >= 2 && dice <= 5) dx = 1;
                else if (dice >= 6 && dice <= 8) dx = 0;
                else if (dice >= 9 && dice <= 9) dx = -1;
                break;

            case "dying": // dying: discourage vertical growth(?); trend left/right (-3,3)
                dice = this.rollDice(10);
                if (dice >= 0 && dice <= 1) dy = -1;
                else if (dice >= 2 && dice <= 8) dy = 0;
                else if (dice >= 9 && dice <= 9) dy = 1;

                dice = this.rollDice(15);
                if (dice >= 0 && dice <= 0) dx = -3;
                else if (dice >= 1 && dice <= 2) dx = -2;
                else if (dice >= 3 && dice <= 5) dx = -1;
                else if (dice >= 6 && dice <= 8) dx = 0;
                else if (dice >= 9 && dice <= 11) dx = 1;
                else if (dice >= 12 && dice <= 13) dx = 2;
                else if (dice >= 14 && dice <= 14) dx = 3;
                break;

            case "dead": // dead: fill in surrounding area
                dice = this.rollDice(10);
                if (dice >= 0 && dice <= 2) dy = -1;
                else if (dice >= 3 && dice <= 6) dy = 0;
                else if (dice >= 7 && dice <= 9) dy = 1;
                dx = (this.rand() % 3) - 1;
                break;
        }

        return { dx, dy }
    }


    chooseColor(type) {
        switch (type) {
            case "trunk":
            case "shootLeft":
            case "shootRight":
                if (this.rand() % 2 == 0) return "#f39660"; //bold later
                else return "#df9318";

            case "dying":
                //if (this.rand() % 10 == 5) return "#fc5d7c" //bold 
                if (this.rand() % 5 == 2) return "#f39660" //bold 
                else return "#e7c664"

            case "dead":
                if (this.rand() % 3 == 0) return "#4FAE30" //bold 
                else return "#6AE841"
        }

        return "#ffffff"
    }

    chooseString(type, life, dx, dy) {
        let branchStr = "?";

        if (life < 4) type = "dying";

        switch (type) {
            case "trunk":
                if (dy == 0) branchStr = "/~"
                else if (dx < 0) branchStr = "\\|"
                else if (dx == 0) branchStr = "/|\\"
                else if (dx > 0) branchStr = "|/"
                break;
            case "shootLeft":
                if (dy > 0) branchStr = "\\"
                else if (dy == 0) branchStr = "\\_"
                else if (dx < 0) branchStr = "\\|"
                else if (dx == 0) branchStr = "/|"
                else if (dx > 0) branchStr = "/"
                break;
            case "shootRight":
                if (dy > 0) branchStr = "/"
                else if (dy == 0) branchStr = "_/"
                else if (dx < 0) branchStr = "\\|"
                else if (dx == 0) branchStr = "/|"
                else if (dx > 0) branchStr = "/"
                break;
            case "dying":
            case "dead":
                branchStr = this._config.leaves[this.rand() % this._config.leaves.length]
        }

        return branchStr;
    }

    start(y, x, type, life) {
        this._stack = []

        this._stack.push({
            x: x,
            y: y,
            type: type,
            life: life,
            age: 0,
            shootCooldown: this._config.multiplier
        })

        while (this._stack.length > 0) {
            let current_stack = this._stack[this._stack.length - 1]

            //let age = 0;
            //let shootCooldown = this._config.multiplier //multiplier;
            while (current_stack.life > 0) {
                // quit if a key pressed
                if (this._config.stop) {
                    setTimeOuts.forEach(E => clearTimeout(E))
                    setTimeOuts = []
                    return
                }

                current_stack.life--;		// decrement remaining life counter
                current_stack.age = this._config.lifeStart - current_stack.life;

                let { dx, dy } = this.setDeltas(current_stack.type, current_stack.life, current_stack.age, this._config.multiplier)

                if (dy > 0 && current_stack.y > (this._y - 10)) dy--; // reduce dy if too close to the ground

                // near-dead branch should branch into a lot of leaves
                if (current_stack.life < 3) {
                    //this.branch(y, x, "dead", current_stack.life);
                    this._stack.push({
                        x: current_stack.x,
                        y: current_stack.y,
                        type: "dead",
                        life: current_stack.life,
                        age: 0,
                        shootCooldown: this._config.multiplier
                    })
                    //continue;
                }

                // dying trunk should branch into a lot of leaves
                else if (current_stack.type == "trunk" && current_stack.life < (this._config.multiplier + 2)) {
                    //this.branch(y, x, "dying", life);
                    this._stack.push({
                        x: current_stack.x,
                        y: current_stack.y,
                        type: "dying",
                        life: current_stack.life,
                        age: 0,
                        shootCooldown: this._config.multiplier
                    })
                    //continue;
                }

                // dying shoot should branch into a lot of leaves
                else if ((current_stack.type == "shootLeft" || current_stack.type == "shootRight") && current_stack.life < (this._config.multiplier + 2)) {
                    //this.branch(y, x, "dying", life);
                    this._stack.push({
                        x: current_stack.x,
                        y: current_stack.y,
                        type: "dying",
                        life: current_stack.life,
                        age: 0,
                        shootCooldown: this._config.multiplier
                    })
                    //continue;
                }

                // trunks should re-branch if not close to ground AND either randomly, or upon every <multiplier> steps
                else if (current_stack.type == "trunk" && (((this.rand() % 3) == 0) || (current_stack.life % this._config.multiplier == 0))) {

                    // if trunk is branching and not about to die, create another trunk with random life
                    if ((this.rand() % 8 == 0) && current_stack.life > 7) {
                        current_stack.shootCooldown = this._config.multiplier * 2;	// reset shoot cooldown
                        //this.branch(y, x, "trunk", life + (this.rand() % 5 - 2));
                        this._stack.push({
                            x: current_stack.x,
                            y: current_stack.y,
                            type: "trunk",
                            life: current_stack.life + (this.rand() % 5 - 2),
                            age: 0,
                            shootCooldown: this._config.multiplier
                        })
                        //continue;
                    }

                    // otherwise create a shoot
                    else if (current_stack.shootCooldown <= 0) {
                        current_stack.shootCooldown = this._config.multiplier * 2;	// reset shoot cooldown

                        let shootLife = (current_stack.life + this._config.multiplier);

                        this._config.shootCounter++

                        // create shoot

                        let chooseBranch = [
                            "shootLeft",
                            "shootRight"
                        ]
                        //this.branch(y, x, chooseBranch[this._config.shootCounter % 2], shootLife);
                        this._stack.push({
                            x: current_stack.x,
                            y: current_stack.y,
                            type: chooseBranch[this._config.shootCounter % 2],
                            life: shootLife,
                            age: 0,
                            shootCooldown: this._config.multiplier
                        })
                        //continue;
                    }
                }

                current_stack.shootCooldown--;

                current_stack.x += dx;
                current_stack.y += dy;

                let color = this.chooseColor(current_stack.type);

                // choose string to use for this branch
                let branchStr = this.chooseString(current_stack.type, current_stack.life, dx, dy);

                //if (!this._config.leaves.includes(this.getAt(current_stack.x, current_stack.y)) || this._config.leaves.includes(branchStr)) {
                this.DrawAt(Math.floor(current_stack.x), current_stack.y, branchStr, color)
                this._config.totalTime += this._config.timeStep
                //}

            }

            //remove stack after it done
            this._stack.pop()
        }
    }

    /*
    branch(y, x, type, life) {

        let age = 0;
        let shootCooldown = this._config.multiplier //multiplier;

        while (life > 0) {

            // quit if a key pressed
            if (this._config.stop) {
                setTimeOuts.forEach(E => clearTimeout(E))
                setTimeOuts = []
                return
            }

            life--;		// decrement remaining life counter
            age = this._config.lifeStart - life;

            let { dx, dy } = this.setDeltas(type, life, age, this._config.multiplier)

            if (dy > 0 && y > (this._y - 2)) dy--; // reduce dy if too close to the ground

            // near-dead branch should branch into a lot of leaves
            if (life < 3) {
                this.branch(y, x, "dead", life);
            }

            // dying trunk should branch into a lot of leaves
            else if (type == "trunk" && life < (this._config.multiplier + 2))
                this.branch(y, x, "dying", life);

            // dying shoot should branch into a lot of leaves
            else if ((type == "shootLeft" || type == "shootRight") && life < (this._config.multiplier + 2))
                this.branch(y, x, "dying", life);

            // trunks should re-branch if not close to ground AND either randomly, or upon every <multiplier> steps
            else if (type == "trunk" && (((this.rand() % 3) == 0) || (life % this._config.multiplier == 0))) {

                // if trunk is branching and not about to die, create another trunk with random life
                if ((this.rand() % 8 == 0) && life > 7) {
                    shootCooldown = this._config.multiplier * 2;	// reset shoot cooldown
                    this.branch(y, x, "trunk", life + (this.rand() % 5 - 2));
                }

                // otherwise create a shoot
                else if (shootCooldown <= 0) {
                    shootCooldown = this._config.multiplier * 2;	// reset shoot cooldown

                    let shootLife = (life + this._config.multiplier);

                    //if (config.verbosity) mvwprintw(objects->treeWin, 4, 5, "shoots: %02d", myCounters->shoots);

                    this._config.shootCounter++

                    // create shoot

                    let chooseBranch = [
                        "shootLeft",
                        "shootRight"
                    ]
                    this.branch(y, x, chooseBranch[this._config.shootCounter % 2], shootLife);
                }
            }

            shootCooldown--;

            x += dx;
            y += dy;

            let color = this.chooseColor(type);

            // choose string to use for this branch
            let branchStr = this.chooseString(type, life, dx, dy);

            if (!this._config.leaves.includes(this.getAt(x, y)) || this._config.leaves.includes(branchStr)) {

                this.DrawAt(Math.floor(x), y, branchStr, color)
                this._config.totalTime += this._config.timeStep
            }
        }
    }
    */


    growTree() {
        if (this._config.seed != "random") {
            this.seed(this._config.seed)
        }

        this._config.shootCounter = this.rand()

        this.drawBase(this.rollDice(2))
        //this.branch(this._y - 5, Math.floor(this._x / 2) - 1, "trunk", this._config.lifeStart);
        this.start(this._y - 5, Math.floor(this._x / 2) - 1, "trunk", this._config.lifeStart);
    }

    render() {
        let result = ""

        this._buffer.forEach(E => {
            result += `<text x="${E.x * 9.61}" y="${E.y * 21}" class="text" 
            style="fill: ${E.color};animation: show 0.1s ${E.despawn_tick == -1 ? "" : ", hide 0.1s"};animation-delay: ${E.tick / 1000}s ${E.despawn_tick == -1 ? "" : ", " + (E.despawn_tick / 1000) + "s"};animation-fill-mode: forwards;">${E.char == "&" ? "&amp;" : E.char}</text>`

        })

        return result
    }


}
