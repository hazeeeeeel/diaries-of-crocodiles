const _pu = 80;

class Pebble {
    constructor(t, idx) {
        this.type = random(["rock", "paper", "scissors"]);
        this.x = 0;
        this.y = 0;
        // this.x1 = this.x + _pu * 2;
        // this.y1 = this.y - _pu * 2;
        this.t = t;
        this.idx = idx;
    }

    draw(x, y) {
        push();

        this.x = x;
        this.y = y;
        // let x = this.x;
        // let y = this.y;
        let s = 1.2;
        fill(255);
        stroke(1);
        strokeWeight(1);
        rectMode(CENTER);
        switch (this.type) {
            case "rock":
                // rect(x, y, _pu * 2, _pu * 2);
                ellipse(x, y, _pu * s + 10, _pu * s + 10);
                break;
            case "paper":
                // rect(x, y, _pu * 2, _pu * 2);
                rect(x, y, _pu * s, _pu * s);
                
                break;
            case "scissors":
                // rect(x, y, _pu * 2, _pu * 2);
                triangle(x-_pu * s / 2, y+_pu * s / 2, x+_pu * s / 2, y+_pu * s / 2, x, y-_pu * s / 2);
                
                break;
        }
        
        pop();
    }

    drawFocus() {
        push();

        let x = (width - 60) / 4 + 30;
        let y = (height - 60) / 2 - 10;
        let s = 3.6;
        fill(255, 255, 255, 40);
        stroke(1, 1, 1, 40);
        strokeWeight(1);
        rectMode(CENTER);
        switch (this.type) {
            case "rock":
                // rect(x, y, _pu * 4, _pu * 4);
                ellipse(x, y, _pu * s + 10, _pu * s + 10);
                break;
            case "paper":
                // rect(x, y, _pu * 2, _pu * 2);
                rect(x, y, _pu * s, _pu * s);
                
                break;
            case "scissors":
                // rect(x, y, _pu * 2, _pu * 2);
                triangle(x-_pu * s / 2, y+_pu * s / 2, x+_pu * s / 2, y+_pu * s / 2, x, y-_pu * s / 2);
                
                break;
        }

        pop();
    }

    hovered(mx, my) {
        return dist(mx, my, this.x, this.y) < _pu;
    }
}