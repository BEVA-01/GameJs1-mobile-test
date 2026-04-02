const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;
const backgroundCanvas = document.getElementById("backgroundCanvas")
const backgroundCtx = backgroundCanvas.getContext("2d");
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
const layer1 = new Image();
layer1.src = "Background.png"

let score = 0;
let live=3
ctx.textBaseline = "top";

let timeToNextRaven = 0;
let ravenInterval = 1500;
let lastTime = 0;
const gameSpeed = 6;
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.font = `${Math.max(28, canvas.width * 0.04)}px Impact`;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

alert("Etes vous prêt(e)? Si oui, cliquez sur le bouton de confirmation.")



const isMobile = window.innerWidth < 768;


backgroundCtx.imageSmoothingEnabled = false;
class Layer {
    constructor(image) {
        this.image = image;
        this.x = 0;
        this.y = 0;
        this.speed = gameSpeed * 0.6;

        this.resize();
    }

    resize() {
        const imageRatio = this.image.width / this.image.height;
        const canvasRatio = backgroundCanvas.width / backgroundCanvas.height;

        if (canvasRatio > imageRatio) {
            // écran plus large que l'image → on ajuste à la largeur
            this.width = backgroundCanvas.width;
            this.height = this.width / imageRatio;
        } else {
            // écran plus haut/étroit → on ajuste à la hauteur
            this.height = backgroundCanvas.height;
            this.width = this.height * imageRatio;
        }

        this.x = 0;
        this.x2 = this.width;

        // centre vertical si l'image dépasse en hauteur
        this.y = (backgroundCanvas.height - this.height) / 2;
    }

    update() {
        this.x -= this.speed;
        this.x2 -= this.speed;

        if (this.x <= -this.width) {
            this.x = this.x2 + this.width;
        }

        if (this.x2 <= -this.width) {
            this.x2 = this.x + this.width;
        }
    }

    draw() {
        backgroundCtx.drawImage(
            this.image,
            Math.floor(this.x),
            this.y,
            this.width + 2,
            this.height
        );

        backgroundCtx.drawImage(
            this.image,
            Math.floor(this.x2) - 2,
            this.y,
            this.width + 2,
            this.height
        );
    }
}




class Music {
    constructor(sound){
    this.audio = new Audio;
    this.audio.src = `${sound}`;
    this.canPlay = true;
    }

}
const gameOverSound = new Music("Gameover.wav")
const musicPlaying = new Music("music.wav")











let ravens = [];
class Raven{
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        if (isMobile) {
             this.sizeModifier = Math.random() * 0.3 + 0.2; // plus petits sur mobile
        } else {
            this.sizeModifier = Math.random() * 0.6 + 0.4; // taille normale PC
        };
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height- this.height);
        if (isMobile) {
             this.directionX = this.directionX = canvas.width / 300 + Math.max(0, score - 4) * 5 ;
        } else {
            this.directionX = this.directionX = canvas.width / 300 + Math.max(0, score - 4) * 0.3 ;
        };
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false
        this.image= new Image();
        this.image.src = "raven.png"
        // this.frame = 0 NOTE:Tout ceci est l'ancienne version codé en dur pour le changement de frame de l'image, cette partie est remplacée par toute la section deltaTime
        // this.imageframe = 9 NOTE:Tout ceci est l'ancienne version codé en dur pour le changement de frame de l'image, cette partie est remplacée par toute la section deltaTime
        // this.nextImage = 0 NOTE:Tout ceci est l'ancienne version codé en dur pour le changement de frame de l'image, cette partie est remplacée par toute la section deltaTime
        this.frame = 0;
        this.maxFrame = 4
        this.timeSinceFlap = 0;//this.timeSinceFlap et this.flapInterval vont être utilisé avec deltaTime pour créer les fps et s'adapter à chaque ordinateur, si ordi rapide valeur par frame de delta rapide, si ordi lent valeur de deltaTime lente donc avec ça les deux machines lirons le code à la même vitesse 
        this.flapInterval = 70;
        this.randomColors= [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`
    }
    update(deltaTime){
        // this.frame++ NOTE:Tout ceci est l'ancienne version codé en dur pour le changement de frame de l'image, cette partie est remplacée par toute la section deltaTime
        // if(this.frame % this.imageframe === 0) this.nextImage++; NOTE:Tout ceci est l'ancienne version codé en dur pour le changement de frame de l'image, cette partie est remplacée par toute la section deltaTime
        // if(this.nextImage > 5) this.nextImage=0; NOTE:Tout ceci est l'ancienne version codé en dur pour le changement de frame de l'image, cette partie est remplacée par toute la section deltaTime
        if(this.y<0 || this.y > canvas.height - this.height){ //si le corbeau sort de l'écran de manière verticale alors, le code ci dessous se lance
            this.directionY = this.directionY * -1 // si c'est déjà un chiffre négatif alors moins x moins = + donc ça remonte et si c'est un nombre positif plus x moins = - donc ça descend ce qui permet de constamment inverser les valeur et -1 permet de les modifier sans toucher aux chiffres d'origines juste on change postif et négatif
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
            live--;
            console.log(live);
        }
        this.timeSinceFlap += deltaTime;
        if(this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame) this.frame=0;
            else this.frame++;
            this.timeSinceFlap = 0
        }

        // console.log(deltaTime)
    }
    draw(){
        collisionCtx.fillStyle = this.color;//va colorer les valeurs de fillRect()
        collisionCtx.fillRect(this.x, this.y, this.width, this.height)
        // ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
        //ctx.drawImage(this.image, this.frame * this.spriteWidth,0, this.spriteWidth, this.spriteHeight,this.x, this.y, this.width, this.height);
    }
}

const raven = new Raven();








let explosions= [];
class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = "boom.png";
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.audio = new Audio;
        this.audio.src= "impact.wav";
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false
    }
    update(deltaTime){
        if (this.frame === 0) this.audio.play();
        this.timeSinceLastFrame += deltaTime;
        if(this.timeSinceLastFrame> this.frameInterval){
            this.frame ++;
            this.timeSinceLastFrame=0
            if (this.frame > 5) this.markedForDeletion = true
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size)
    }
}








function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 20, 20);
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 24, 24);
}






    function drawLives() {
    const text = live > 1 ? `Vies: ${live}` : `Dernière Vie: ${live}`;
    const x = canvas.width * 0.72;

    ctx.fillStyle = "black";
    ctx.fillText(text, x, 20);
    ctx.fillStyle = "white";
    ctx.fillText(text, x + 4, 24);
}



function gameOver() {
    ctx.textAlign = "center";

    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", canvas.width / 2 + 5, canvas.height / 2 + 5);

    ctx.textAlign = "left";
}




function handleHit(x, y) {
    const rect = canvas.getBoundingClientRect();

    const scaleX = collisionCanvas.width / rect.width;
    const scaleY = collisionCanvas.height / rect.height;

    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;

    const detectPixelColor = collisionCtx.getImageData(canvasX, canvasY, 1, 1);
    const pc = detectPixelColor.data;

    ravens.forEach(object => {
        if (
            object.randomColors[0] === pc[0] &&
            object.randomColors[1] === pc[1] &&
            object.randomColors[2] === pc[2]
        ) {
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));

            if (score > 5) {
                ravenInterval -= 30;
            }

            if (ravenInterval < 450) ravenInterval = 450;
        }
    });
}

window.addEventListener("click", function(e) {
    handleHit(e.clientX, e.clientY);
});

window.addEventListener("touchstart", function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    handleHit(touch.clientX, touch.clientY);
}, { passive: false });


let gameOverPlayed = false;
let background ;

function musicWhilePlaying(object1, object2){
    if(object1.canPlay) object1.audio.play();
    else{object2.audio.play()}
}


function startMusic() {
    musicPlaying.audio.loop = true;
    musicPlaying.audio.play();
}

window.addEventListener("click", startMusic, { once: true });
window.addEventListener("touchstart", startMusic, { once: true, passive: true });

layer1.onload = function(){
 background = new Layer(layer1);
function animate(timestamp = 0){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    background.draw()
    background.update()
    collisionCtx.clearRect(0,0, collisionCanvas.width, collisionCanvas.height)
    // console.log("test")
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a,b){//.sort va attendre que tu compares deux éléments va regarder le resultat de la fonction, le return et le lire et va échanger les places ou non
        //    console.log(a.width - b.width)
            return a.width - b.width; //permet de trier du plus petit au plus grand, si a.width < b.width le resultat est négatif a.width pass avant si a.width>b.width b.width passe avant a
        })
        // console.log(ravens)
    }
    drawScore();
    // console.log(deltaTime)
    [...ravens, ...explosions].forEach(object => object.update(deltaTime));// [...ravens] crée une copie temporaire du tableau pour éviter les bugs si le tableau original est modifié pendant la boucle, la copie est supprimé après la fin de la fonction et re créer sur l'originale à chaque appel
    [...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion)
    explosions = explosions.filter(object => !object.markedForDeletion)
    drawLives();
    if(live <= 0){
        gameOver();

        if(!gameOverPlayed){
            musicPlaying.audio.pause();
            musicPlaying.audio.currentTime = 0;

            gameOverSound.audio.play();
            gameOverPlayed = true;
        }

    return;
}
    // console.log(ravens)
    requestAnimationFrame(animate)//après l'appelle de cette fonction le navigateur injecte automatique une valeur dans timestamps et c'est le temps écoulé depuis que la page est chargée
}


animate()
}