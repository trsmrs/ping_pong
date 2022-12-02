const canvasElement = document.querySelector('canvas')
canvasCtx = canvasElement.getContext('2d')


// Player Position
let playerHeight = 200
let playerWidht = 10
let playerPosX = 10
let playerPosY = 120
// ------------------

const mouse = {x: 0, y: 0}

// campo
const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        //   Desenhando o campo
        canvasCtx.fillStyle = '#286047'
        canvasCtx.fillRect(0, 0, this.w, this.h)

    }
}

// Linha do campo
const line = {
    w: 15,
    h: field.h,
    draw: function () {
        // Desenhando a linha do campo
        canvasCtx.fillStyle = '#fff'
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    }
}

// Raquete esquerda
const leftPaddle = {
    x: playerPosX,
    y: 0,
    w: line.w,
    h: 200,
    _move: function(){
        this.y = mouse.y - this.h / 2 
    },
    draw: function () {
        // player Raquete
        canvasCtx.fillStyle = '#fff'
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    }
}

// desenhar a raquete direita
const rightPaddle = {
    x: field.w - line.w - playerPosX,
    y: 100,
    w: line.w,
    h: 200,
    speed: 5,
    _move: function(){
        if(this.y + this.h / 2 < ball.y + ball.r){
            this.y += this.speed
        } else{
            this.y -= this.speed
        }
       
    },
    speedUp: function(){
        this.speed += 2
        console.log(this.speed)
        if(this.speed >= 19){
            this.speed =19

        }
    },
    draw: function () {
        // Computer Raquete
        canvasCtx.fillStyle = '#fff'
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    }
}


// Desenhar o placar
const score = {
    player: "0",
    comp: "0",
    increasePlayer: function(){
      this.player ++
    },
    increaseComputer: function(){
        this.comp ++
    },
    draw: function () {
        canvasCtx.font = 'bold 72px Arial'
        canvasCtx.textAlign = 'center'
        canvasCtx.textBaseline = 'top'
        canvasCtx.fillStyle = '#01341D'
        canvasCtx.fillText(this.player, field.w / 4, 40)
        canvasCtx.fillText(this.comp, field.w / 4 + window.innerWidth / 2, 40)
    }
}


// Desenhar a bola
const ball = {
    x: 100,
    y: 100,
    r: 20,
    speed: 5,
    dirX: 1,
    dirY: 1,
    _calcPosition: function(){
        // verifica se o jogaor 1 fez um ponto
        if(this.x > field.w -this.r - rightPaddle.w - playerPosX){
            // verifica se a jaquete direita esta na posição y da bola
            if(this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h){
                this._reverseX()
            } else{
                // pontuar o jogador
                score.increasePlayer()
                this._pointUp()
            }
        }

        // verifica se o computador fez um ponto
        if(this.x < this.r + leftPaddle.w +playerPosX){
            // verifica se a raquete esquerda está na posição y da bola
            if(this.y + this.r > leftPaddle.y && this.y -this.r < leftPaddle.y + leftPaddle.h){
                // rebate a bola invertendo o sinal de X
                this._reverseX()
            } else {
                score.increaseComputer()
                this._pointUp()
            }
        }


        if(
            (this.y - this.r < 0 && this.dirY < 0) ||
            (this.y > field.h - this.r && this.dirY > 0)
        ){
                this._reverseY()
        }
    },
    _reverseX: function(){
        this.dirX *= -1
    },
    _reverseY: function(){
        this.dirY *= -1
    },
    _speedUp: function(){
        this.speed += 3
    },
    _pointUp: function(){
        
        if(this.speed >= 20){
            this.speed = 20
        } else {this._speedUp()}


        rightPaddle.speedUp()
        this.x = field.w / 2
        this.y = field.h / 2
    },
    _move: function () {
        this.x += this.dirX * this.speed
        this.y += this.dirY * this.speed
    },
    draw: function () {
        // Desenhar a Bolinha
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()

        this._calcPosition()
        this._move()
    }
}

const setup = _ => {
    canvasElement.width = canvasCtx.width = field.w
    canvasElement.height = canvasCtx.height = field.h
}

// desenhar o campo, liha central, raquetes, e bolinha
const draw = _ => {

    field.draw()
    line.draw()

    // Desenhando as Raquetes
    leftPaddle.draw()
    rightPaddle.draw()

    //  Desenhando a bolinha
    ball.draw()

    //  Desenhando o placar
    score.draw()

}


// Controla a animação da bolinha para uma movimentação mais suave
window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkiRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup()
main()


canvasElement.addEventListener('mousemove', function(e){
    mouse.x = e.pageX
    mouse.y = e.pageY
})