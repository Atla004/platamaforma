class Character {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.sprite = new Image();
        this.sprite.src = 'adventurer.png';

        // Posicion de aparicion del personaje
        this.x = 480;
        this.y = 330;

        // Tamaño del cuadro del sprite que se va a dibujar
        this.spriteWidth = 20;
        this.spriteHeight = 25;

        //Tamano del personaje
        this.characterWidth = 50;
        this.characterHeight = 50;

        // Posicion en el sprite
        this.sW = 4;
        this.sH = 8;
        this.frameX = 0;
        this.frameY = 0;

        // Velocidad en x y y
        this.dx = 0;
        this.dy = 0;
        this.onGround = true;
        this.lastDy = 0;
        this.gravity = 0.5;
        
        //sonidos del jugado
        this.moveSound = new Audio('walk.wav');
        this.moveSound.loop = true;

        this.jumpSound = new Audio('jump.wav');
        this.jumpSound.volume = 0.1;


        //Otros
        this.move = 0;  //movimiento actual
        this.frameCount = 0; // contador de frames que han pasado
        this.numFramesxAction = 0; // Numero de frames que dura cada accion
        this.numFramexSprite = 0; // Numero de frames que dura cada sprite
        this.direction = 1; // 1 derecha, -1 izquierda
        this.formerMove = 0; //movimiento anterior

        //movement boolean
        this.moveBool=false;
        this.jumpBool=false;
        this.noMoveBool=false;
    }

    //dibujo del sprite en el canvas
    draw() {
        this.ctx.save(); //guarda el estado del canvas (solo sirve si flipImageIfNecessary() se ejecuta antes de createCharacter()
        this.flipImageIfNecessary(); //cambia la direccion del sprite si va a la izquierda
        this.createCharacter(); //dibuja el sprite
        this.characterinCanvas(); //evita que se mueva si se sale del canvas
        this.characterPosicion(); //actualiza la posicion del personaje
        this.spriteAnimation(); //actualiza la animacion del sprite
        this.ctx.restore(); //restaura el estado del canvas
    }
    //cambio de direccion del sprite (cuando corre al lado izquierdo)
    flipImageIfNecessary() {
        if (this.direction === -1) {
            this.ctx.scale(-1, 1);
        }
    }

    //dibujo del sprite
    createCharacter() {
        this.ctx.drawImage(
            this.sprite,
            this.sW + this.frameX * 32,
            this.sH + this.frameY * 32,
            this.spriteWidth,
            this.spriteHeight,
            this.direction === -1 ? -this.x - this.characterWidth : this.x,
            this.y,
            this.characterWidth,
            this.characterHeight
        );
    }

    spriteAnimation(){
        if (this.onGround === false) {
            this.jumpPressed();
        } else if (this.dx>0 || this.dx<0) {
            this.sidesPressed();
        } else {
            this.noMovement();
        }
    }

    //movimiento del personaje
    sidesPressed(){
        this.frameY = 1;
        this.numFramexSprite = 6;
        this.numFramesxAction= 7;
   
        this.move=1;
        this.moveBool=true;
        this.moveSound.play();
        this.update();
  

    }
    //movimiento del personaje cuando esa quieto
    noMovement(){
        this.frameY = 0;
        this.numFramexSprite = 30;
        this.numFramesxAction = 12;
        this.move=0;
        this.noMoveBool=true;
        this.update();
    }
    //movimiento del personaje cuando salta
    jumpPressed(){
        this.frameY = 5;
        this.numFramexSprite = 10;
        this.numFramesxAction = 6;
        this.move=2;
        this.jumpBool=true;
        this.update();
    }


    update() {
        this.updateSound(); //actualiza sonidos
        this.updateFrame(); //actualiza el sprite para crear animacion   
        this.updateBool(); //actualiza booleanos a falsos para volver a empezar
    }
    updateSound(){
        if (this.moveBool===false){
            this.moveSound.pause();
        }
        if (this.jumpBool===true && this.formerOnGround===true  && this.dy<0 ){
            this.jumpSound.play();
        }
    }
    //movimiento de los frames para formar la animacion
    updateFrame() {
        
        //ver direccion del personaje
        this.setDirection();
        
        //reinicio de la animacion si cambia de movimiento
        if (this.move !== this.formerMove){
            this.frameCount = 0; 
            this.formerMove = this.move;
            this.frameX = 0;
        }
        this.frameCount += 1;
        if (this.frameCount > this.numFramexSprite) {
            this.frameCount = 0;
            this.frameX += 1 ;
            //se reinicia la animacion si llega al final
            if (this.frameX > this.numFramesxAction) {

                this.frameX = 0;
            } 
        }
    }

    updateBool(){
        this.moveBool=false;
        this.jumpBool=false;
        this.noMoveBool=false;
    }
    
    //ajusta posicion del personaje
    characterPosicion(){
        this.x += this.dx;
        this.y += this.dy;  
        this.dy += this.gravity ;
        this.formerOnGround = this.onGround;
        //onGround 
        if (this.dy === this.lastDy) {
            this.onGround = true;
        } else {
            this.lastDy = this.dy;  
            this.onGround= false;
        }

        
    };

    characterinCanvas(){
        if(this.x + this.dx > this.canvas.width-this.characterWidth|| this.x + this.dx < 0 ) {
            this.dx = 0;
        }
        if(this.y + this.dy > this.canvas.height-this.characterHeight || this.y + this.dy < this.characterHeight) {
            this.dy = 0;
        }
    }

    setDirection(){
        if(this.dx !==0)  this.dx > 0? this.direction = 1 : this.direction = -1;
    }
     
};



export {Character};