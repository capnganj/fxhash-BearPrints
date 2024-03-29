import { interpolateYlOrRd, interpolateInferno, interpolateMagma, interpolatePuBuGn, interpolatePlasma, interpolateRdPu, interpolateViridis, interpolateCividis, interpolateYlGnBu, interpolateYlGn, interpolateYlOrBr } from 'd3-scale-chromatic'
import { rgb, color } from 'd3-color';


class Features {
    constructor() {

        //color palette 
        this.color = {
            name: "",
            inverted: false
        };
        this.setColorPalette();

        //background color
        this.background = {
            tag: "",
            value: ""
        }
        this.setBackground();

        //amplitude seeds - used to drive curve heights
        this.amplitudeSeeds = {
            aTopSeed: 0.0,
            aBottomSeed: 0.0,
            bTopSeed: 0.0,
            bBottomSeed: 0.0,
            aTag: "",
            bTag: ""
        }
        this.setAmplitudeSeeds();

        //wavelengs
        this.wavelengths = {
            aTop: 0.0,
            aBottom: 0.0,
            bTop: 0.0,
            bBottom: 0.0,
            aTag: "",
            bTag: ""

        }
        this.setWavelengths()

        //palette range - what part of the color scale are we using
        this.paletteRange = {
            tag: "",
            lowValue: 0.1,
            highValue: 0.9
        }
        this.setPaletteRange()
        
        //number of curves
        this.curveCount = 0
        this.setCurveCount()

        //left or right handed
        this.hand = {
            tag: "",
            value: false
        }
        this.setHand()

    }

    //map function logic from processing <3
    map(n, start1, stop1, start2, stop2) {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        return newval;
    }

    //color palette interpolation
    interpolateFn(val) {
        let col;
        switch (this.color.name) {
            case "Ylorrd": 
                col = rgb(interpolateYlOrRd(1-val));
                break
            case "Rdpu": 
                col = rgb(interpolateRdPu(1-val));
                break;
            case "Viridis": 
                col = rgb(interpolateViridis(val));
                break;
            case "Magma": 
                col = rgb(interpolateMagma(val));
                break;
            case "Inferno": 
                col = rgb(interpolateInferno(val));
                break;
            case "Plasma": 
                col = rgb(interpolatePlasma(val));
                break;
            case "Cividis": 
                col = rgb(interpolateCividis(val));
                break;
            case "Ylgn":
                col = rgb(interpolateYlGn(1-val));
                break;
            case "Ylgnbu":
                col = rgb(interpolateYlGnBu(1-val));
                break;
            case "Pubugn":
                col = rgb(interpolatePuBuGn(1-val));
                break;
            case "Ylorbr":
                col = rgb(interpolateYlOrBr(1-val));
                break;
            default:
                col = rgb(interpolateMagma(val));
        }

        if (this.color.inverted) {
            col = this.invertColor(col) 
        }

        return col;
    }

    //color inverter
    invertColor(rgb, bw) {
        let hex = color(rgb).formatHex()
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // https://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        let inverted = color("#" + padZero(r) + padZero(g) + padZero(b)).rgb();
        return inverted;

        function padZero(str, len) {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }
    }

    invertColor2(col){
        let r, g, b;
        r = 255 - col.r;
        g = 255 - col.g;
        b = 255 - col.b;

        return color(r, g, b).rgb();
    }

    //set color palette globally
    setColorPalette() {
        let c = fxrand();

        //set palette

        
        if (c < 0.07) { //1
            this.color.name = "Ylorrd"
        }
        else if (c < 0.14) { //2
            this.color.name = "Rdpu"
        }
        else if (c < 0.21) { //3
            this.color.name = "Ylgn"
        }
        else if (c < 0.28) {  //4
            this.color.name = "Pubugn"
        }
        else if (c < 0.35) { //5
            this.color.name = "Ylgnbu"
        }
        else if (c < 0.44) { //6
            this.color.name = "Viridis" 
        }
        else if (c < 0.55) {  //7
            this.color.name = "Inferno" 
        }
        else if (c < 0.66) {  //8
            this.color.name = "Plasma" 
        }
        else if (c < 0.77) {  //9
            this.color.name = "Cividis" 
        }
        else if (c < 0.88) {  //11
            this.color.name = "Ylorbr" 
        }
        //...
        else {  //11
            this.color.name = "Magma"  
        }

        //inverted?
        if( fxrand() > 0.777 ) {
            this.color.inverted = true;
        }
    }

    //set sketch background color
    setBackground() {
        let b = fxrand();
        if (b < 0.18) {
            this.background.tag = "Rolling Paper";
            this.background.value = rgb(235, 213, 179);
        }
        else if (b < 0.38) {
            this.background.tag = "fxhash Dark";
            this.background.value = rgb(38, 38, 38);
        }
        else if (b < 0.59) {
            this.background.tag = "Newspaper";
            this.background.value = rgb(245, 242, 232);
        }
        else if (b < 0.77) {
            this.background.tag = "Brown Paper Bag";
            this.background.value = rgb(181, 155, 124);
        }
        else if (b < 0.86) {
            this.background.tag = "Palette Light";
            let col = this.color.inverted ? 
            this.interpolateFn(this.map(fxrand(), 0, 1, 0.1, 0.2)) : 
            this.interpolateFn(this.map(fxrand(), 0, 1, 0.8, 0.9));
            this.background.value = col;
        }
        else {
            this.background.tag = "Palette Dark";
            let col = this.color.inverted ? 
            this.interpolateFn(this.map(fxrand(), 0, 1, 0.8, 0.9)) : 
            this.interpolateFn(this.map(fxrand(), 0, 1, 0.1, 0.2));
            this.background.value = col;
        }
    }

    //set top and bottom (a and b sets of curves) amplitude seed values
    setAmplitudeSeeds() {
        //a curves amplitudes
        this.amplitudeSeeds.aTopSeed = fxrand()
        this.amplitudeSeeds.aBottomSeed = fxrand()
        const aDiff = Math.abs(this.amplitudeSeeds.aTopSeed - this.amplitudeSeeds.aBottomSeed)
        if (aDiff < 0.35) {
            this.amplitudeSeeds.aTag = "101"
        } 
        else if (aDiff < 0.88) {
            this.amplitudeSeeds.aTag = "201"
        }
        else {
            this.amplitudeSeeds.aTag = "401"
        }

        //b curves amplitudes
        this.amplitudeSeeds.bTopSeed = fxrand()
        this.amplitudeSeeds.bBottomSeed = fxrand()
        const bDiff = Math.abs(this.amplitudeSeeds.bTopSeed - this.amplitudeSeeds.bBottomSeed)
        if (bDiff < 0.66) {
            this.amplitudeSeeds.bTag = "121"
        } 
        else if (bDiff < 0.92) {
            this.amplitudeSeeds.bTag = "212"
        }
        else {
            this.amplitudeSeeds.bTag = "323"
        }

    }

    setWavelengths() {
        //a curves wavelengths
        this.wavelengths.aTop = this.map(fxrand(), 0, 1, 1.5, 3)
        this.wavelengths.aBottom = this.map(fxrand(), 0, 1, 5, 8)
        const aSum = this.wavelengths.aTop + this.wavelengths.aBottom
        if (aSum < 7) {
            this.wavelengths.aTag = "808"
        } 
        else if (aSum < 10.5) {
            this.wavelengths.aTag = "969"
        }
        else {
            this.wavelengths.aTag = "1221"
        }

        //b curves wavelengths
        this.wavelengths.bTop = this.map(fxrand(), 0, 1, 0.5, 1.0)
        this.wavelengths.bBottom = this.map(fxrand(), 0, 1, 2.0, 3.0)
        const bSum = this.wavelengths.bTop + this.wavelengths.bBottom
        if (bSum < 2.75) {
            this.wavelengths.bTag = "3113"
        } 
        else if (bSum < 3) {
            this.wavelengths.bTag = "4224"
        }
        else {
            this.wavelengths.bTag = "5555"
        }
    }

    setHand() {
        const h = fxrand()
        if (h < 0.32) {
            this.hand.tag = "Left"
            this.hand.value = 0
            
        } else {
            this.hand.tag = "Right"
            this.hand.value = 1
        }
    }

    setCurveCount() {
        const c = fxrand()
        if (c < 0.07) {
            this.curveCount = 123
        } 
        else if (c < 0.23) {
            this.curveCount = 128
        }
        else if (c < 0.57) {
            this.curveCount = 139   
        }
        else if (c < 0.79) {
            this.curveCount = 167
        }
        else {
            this.curveCount = 180
        }
    }

    //set color palette range 
    setPaletteRange() {
        const p = fxrand()

        if (p < 0.15) {
            this.paletteRange.tag = "Lows"
            this.paletteRange.lowValue = 0.05
            this.paletteRange.highValue = 0.7
        } 
        else if ( p < 0.33 ) {
            this.paletteRange.tag = "Mids"
            this.paletteRange.lowValue = 0.25
            this.paletteRange.highValue = 0.8
        }
        else if ( p < 0.57 ) {
            this.paletteRange.tag = "Highs"
            this.paletteRange.lowValue = 0.3
            this.paletteRange.highValue = 0.95
        }
        else {
            this.paletteRange.tag = "Full Spectrum"
            this.paletteRange.lowValue = 0.1
            this.paletteRange.highValue = 0.9
        }
    }
}

export {Features}