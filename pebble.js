const _pu = 80;

class Pebble {
    constructor(idx) {
        // this.type = random(["rock", "paper", "scissors"]);
        this.type = "rock";
        this.rndX = random(-1.6, 1.6);
        this.rndY = random(-1.6, 1.6);
        this.stretchX = random(0.4, 1.6);
        this.stretchY = random(0.4, 1.6);
        this.x = 0;
        this.y = 0;
        // this.x1 = this.x + _pu * 2;
        // this.y1 = this.y - _pu * 2;
        this.idx = idx;
    }

    draw(x, y, s = 1.2) {
        push();

        this.x = x;
        this.y = y;
        // let x = this.x;
        // let y = this.y;
        fill(255);
        stroke(1);
        strokeWeight(1);
        rectMode(CENTER);
        switch (this.type) {
            case "rock":
                // rect(x, y, _pu * 2, _pu * 2);
                push();
                // Move to the center point first
                translate(x, y);
                
                // Apply skew via raw canvas transform
                // The skew matrix: [1, tan(skewY), tan(skewX), 1, 0, 0]
                let rotation = map(mouseX, 0, width, -0.17, 0.17);
                let skewX = map(mouseX, 0, width, -0.5, 0.5);
                let skewY = map(mouseY, 0, height, -0.5, 0.5);

                rotate(rotation);

                drawingContext.transform(
                    this.stretchX,                         // scale X
                    this.stretchY * Math.tan(skewY) * this.rndX,       // skewY scaled
                    this.stretchX * Math.tan(skewX) * this.rndY,       // skewX scaled
                    this.stretchY,                         // scale Y
                    0, 
                    cos(mouseX / 110)
                );
                fill(50);
                // Draw ellipse at origin (since we already translated)
                ellipse(0, 0, _pu * s,  _pu * s);
                pop();
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
        
        this.draw(x, y, 1.5);

        pop();
    }

    hovered(mx, my) {
        return dist(mx, my, this.x, this.y) < _pu;
    }

    isMouseInSkewedEllipse(mx, my, x, y, w, h, skewX, skewY, stretchX, stretchY, rotation) {
        // Step 1: translate mouse to ellipse-centered space
        let dx = mx - x;
        let dy = my - y;

        // Step 2: undo rotation
        let cos = Math.cos(-rotation);
        let sin = Math.sin(-rotation);
        let rx = dx * cos - dy * sin;
        let ry = dx * sin + dy * cos;

        // Step 3: undo skew
        // forward skew was: x' = x + tan(skewX)*y,  y' = y + tan(skewY)*x
        // inverse:
        let tx = Math.tan(skewX);
        let ty = Math.tan(skewY);
        let denom = 1 - tx * ty;
        let ux = (rx - tx * ry) / denom;
        let uy = (ry - ty * rx) / denom;

        // Step 4: undo scale
        let sx = ux / stretchX;
        let sy = uy / stretchY;

        // Step 5: standard ellipse hit test
        let a = w / 2;
        let b = h / 2;
        return (sx * sx) / (a * a) + (sy * sy) / (b * b) <= 1;
        }
}