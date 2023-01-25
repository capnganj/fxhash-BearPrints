//CAPNGANJ BearPrints for fxhash
//November 2022 -> January 2023

//imports
import p5 from 'p5';
import { Features } from './features';

let skDiv //div element that is created by p5, then resized and moved around with js and css

//p5 sketch instance
const s = ( sk ) => {

  //global sketch variables
  let feet = {}
  let previewed = false

  //static variables that are set once using the iteration hash
  let numCurves

  //dynamic vars -- these get reset on screen resize
  let i
  let skWidth
  let skMarginSize, skStrokeThickness
  let minHeight, maxHeight //trig function Y VALUE multiplier -- changes with screen size
  let waveA_topAmplitude, waveA_bottomAmplitude, waveB_topAmplitude, waveB_bottomAmplitude
  

  //sketch setup
  sk.setup = () => {

    //compute window size and set key dimensions.  create canvas
    const w = computeCanvasSize()
    skWidth = w.w 
    skDiv = sk.createCanvas(w.w, w.h).elt

    //html setup
    document.body.style.backgroundColor = 'rgb(5,5,5)'
    document.body.style.display = 'flex'
    document.body.style.justifyContent = 'center'
    document.body.style.alignItems = 'center'
    document.body.style.height = window.innerHeight.toString() + 'px'

    //skDiv.style.backgroundColor = feet.background.value
    skDiv.style.display = 'flex'
    skDiv.style.justifyContent = 'center'
    skDiv.id = 'hashish'
    skDiv.style.height = w.h.toString() + 'px'
    skDiv.style.width = w.w.toString() + 'px'
    document.body.appendChild(skDiv)
    

    //new featuresClass
    feet = new Features();
   
    // FX Features
    window.$fxhashFeatures = {
      "Palette" : feet.color.inverted ? feet.color.name + " Invert" : feet.color.name,
      "Backgound" : feet.background.tag,
      "Palette Range" : feet.paletteRange.tag,
      "Direction" : feet.hand.tag,
      "Layer Count" : feet.curveCount.toString(),
      "A Waves Amplitude": feet.amplitudeSeeds.aTag,
      "B Waves Amplitude": feet.amplitudeSeeds.bTag,
      "A Waves Wavelength": feet.wavelengths.aTag,
      "B Waves Wavelength" : feet.wavelengths.bTag,
    };
    console.log("fxhashFeatures", window.$fxhashFeatures);
    //console.log("HashSmokeFeatures", feet);


    //set the background color and other sketch-level variables
    //sk.drawingContext.shadowColor = 'rgba(33,33,33,0.33)';
    //sk.drawingContext.shadowBlur = length * 0.01;
    sk.noFill();
    


    //set i to number of circles here and in resize
    numCurves = feet.curveCount;
    i = 0;
    const col = feet.background.value
    sk.background(col.r, col.g, col.b);
    //sk.strokeWeight(50)

    //set ket sketch lengths right before letting it rip
    setSketchLengths()

    
  };

  //sketch draw function 
  sk.draw = () => {

    //draw them waves
    if (i <= numCurves) {

      //colors
      const shift = feet.curveCount > 140 ? 8 : 4
      let rgb
      if (feet.color.inverted) {
        rgb = i % 2 == 0 ? 
        feet.interpolateFn(feet.map(i, 0, numCurves, feet.paletteRange.lowValue, feet.paletteRange.highValue)) : 
        feet.interpolateFn(feet.map(i+shift, 0, numCurves, feet.paletteRange.lowValue, feet.paletteRange.highValue));
      } else {
        rgb = i % 2 == 0 ? 
        feet.interpolateFn(feet.map(i, 0, numCurves, feet.paletteRange.highValue, feet.paletteRange.lowValue)) : 
        feet.interpolateFn(feet.map(i+shift, 0, numCurves, feet.paletteRange.highValue, feet.paletteRange.lowValue));
      }
      const col = sk.color(rgb.r, rgb.g, rgb.b);
      sk.stroke(col);

      //height mapped per wave
      const waveA_amplitude = feet.map(i, 0, numCurves, waveA_topAmplitude, waveA_bottomAmplitude)
      const waveB_amplitude = feet.map(i, 0, numCurves, waveB_topAmplitude, waveB_bottomAmplitude)

      //position
      sk.noFill()
      sk.beginShape()
      for (let j = 0; j < Math.PI * 2; j+=0.01) {
        
        const x = feet.hand.value ? 
          sk.map(j, 0, Math.PI * 2, -skMarginSize, skWidth+skMarginSize) : 
          sk.map(j, Math.PI * 2, 0,-skMarginSize, skWidth+skMarginSize)

        const amplitudeA = Math.sin( j * feet.map(i, 10, 100, feet.wavelengths.aTop, feet.wavelengths.aBottom) ) * waveA_amplitude
        const amplitudeB = Math.sin( (j + 5) * feet.map(i, 10, 100, feet.wavelengths.bTop, feet.wavelengths.bBottom) ) * waveB_amplitude
        const offset = feet.map(i, 0, numCurves, skMarginSize * 5, (skWidth * 1.25) - (skMarginSize * 5))

        const y = amplitudeA + amplitudeB + offset
        
        sk.vertex(x , y)   
      }
      sk.endShape()

      //draw margin rectangles
      const back = feet.background.value
      sk.noStroke()
      sk.fill(back.r, back.g, back.b)
      sk.rect(0, 0, skMarginSize, skWidth * 2)
      sk.rect(skWidth - skMarginSize, 0, skMarginSize, skWidth * 2)

      //increment
      i++
    }

    //call preview and noloop after going all the way through
    else{
      sk.noLoop();
      if( previewed == false) {
        fxpreview();
        previewed = true;
        download();
      }
    }
  };

  //handle window resize
  sk.windowResized = () => {

    i=0
    const w = computeCanvasSize()

    //set html size
    document.body.style.height = window.innerHeight.toString() + 'px'
    skDiv.style.height = w.h.toString() + 'px'
    skDiv.style.width = w.w.toString() + 'px'

    //set p5js size and call loop
    sk.resizeCanvas(w.w, w.h);
    skWidth = w.w
    const col = feet.background.value
    sk.background(col.r, col.g, col.b);

    setSketchLengths()

    sk.loop();
  };

  function computeCanvasSize() {
  
    //get the window width and height
    const ww = window.innerWidth;
    const wh = window.innerHeight;
  
    let smallEdgeSize = ((ww + wh)/2) * 0.02
  
    //return object to populate
    const ret = {}
  
    //we want to draw a portrait 5:4 rectangle with a border, as big as possible
    //does the horizontal dimension drive, or vertical
    if ( ww/wh >= 0.8 ) {
      //window is wide - let height drive
      ret.h = Math.round(wh);
      ret.w = Math.round(ret.h * 0.8 );
    } else {
      //window is tall - let width drive
      ret.w = Math.round(ww);
      ret.h = Math.round(ret.w / 0.8 );
    }
  
    //smallEdgeSize = ret.w * 0.02
    
    ret.topPadding = wh/2
    ret.margin = smallEdgeSize
  
    return ret;
  }

  function setSketchLengths() {

    //using global skWidth (which is set during seup and on screen resize), compute and set key sketch length dimensions
    
    //stroke thickness
    sk.strokeWeight(skWidth * 0.03)

    //margins
    skMarginSize = skWidth * 0.04

    //curve amplitudes - widths are set in the loop... heights have to respond to canvas height
    waveA_topAmplitude = feet.map(feet.amplitudeSeeds.aTopSeed, 0, 1, skWidth * 0.02, skWidth * 0.05)
    waveA_bottomAmplitude = feet.map(feet.amplitudeSeeds.aBottomSeed, 0, 1, skWidth * 0.01, skWidth * 0.025)

    waveB_topAmplitude = feet.map(feet.amplitudeSeeds.bTopSeed, 0, 1, skWidth * 0.05, skWidth * 0.08)
    waveB_bottomAmplitude = feet.map(feet.amplitudeSeeds.bBottomSeed, 0, 1, skWidth * 0.03, skWidth * 0.05)

  }

  function download() {
    var link = document.createElement('a');
    link.download = 'BearPrint.png';
    link.href = document.getElementById('hashish').toDataURL()
    link.click();
  }
};




//pass our sketch to p5js
let myp5 = new p5(s);