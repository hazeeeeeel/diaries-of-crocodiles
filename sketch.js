const minWidth = 800;
const minHeight = 600;

var data;

var about_content;
var pebbles = [];
var lang = "en";

const main = document.querySelector("#p5");
const title = document.querySelector("#title");
const reader_container = document.querySelector("#reader-container");
const reader = document.querySelector("#reader");
const reader_content = document.querySelector("#reader-content");
reader.style.display = "none";
const banner = document.querySelector("#banner");
const menu_title_text = document.querySelector("#menu-title-text");
const about_btn = document.querySelector("#about-btn");
const back_btn = document.querySelector("#back-btn");

const menu_title_text_en = "Diaries of Crocodiles: Lesbian Literature in Chinese";
const back_btn_en = "&lt;&lt;&nbsp;&nbsp;Back";
const about_btn_en = "About";

const menu_title_text_cn = "鳄鱼的手记：中文女同性恋文学";
const back_btn_cn = "&lt;&lt;&nbsp;&nbsp;返回";
const about_btn_cn = "关于";

let hovering = false;
let focusMode = false;
let focusIdx = -1;
let msg = [];

const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025, 2030];
const regions = ["ML", "TW", "HK"];

function preload() {
    
    data = loadJSON('data.json');        

}

function setup() {
    focusMode = false;

    let w = windowWidth > minWidth ? windowWidth : minWidth;
    let h = main.getBoundingClientRect().height > minHeight ? main.getBoundingClientRect().height : minHeight;
    createCanvas(w, h);

    works = data.works;
    about_content = data.about;
    // about = data.about;

    let banner_height = banner.getBoundingClientRect().height;
    reader_container.style.height = `calc(100% - ${banner_height}px)`;
    reader_container.style.top = `${banner_height}px`;

    reader_container.style.pointerEvents = "none";

    menu_title_text.innerHTML = lang === "en" ? menu_title_text_en : menu_title_text_cn;
    about_btn.innerHTML = lang === "en" ? about_btn_en : about_btn_cn;
    back_btn.innerHTML = lang === "en" ? back_btn_en : back_btn_cn;

    if(works && works.length > 0) {
        for (let i = 0; i < works.length; i++) {
            const p = new Pebble (i);
            pebbles.push(p);
        }
    }

}

function draw() {
    
    clear();
    background(248);

    // generate pebbles
    if (focusMode) {
        if(focusIdx >= 0) {
            pebbles[focusIdx].drawFocus();
            // loadContent(focusIdx);
        } else {
            // loadContent(focusIdx);
        } 
    } else {
        drawPebbles();
        drawCoordinates();
    }

    if (focusMode) {
        reader_container.style.pointerEvents = "auto";
    } else {
        reader_container.style.pointerEvents = "none";
    }

    // console.log(works);

    // noise effect
        // addNoiseEffect();
   
}

function addNoiseEffect() {
     // Load the pixels array.
    loadPixels();

    // Get the pixel density.
    let d = pixelDensity();

    // Calculate the halfway index in the pixels array.
    let halfImage = 4 * (d * width) * (d * height / 2);

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

    // set space
    let padding = 30;
    let tickLength = 5;
    let labelOffset = 5;

    setLineDash([]); // reset line dash

    // reset drop shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;

    // draw axes and labels
    stroke(0);
    strokeWeight(1);
    line(padding, height - padding, width - padding, height - padding); // x-axis
    line(padding, padding, padding, height - padding); // y-axis
    textSize(10);
    fill(0);

    var year_u = (width - padding * 2) / ((years.length + 1) * 5); // segment unit of 1 year
    var region_u = (height - padding * 2) / regions.length; // segment unit of 1 region
    
    for (let i = 0; i < years.length; i += 1) {
        // draw tick marks
        stroke(0);
        strokeWeight(1);
        line(padding + (i + 1) * 5 * year_u, height - padding, padding + (i + 1) * 5 * year_u, height - padding - tickLength);
        // draw labels
        noStroke();
        text(years[i],padding + (i + 1) * 5 * year_u - 10, height - 17);
    }
    
    for (let j = 0; j < regions.length; j += 1) {
        // draw tick marks
        stroke(0);
        strokeWeight(1);
        line(padding, padding + (j + 0.5) * region_u, padding + tickLength, padding + (j + 0.5) * region_u);
        // draw labels
        noStroke();
        text(regions[j], 10, padding + (j + 0.5) * region_u + 4);
    }

    // draw crosshair
    stroke(190);
    strokeWeight(1);
    setLineDash([1, 4]);
    // if (focusMode) {
    //     line(pebbles[focusIdx].x, 0, pebbles[focusIdx].x, height - 40);
    //     line(30, pebbles[focusIdx].y, width - 30, pebbles[focusIdx].y);
    // } else {
        line(mouseX, padding, mouseX, height - padding);
        line(padding, mouseY, width - padding, mouseY);
    // }

    // display mouse coordinates
    // calculate values
    let xVal = floor(((mouseX + year_u / 2 - padding) / year_u) + 1985);
    let yIdx = floor((mouseY - padding) / region_u);
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

    // // set drop shadow
    // drawingContext.shadowOffsetX = -24;
    // drawingContext.shadowOffsetY = 18;
    // drawingContext.shadowBlur = 6;
    // drawingContext.shadowColor = 'rgba(0, 0, 0, 0.04)';

    let padding = 30;
    var year_u = (width - padding * 2) / ((years.length + 1) * 5); // segment unit of 1 year
    var region_u = (height - padding * 2) / regions.length; // segment unit of 1 region

    // // if (!focusMode) {
    //     for (let i = 0; i < pebbles.length; i++) {
    //         let p = pebbles[i];
    //         let x = (works[i].pubyear - 1985) * year_u + padding;
    //         x = min(x, width - _pu - 60);
    //         x = max(x, _pu + 60);
    //         let y = (regions.indexOf(works[i].region) + 0.5) * region_u + padding + (i - 6) * 10;
    //         y = min(y, height - _pu - 60);
    //         y = max(y, _pu + 60);

    //         p.draw(x, y);
    //     }
    // // } else {
    // //     pebbles[focusIdx].draw();
    // // }

    // reset drop shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0)';

    

    // if (!focusMode) {
        for (let i = 0; i < pebbles.length; i++) {
            let p = pebbles[i];
            let x = (works[i].pubyear - 1985) * year_u + padding;
            x = min(x, width - _pu - 60);
            x = max(x, _pu + 60);
            let y = (regions.indexOf(works[i].region) + 0.5) * region_u + padding + (i - 6) * 10;
            y = min(y, height - _pu - 60);
            y = max(y, _pu + 60);

            

            p.draw(x, y);
        }
    // } else {
    //     pebbles[focusIdx].draw();
    // }
    pop();
}

function windowResized() {
    let w = windowWidth > minWidth ? windowWidth : minWidth;
    let h = main.getBoundingClientRect().height > minHeight ? main.getBoundingClientRect().height : minHeight;
    resizeCanvas(w, h);
    
    let banner_height = banner.getBoundingClientRect().height;
    reader_container.style.height = `calc(100% - ${banner_height}px)`;
    reader_container.style.top = `${banner_height}px`;
}

function mouseMoved() {
    // console.log(3);
    hovering = false;
    msg = [];
    if (!focusMode) {
        for (let p of pebbles) {
            if (p.hovered(mouseX, mouseY)) {
                hovering = true;
                // console.log("hovering");

                let font = lang === "en" ? "lector" : "zhuzi-mincho";
                let titleText = lang === "en" ? works[p.idx].title.en : works[p.idx].title.cn;
                title.innerHTML = `<p class="${font}">${titleText}</p>`;

                // drawTraces(2);
            } 
        }
        if (!hovering) {
            title.innerHTML = `<p></p>`;
        }
    } 
    
    
}

function drawTraces(n) {
    let p = new Pebble(100);
    p.draw(mouseX, mouseY, n * 0.12);
    if (n > 0) {
        drawTraces(n - 1);
    }
    
}

function handleCanvasClick() {
    console.log("canvas clicked");
    if (!focusMode) {
        for (let i = 0; i < pebbles.length; i++) {
            if (pebbles[i].hovered(mouseX, mouseY)) {
                loadContent(i);
                
                break;
            }
        }
    }
}

function loadContent(i) {

    if (i >= 0) {
        focusMode = true;
        focusIdx = i;
        
        // r_idx.innerHTML = `<p>${j}</p>`;
        
        let html = parseContent(works[i].content);
        reader_content.innerHTML = `${html}`;

        let font = lang === "en" ? "lector" : "zhuzi-mincho";
        let titleText = lang === "en" ? works[i].title.en : works[i].title.cn;
        let authorText = lang === "en" ? works[i].author.en : works[i].author.cn;
        let regionText = lang === "en" ? works[i].publoc.en : works[i].publoc.cn;
        title.innerHTML = `
            <p class="${font}">${titleText}</p>
            <p class="font-size-2 ${font}">${authorText}</p>
            <p class="font-size-2 ${font}">${regionText}, ${works[i].pubyear}</p>`;
            
        about_btn.style.display = "inline-block";
        back_btn.style.display = "inline-block";

        reader_container.style.pointerEvents = "auto";
    } 
    else if (i === -2) {
        let html = parseContent(about_content);
        reader_content.innerHTML = `${html}`;

        let font = lang === "en" ? "lector" : "zhuzi-mincho";
        let titleText = lang === "en" ? "About" : "关于";
        title.innerHTML = `<p class="${font}">${titleText}</p>`;
        
        about_btn.style.display = "none";
        back_btn.style.display = "inline-block";

        reader.style.display = "block";

        reader_container.style.pointerEvents = "auto";
    }
        
    reader.style.display = "block";

}

function parseContent(content) {
    let html = "";
    let font = lang === "en" ? "lector" : "zhuzi-mincho";

    for (let j = 0; j < content.length; j++) {
            let passage = lang === "en" ? content[j].en : content[j].cn;
            if (content[j].type === 1) {
                // just text
                html += `<p class="content-text-1 ${font}">${passage}</p>`;
            } else if (content[j].type === 2) {
                // quote
                html += `<p class="content-text-2 ${font}">"${passage}"</p>`;
            } else {
                // cite info
                html += `<p class="content-text-3 ${font}">${passage}</p>`;
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

    about_btn.style.display = "inline-block";
    back_btn.style.display = "none";

    reader_container.style.pointerEvents = "none";
}

function loadAbout() {
    console.log("load about");
    focusMode = true;
    focusIdx = -2;

    loadContent(-2);

    reader_container.style.pointerEvents = "auto";

    // console.log(about_content);
        
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function toggleLang(l) {
    if (l === "en") {
        lang = "en";
        
        loadContent(focusIdx);

        document.getElementById("toggle-cn").classList.remove("selected");
        document.getElementById("toggle-en").classList.add("selected");
        menu_title_text.innerHTML = menu_title_text_en;
        about_btn.innerHTML = about_btn_en;
        back_btn.innerHTML = back_btn_en;
    } else {
        lang = "cn";

        loadContent(focusIdx);

        document.getElementById("toggle-en").classList.remove("selected");
        document.getElementById("toggle-cn").classList.add("selected");
        menu_title_text.innerHTML = menu_title_text_cn;
        about_btn.innerHTML = about_btn_cn;
        back_btn.innerHTML = back_btn_cn;
    }
}

function handleReaderClick() {
    console.log("reader clicked");
    // focusMode = false;
    // focusIdx = -1;
}