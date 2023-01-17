import { interpolateYlOrRd, interpolateInferno, interpolateMagma, interpolatePuBuGn, interpolatePlasma, interpolateRdPu, interpolateViridis, interpolateCividis, interpolateYlGnBu, interpolateYlGn, interpolateYlOrBr } from 'd3-scale-chromatic'
import { rgb, color } from 'd3-color';


class Features {
    constructor() {

        //color scheme 
        this.color = {
            name: "",
            inverted: false
        };
        this.setColorPalette();

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
            bBottomSeed: 0.0
        }
        this.setAmplitudeSeeds();

        //palette range - what part of the color scale are we using
        this.paletteRange = {
            tag: "",
            lowValue: 0.1,
            highValue: 0.9
        }
        this.setPaletteRange()
        
        
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
        this.amplitudeSeeds.aTopSeed = fxrand()
        this.amplitudeSeeds.aBottomSeed = fxrand()
        this.amplitudeSeeds.bTopSeed = fxrand()
        this.amplitudeSeeds.bBottomSeed = fxrand()
    }

    //set color palette range 
    setPaletteRange() {
        const p = fxrand()

        if (p < 0.15) {
            this.paletteRange.tag = "Lows"
            this.paletteRange.lowValue = 0.05
            this.paletteRange.highValue = 0.6
        } 
        else if ( p < 0.33 ) {
            this.paletteRange.tag = "Mids"
            this.paletteRange.lowValue = 0.35
            this.paletteRange.highValue = 0.66
        }
        else if ( p < 0.57 ) {
            this.paletteRange.tag = "Highs"
            this.paletteRange.lowValue = 0.4
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