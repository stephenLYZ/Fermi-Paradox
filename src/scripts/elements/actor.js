export class Actor {
  constructor(x, y, width, height, cx, canvasHeight, canvasWidth, pitch) {
    this.cx = cx;
    this.coords = {
      x: x,
      y: y
    };
    this.width = width;
    this.height = height;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.pitch = pitch;
    this.count = 2;
  }

  updateRatio(data) {
    if( this.canvasHeight < data.height && this.canvasHeight < data.width ||
      this.canvasWidth < data.width && this.width){
      var ratio = (data.width * data.height) /
      (this.canvasWidth * this.canvasHeight);
      this.width = this.width / ratio;
      this.height = this.height / ratio;
    }
  }

  update(){
    // handler for any update changes
  }

  move(orientation) {
    if(!this.maxValueX){
      this.maxValueX = Math.max(window.innerHeight, window.innerWidth) - 10 - Math.min(this.height, this.width);
    }
    if(!this.maxValueY){
      this.maxValueY =  Math.max(window.screen.height, window.screen.width) - 10 - Math.min(this.height, this.width) ;
    }
    this._height = this.height;
    this._width = this.width;
    if (orientation === 'x') {
      this.coords.x = this.coords.y;

      if (this.pitch === 'left'){
        this.coords.y = 70;
      } else {
        this.coords.y =  this.maxValueX - 70;
      }
      if (this.width < this.height) {
        this.height = this._width;
        this.width = this._height;
      }

    } else {

      this.coords.y = this.coords.x;
      if (this.pitch === 'left'){
        this.coords.x = 70;
      } else {
        this.coords.x =  this.maxValueY - 70;
      }
      if (this.width > this.height) {
        this.height = this._width;
        this.width = this._height;
      }

    }
  }

  draw() {
    if (this.pitch === 'right'){
      this.cx.save();
      this.cx.beginPath();
      this.cx.fillStyle = "#ffff00";
      this.el = this.cx.fillRect(this.coords.x, this.coords.y, this.width, this.height);
      var img = new Image();
      img.src = "../images/guy.png";
      this.cx.drawImage(img,this.coords.x, this.coords.y ,90,80);
      this.cx.closePath();
      this.cx.restore();
    }else{
      this.cx.save();
      this.cx.beginPath();
      this.cx.fillStyle = "#ffff00";
      this.el = this.cx.fillRect(this.coords.x, this.coords.y, this.width, this.height);
      var img = new Image();
      img.src = "../images/guy-rotate.png";
      this.cx.drawImage(img,this.coords.x, this.coords.y - 70 ,90,80);
      this.cx.closePath();
      this.cx.restore();
    }

  }
}
