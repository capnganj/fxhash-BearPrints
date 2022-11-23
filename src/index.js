//CAPNGANJ BearPrints for #fxhashturnsone
//November, 2022

//imports
import p5 from 'p5';
import { Features } from './features';

//p5 sketch instance
const s = ( sk ) => {

  //global sketch variables
  let feet = {};
  let previewed = false;

  //iteration vars -- these get reset on screen resize
  let i;
  let length;
  let numCurves;
  let min, max, minHeight, maxHeight

  //sketch setup
  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    
    //new featuresClass
    feet = new Features();
   
    // FX Features
    window.$fxhashFeatures = {
      "Palette" : feet.color.inverted ? feet.color.name + " Invert" : feet.color.name,
    };
    console.log("fxhashFeatures", window.$fxhashFeatures);
    //console.log("HashSmokeFeatures", feet);

    min = feet.map(fxrand(), 0, 1, 2, 4)
    max = feet.map(fxrand(), 0, 1, 7, 9)
    minHeight = feet.map(fxrand(), 0, 1, 15, 45)
    maxHeight = feet.map(fxrand(), 0, 1, 10, 25)

    //calculate length
    calcLength();

    //set the background color and other sketch-level variables
    //sk.drawingContext.shadowColor = 'rgba(33,33,33,0.33)';
    //sk.drawingContext.shadowBlur = length * 0.01;
    sk.noFill();
    


    //set i to number of circles here and in resize
    numCurves = 90;
    i = 15;
    sk.background(235, 213, 179);
    sk.strokeWeight(50)
    
  };

  


  //sketch draw function 
  sk.draw = () => {

    //draw them waves
    if (i <= numCurves) {

      //shadow
      //sk.drawingContext.shadowBlur = length * feet.map(i, 0, 100, 0.0005, 0.05);
      
      //position

      //colors
      let rgb = i % 2 == 0 ? feet.interpolateFn(feet.map(i, 0, numCurves, 0, 1)) : feet.interpolateFn(feet.map(i+4, 0, numCurves, 0, 1));
      let col = sk.color(rgb.r, rgb.g, rgb.b);
      sk.stroke(col);

      //height mapped per wave
      const height = feet.map(i, 0, numCurves, minHeight, maxHeight)

      //position
      sk.beginShape()
      for (let j = 0; j < Math.PI * 2; j+=0.01) {
        let x = sk.map(j, 0, Math.PI * 2, 100, sk.windowWidth-100)
        let y = (Math.sin(j * feet.map(i, 0, 100, min, max)) * height) + i * 8
        sk.vertex(x , y)   
      }
      sk.endShape()

      //increment
      i++
    }

    //call preview and noloop after going all the way through
    else{
      sk.noLoop();
      if( previewed == false) {
        fxpreview();
        previewed = true;
        //download();
      }
    }
  };

  

  //handle window resize
  sk.windowResized = () => {
    i=0;
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    calcLength();
    //sk.drawingContext.shadowBlur = length * 0.01;
    sk.background(235, 213, 179);
    sk.loop();
  };


  function calcLength() {

    if( sk.windowWidth <= sk.windowHeight ) {
      length = Math.sqrt(Math.pow(sk.windowWidth * 0.85, 2) + Math.pow(sk.windowWidth * 0.85 * 0.618, 2));
    }
    else {
      length = Math.sqrt(Math.pow(sk.windowHeight * 0.9 * 0.618, 2) + Math.pow(sk.windowHeight * 0.85, 2))
    }
  }

  function download() {
    var link = document.createElement('a');
    link.download = 'BearPrint.png';
    link.href = document.getElementById('defaultCanvas0').toDataURL()
    link.click();
  }
};




//pass our sketch to p5js
let myp5 = new p5(s);