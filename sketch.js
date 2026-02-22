const minWidth = 800;
const minHeight = 600;

var works_en;
var works_cn;
var about_en;
var about_cn;
var works;
var about_content;
// var readers;
var pebbles = [];
var lang = "en";

const main = document.querySelector("#p5");
const title = document.querySelector("#title");
const reader = document.querySelector("#reader");
const reader_content = document.querySelector("#reader-content");
reader.style.display = "none";
const r_idx = document.querySelector("#reader-idx");
const home = document.querySelector("#home");
const about = document.querySelector("#about");
const backhome = document.querySelector("#backhome");

let hovering = false;
let focusMode = false;
let focusIdx = -1;
let msg = [];

const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025, 2030];
var year_u = 10;
const regions = ["ML", "TW", "HK"];
var region_u = 10;

function preload() {
    
        fetchJSONData();        

}

function fetchJSONData() {
    // fetch book info 
    fetch('data.json')
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // The .json() method automatically parses the JSON response into a JS object
        return response.json(); 
    })
    .then(jsonData => {
        // console.log(jsonData); // Use the parsed JavaScript object
        works_en = jsonData.works.en;
        works_cn = jsonData.works.cn;
        about_en = jsonData.about.en;
        about_cn = jsonData.about.cn;
        console.log(works_en);
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

}

function setup() {
    focusMode = false;

    let w = windowWidth > minWidth ? windowWidth : minWidth;
    let h = windowHeight > minHeight ? windowHeight - 60 : minHeight - 60;
    createCanvas(w, h);
    
    year_u = (width - 60) / (years.length);
    region_u = (height - 260) / (regions.length - 1);

    // handle language settings and source of text content initially
    if (lang === "en") {
        works = works_en;
        about_content = about_en;
    } else {
        works = works_cn;
        about_content = about_cn;
    }

    // create pebbles
    if(works && works.length > 0) {
        for (let i = 0; i < works.length; i++) {
            // const p = new Pebble((works[i].pubyear - 1985) * year_u + 80, regions.indexOf(works[i].publoc) * region_u + 60);
            let x = (works[i].pubyear - 1985) * year_u / 5 + 80;
            x = min(x, width - _pu - 60);
            x = max(x, _pu + 60);
            let y = regions.indexOf(works[i].region) * region_u + 120 + random(-120, 120);
            y = min(y, height - _pu - 60);
            y = max(y, _pu + 60);

            // const p = new Pebble (x, y, works[i].title, i);
            const p = new Pebble (works[i].title, i);
            pebbles.push(p);
        }
    }
}

function draw() {
    if (!works_en) return; // wait until data is loaded
    clear();
    background(248);

    // draw pebbles
    if (focusMode) {
        if(focusIdx >= 0) {
            pebbles[focusIdx].drawFocus();
        } else {
        } 
    } else {
        drawPebbles();
        drawCoordinates();
    }

    
    // console.log(works);

    
    // Show dynamic title when hovering over pebbles on home page
    // Show static title information on the left upper corner when focusing on a specific work/pebble
    if (focusMode) {
        if (focusIdx >= 0) {
            title.innerHTML = `
            <p>${works[focusIdx].title}</p>
            <p class="detail">${works[focusIdx].author}</p>
            <p class="detail">${works[focusIdx].publoc}, ${works[focusIdx].pubyear}</p>
            <p class="detail">region: ${works[focusIdx].region}</p>`;
        } else {
            title.innerHTML = `<p>About</p>`;
        }
    } else if (hovering) {
        title.innerHTML = `<p>${msg.join("<br>")}</p>`;
    } else {
        title.innerHTML = `<p></p>`;
    }



    // Noise effect on the background
        
    // Load the pixels array.
    loadPixels();

    // Get the pixel density.
    let d = pixelDensity();

    // Noise Effect.
    for (let i = 0; i < pixels.length - 1; i += 11) {
        
        let x = i % (width);
        let y = floor(i / (height));

        let r1 = random(1);
        let r2 = random(1);
        let shift = round(random(-1.49, 1.49)) * 4 * (width);
        // if (r > 0.95) {
        //     pixels[i] += shift;
        // } else if (r > 0.6) {
        //     let displace = round(random(-6, 6));
        //     pixels[i] = pixels[i + displace];
        // }
        if (r1 > 0.9) {
            pixels[i] += shift;
        }

        if (r1 > 0.99) {
            pixels[i] += shift * 2;
        }
            
            let displace = round(random(-4, 4));
            // pixels[i] = pixels[i + displace];

        if (r2 > 0.98) {
            let u = 6;
            if (x < width - u){
                for (let m = 0; m < u; m++) {
                    pixels[i + m] = pixels[i + displace + m];
                }

                if (y < height - u) {
                    for (let j = 0; j < u; j++) {
                        for (let k = 0; k < u; k++) {
                            pixels[i + width * j + k] = pixels[i + width * j + k + displace];
                        }
                    }
                }
            }
            
            if (x < width - 1 && y < height - 1) {
                pixels[i + width + 1] += shift;
            }
        }
        
    }

    // Update the canvas.
    updatePixels();
}

function drawCoordinates() {
    push();

    setLineDash([]); // reset line dash

    // reset drop shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;

    // draw axes and labels
    stroke(0);
    strokeWeight(1);
    line(30, height - 40, width - 30, height - 40); // x-axis
    line(30, 0, 30, height - 40); // y-axis
    textSize(8);
    fill(0);
    
    for (let i = 0; i < years.length; i += 1) {
        // draw tick marks
        stroke(0);
        strokeWeight(1);
        line(80 + i * year_u, height - 40, 80 + i * year_u, height - 35);
        // draw labels
        noStroke();
        text(years[i], 80 + i * year_u - 9, height - 20);
    }
    
    for (let j = 0; j < regions.length; j += 1) {
        // draw tick marks
        stroke(0);
        strokeWeight(1);
        line(30, j * region_u + 120, 35, j * region_u + 120);
        // draw labels
        noStroke();
        text(regions[j], 10, j * region_u + 124);
    }

    // draw crosshair
    stroke(190);
    strokeWeight(1);
    setLineDash([1, 4]);
    // if (focusMode) {
    //     line(pebbles[focusIdx].x, 0, pebbles[focusIdx].x, height - 40);
    //     line(30, pebbles[focusIdx].y, width - 30, pebbles[focusIdx].y);
    // } else {
        line(mouseX, 0, mouseX, height - 40);
        line(30, mouseY, width - 30, mouseY);
    // }

    // display mouse coordinates
    // calculate values
    let xVal = floor(((mouseX - 30) / year_u) * 5 + 1988);
    let yIdx = Math.round((mouseY - 120) / region_u);
    if (yIdx < 0) yIdx = 0;
    if (yIdx >= regions.length) yIdx = regions.length - 1;
    let yVal = regions[yIdx];
    fill(0);
    noStroke();
    // if (focusMode) {
    //     text(`(${works[focusIdx].pubyear}, ${works[focusIdx].region})`, pebbles[focusIdx].x + 10, pebbles[focusIdx].y - 10);
    // } else {
        text(`(${xVal}, ${yVal})`, mouseX + 10, mouseY - 10);
    // }
    
    pop();
}

function drawPebbles() {
    push();

    setLineDash([]); // reset line dash

    // set drop shadow
    drawingContext.shadowOffsetX = -24;
    drawingContext.shadowOffsetY = 18;
    drawingContext.shadowBlur = 6;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.04)';

    let r = 10;
    let g = 10;
    let b = 10;

    // if (!focusMode) {
        for (let i = 0; i < pebbles.length; i++) {
            // calculate pebble position based on publication year and region
            let p = pebbles[i];
            let x = (works[i].pubyear - 1985) * year_u / 5 + 80;
            x = min(x, width - _pu - 60);
            x = max(x, _pu + 60);
            let y = regions.indexOf(works[i].region) * region_u + 120 + i * 20 - 40;
            y = min(y, height - _pu - 60);
            y = max(y, _pu + 60);

            p.draw(x, y);
        }

    // reset drop shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0)';

    // draw pebbles on top again to hide shadows that overlap with the shapes
    for (let i = 0; i < pebbles.length; i++) {
        let p = pebbles[i];
        let x = (works[i].pubyear - 1985) * year_u / 5 + 80;
        x = min(x, width - _pu - 60);
        x = max(x, _pu + 60);
        let y = regions.indexOf(works[i].region) * region_u + 120 + i * 20 - 40;
        y = min(y, height - _pu - 60);
        y = max(y, _pu + 60);

        p.draw(x, y);
    }
   
    pop();
}

function windowResized() {
    let w = windowWidth > minWidth ? windowWidth : minWidth;
    let h = windowHeight > minHeight ? windowHeight - 60 : minHeight - 60;
    resizeCanvas(w, h);
}

// track mouse movement to determine 
// if hovering over pebbles and display corresponding title information
function mouseMoved() {
    // console.log(3);
    hovering = false;
    msg = [];
    if (!focusMode) {
        for (let p of pebbles) {
            if (p.hovered(mouseX, mouseY)) {
                fill("#82ffa3");
                noStroke();
                ellipse(mouseX, mouseY, 10, 10);

                hovering = true;
                msg.push(p.t);
            } else {
                hovering = hovering || false;
            }
        }
    }
}

// track mouse click to determine 
// if clicking on pebbles and load corresponding content in the reader
function handleCanvasClick() {
    if (!focusMode) {
        for (let i = 0; i < pebbles.length; i++) {
            if (pebbles[i].hovered(mouseX, mouseY)) {
                loadContent(i);
            }
        }
    }
}

function loadContent(i) {
    reader.style.display = "block";

    if (i >= 0) {
        focusMode = true;
        focusIdx = i;
        
        // r_idx.innerHTML = `<p>${j}</p>`;
        
        let html = parseContent(works[i].content);
        reader_content.innerHTML = `${html}`;

        let font = lang === "en" ? "lector" : "zhuzi-mincho";

        title.innerHTML = `
        <p class="${font}">${works[focusIdx].title}</p>
        <p class="detail ${font}">${works[focusIdx].author}</p>
        <p class="detail ${font}">${works[focusIdx].publoc}, ${works[focusIdx].pubyear}</p>
        <p class="detail ${font}">region: ${works[focusIdx].region}</p>`;
            

        about.style.display = "inline-block";
        backhome.style.display = "inline-block";
    } else {
        // console.log(about_content);
        let html = parseContent(about_content);
        reader_content.innerHTML = `${html}`;

        title.innerHTML = `<p>About</p>`;
        
        about.style.display = "none";
        backhome.style.display = "inline-block";
    }
}

// helper function to parse text content with different types
// return corresponding HTML that adds different styles/classes
function parseContent(content) {
    let html = "";
    let font = lang === "en" ? "lector" : "zhuzi-mincho";
    for (let j = 0; j < content.length; j++) {
            let passage = content[j];
            if (passage.type === 1) {
                // just text
                html += `<p class="content-text-1 ${font}">${passage.text}</p>`;
            } else if (passage.type === 2) {
                // quote
                html += `<p class="content-text-2 ${font}">${passage.text}</p>`;
            } else {
                // cite info
                html += `<p class="content-text-3 ${font}">${passage.text}</p>`;
            }
        }
    return html;
}

function loadHome() {
    focusMode = false;
    focusIdx = -1;

    reader.style.display = "none";
    reader_content.innerHTML = "";
    console.log("home");

    about.style.display = "inline-block";
    backhome.style.display = "none";
}

function loadAbout() {
    focusMode = true;
    focusIdx = -1;

    loadContent(-1);
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function toggleLang(l) {
    if (l === "en") {
        lang = "en";
        works = works_en;
        about_content = about_en;
        loadContent(focusIdx);
    } else {
        lang = "cn";
        works = works_cn;
        about_content = about_cn;
        loadContent(focusIdx);
    }
}