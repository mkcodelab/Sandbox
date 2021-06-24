const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');

function setSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setSize();
window.addEventListener('resize', setSize);

const grav = 10;

let sandColArr = ['#55c200', '#c8c820', '#578840', '#2c5f20', '#668822','#77AA11'];
let blockArr = [];
let blockQuantityPerClick = 10;
let blockSize = 10;

let groundLine = 0;

class Block {
    constructor(x, y, size, col, ){
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = grav + Math.random() * 5;
        this.size = size;
        this.col = sandColArr[Math.floor(Math.random() * sandColArr.length)];
        this.top = this.y;
        this.bottom = this.y + this.size;
        this.isColliding = false;
    }
    update(){
        if (this.isColliding) {
            this.dy = 0;
        }
       
        if (this.y < canvas.height - this.size) {
            this.y += this.dy;
        }
    
        
        
    }
    draw(){
        if (this.isColliding) {
            this.dy = 0;
        }
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
    }
}

let mouse = {
    x: null,
    y: null,
    size: 5,
    tools: ['ground', 'shovel', 'plant', 'water'],
    currentTool: 'ground',
    isColliding : false,
}



window.addEventListener('mousemove', function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})
window.addEventListener('keyup', function(e){
    console.log(e.key);
    if ( e.key === '1') {
        mouse.currentTool = mouse.tools[0];
        console.log(mouse.currentTool)
        drawText('Ground Tool', 'gold');
    }
    if (e.key === '2') {
        mouse.currentTool = mouse.tools[1];
        console.log(mouse.currentTool);
        drawText('Shovel', 'gold');
        
    }
    if (e.key === '3'){
        mouse.currentTool = mouse.tools[2];
        drawText('Tree', 'limegreen');
    }
    if (e.key === '4'){
        mouse.currentTool = mouse.tools[3];
        drawText('Water', 'cyan');
    }
})

function drawBg(){
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // ctx.fillStyle = '#222';
    // let x =  mouse.x;
    // let y = mouse.y;
    // let size = 10;
    // for (let i = 0; i < 10; i++) {
    //     ctx.fillRect(i * size + x, i * size + y, size, size);

    // }
}
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2){
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}

function detectCollisions(){
    let obj1;
    let obj2;
    //reset
    for (let i = 0; i < blockArr.length; i++) {
        blockArr[i].isColliding = false;
    }

    for (let i = 0; i < blockArr.length; i++) {
        obj1 = blockArr[i];

        for (let j = i+1; j < blockArr.length; j++) {
            obj2 = blockArr[j];

            if (rectIntersect(obj1.x, obj1.y, obj1.size, obj1.size, obj2.x, obj2.y, obj2.size, obj2.size)){
                obj1.isColliding = true;
                obj2.isColliding = true;
                // console.log('colliding')
            }
        }
    }
}

// DRAWING FUNCTIONS ====!!!====!!!===!!!===!!!===!!!===

//(canvas.width / (blockSize * blockQuantityPerClick))
function drawBlocks(){
    for (let i = 0; i < blockQuantityPerClick; i++)  {
            let x = mouse.x + mouse.size * i * 3;
            let y = mouse.y * Math.random();
            let size = Math.random() * 10 + 5;
            let col = '#333';
            blockArr.push (new Block(x, y, size, col));
    }
    console.log('ground has been created!')
}
function eraseBlock(){
    
    let obj1 = mouse;
    let obj2 = handleMouseCollision();
    let index = blockArr.indexOf(obj2);
    console.log(index)
    //sprawdza czy index nie jest niezarejestrowany
    if (index != -1) {
        blockArr.splice(index, 1);
        console.log('dig it up baby!')
    }
}

let plantArr = [];

class Plant {
    constructor(x, y, col, size){
        this.x = x;
        this.y = y;
        this.col = col;
        this.size = size;

    }
    draw(){
        ctx.fillStyle = this.col;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

let waterArr = [];
let waterDroplets = 100;

let waterLevel = 5;
let waterHeight = canvas.height - waterLevel;

function handleWaterLevel() {
    waterHeight = canvas.height - waterLevel;
}
// let waterHeight = canvas.height - waterLevel;

class Water {
    constructor(x, y){
        this.size = Math.random() * 10 + 3;
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = grav;
        this.shadeOfBlue = Math.random() * 120 + 100;
    }
    draw() {
        
        let col = `rgba(120, 150, ${this.shadeOfBlue}, 0.01)`;

        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    update() {
    
        // if (this.y < canvas.height - this.size) {
            
        // }
        this.y += this.dy;
        
        this.x += this.dx;

    }
}

function waterSpray() {
    for (let i = 0; i < waterDroplets; i++){
        waterArr.push( new Water(mouse.x, mouse.y) )
    }
    
}
function handleWaterBubbles() {
   
    for (let i = 0; i < waterArr.length; i ++) {
        if (waterArr[i].y > waterHeight){
            waterArr.splice(i, 1);
        }
    }
}

function plant(color, size){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// ** {{  = = | M*ss Ocean (y) ;* | = = }} **

function drawOcean(y) {

    ctx.strokeStyle = 'rgba(100, 100, 255, 0.2)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'rgba(100, 150, 255, 0.1)';
    ctx.fillRect(0, y, canvas.width, canvas.height)
    // console.log('ocean drawed')
    
}

function handleMouseCollision() {
    let obj1 = mouse;
    for (let i = 0; i < blockArr.length; i++){
        let obj2 = blockArr[i];
        if(rectIntersect(obj1.x, obj1.y, obj1.size, obj1.size,
            obj2.x, obj2.y, obj2.size, obj2.size)){
                mouse.isColliding = true;
                // console.log('colliding');
                // console.log(obj1, obj2)
                return obj2;
            }
        else {
            mouse.isColliding = false;
        }

    }
}


function drawText(text, color, time){
    
    ctx.font = "60px Helvetica";
    ctx.fillStyle = color;
    ctx.fillText(text, canvas.width/2, canvas.height/2);
    
}
function drawEffect(x, y, radius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// MOUSE CLICK !!!===!!!===!!!===!!!
let waterPouring = false;
window.addEventListener('mousedown', function(){
    if (mouse.currentTool == 'water'){
        // waterSpray();
        waterPouring = true;
        waterLevel += 1;
        console.log('pouring water')
    }
})
window.addEventListener('mouseup', function() {
    waterPouring = false;
    console.log('pouring stopped')
})
window.addEventListener('click', function(){
    if (mouse.currentTool == 'ground'){
        drawBlocks();
        drawEffect(mouse.x, mouse.y, 120, 'rgba(100, 150, 100, 0.5)');
    
    }
    
    if (mouse.currentTool == 'shovel'){
        eraseBlock();
        drawEffect(mouse.x, mouse.y, 100, 'rgba(100, 100, 100, 0.5)')
    }
    if (mouse.currentTool == 'plant'){
        let col = 'rgba(150, 255, 55, 0.1)';
        let size = Math.random() * 20 + 2;
        plantArr.push(new Plant(mouse.x, mouse.y, col, size))
        drawEffect(mouse.x, mouse.y, 120, 'rgba(100, 255, 25, 0.3)')

    }
    // if (mouse.currentTool == 'water'){
    //     waterSpray();
    //     waterLevel += 1;
    //     console.log(waterLevel)
    // }

});

function animate() {
    drawBg();
    detectCollisions();
    // handleMouseCollision();

    //blocksy 
    for (let i = 0; i < blockArr.length; i++) {
        blockArr[i].update();
        blockArr[i].draw();
    }
        //trees
    for (let i = 0; i < plantArr.length; i++){
        plantArr[i].draw();
    }
    //water droplets
    handleWaterBubbles();
    for (let i = 0; i < waterArr.length; i++) {
        waterArr[i].draw();
        waterArr[i].update();
    }
    handleWaterLevel();
    if (waterPouring) {
        waterSpray();
        waterLevel += 0.1;
    }
    drawOcean(waterHeight);
    requestAnimationFrame(animate)
}
animate();