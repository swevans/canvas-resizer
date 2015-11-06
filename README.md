# CanvasResizer #

CanvasResizer is a simple, easy-to-use JavaScript and TypeScript library to improve html canvas element behavior. The goal is to create a standalone method for managing canvas dimensions and resolution, improve canvas rendering accuracy across devices, and provide callbacks to handle canvas resizes. It accomplishes these goals in 3 ways:
<ol>
<li>Resizes the width and height properties of a canvas element so it perfectly fills the bounds of it's parent container without stretching the image.</li>
<li>Scales the canvas rendering area such that canvas pixels match device pixels. This makes canvas images appear pixely-prefectly-crisp on any device.</li>
<li>Dispatches 'resize' events on the canvas element any time it is resized.</li>
</ol>
An example is provided below to show off the capabilities.

## Why manage canvas size? ##
The canvas element behaves more like an image than any other HTML element. Simple CSS sizing will result in a stretched canvas image. To avoid stretching, the canvas element's width and height attributes must be adjusted to match the desired size. A more <a href="http://www.kirupa.com/html5/resizing_html_canvas_element.htm" target="_blank">detailed explanation is presented here, by Kuripa</a>.

The canvas element also renders using a specific logical resolution as defined by the page's viewport. By default, the logical resolution is equal to, or less than, the device resolution. On modern mobile devices, the logical resolution is usually 2 or more times lower than the physical device display resolution. To avoid aliasing and stretching, The canvas render area must be scaled up to match the device resolution. A more <a href="https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina" target="_blank">detail explanation is presented here</a>.

## Demo ##
Note that this demo might not have any effect on your desktop browser as logical to physical pixel ratios are usually 1. Follow the link below to see the demo.

<a href="http://spencer-evans.com/share/github/canvas-resizer/" target="_blank">CanvasResizer Demo</a>

## Usage ##
Download the repo and copy the www/js/swevans/canvas-resizer-X.X.js file into your project.

Include canvas-resizer-X.X.js in your JavaScript bundle or add it to your HTML page like this.

```html
<script type='application/javascript' src='/path/to/canvas-resizer-1.0.js'></script>
```
The script must be loaded prior to using it within your code.

Note that when a canvas is resized, the graphics must be redrawn. This is built into canvas behavior and make sense, but explaining why is beyond the scope of this document. You can handle this by listening for 'resize' events on your canvas element and redrawing your graphics each time it happens. 

CanvasResizer exists in the "swevans" namespace and must be instantiated with a canvas element parameter.

```js
// Grab the canvas from the DOM
var canvas = document.getElementById("myCanvas");

fuction redraw()
{
  // redraw your canvas graphics here!
}

// Watch for resize events on the canvas, redraw graphics when it happens
canvas.addEventListener("resize", redraw, false);

// Set up the resizer, note that a resize is immediately triggered and a redraw() will follow that
var canvasResizer = new swevans.CanvasResizer(canvas);
```

### The API ###
CanvasResizer provides the following public interface:
```js
/**
* Creates a new canvas resizer. A resize is immediately triggered autoResize is 
* true and a resize is needed.
* @param canvas HTMLCanvasElement; The canvas that should be resized. 
* @param highDefinition boolean (optional, default=true); Indicates 
*        if the canvas should be rendered at high definition.
* @param autoResize boolean (optional, default=true); Indicates if the 
*        canvas should resize when parent element dimensions change.
*/
var canvasResizer = new CanvasResizer(canvas, true, true);

/** number: Gets the current scale being applied to the canvas to achieve 
high definition rendering. @readonly */
canvasResizer.contentScaleFactor;

/** boolean: Gets and sets whether the canvas should be rendered at high definition. 
True by default. Triggers a resize if it changes. */
canvasResizer.highDefinition;

/** boolean: Gets and sets whether the canvas should automatically resize when 
the parent element dimension changes. True by default. */
canvasResizer.autoResize;

/** Triggers a resize check. No parameters. No return. You should call this 
function if the DOM layout changes but the window does not. A resize will 
not be triggered if the canvas does not actually need to resize. */
canvasResizer.resize();

/** Disposes of the canvas resizer by removing event listeners. 
No parameters, no return value. */
canvasResizer.dispose();
```

## Compatibility ##
- The CanvasResizer class should work in all modern browsers (IE9+).
- The CanvasResizer will have no high definition effect on browsers where pixel device ratio is 1 (mostly desktop browsers).
- Widespread browser testing hasn't been done yet, but the simple code should run on just about anything.

## Additional Notes ##
- If the canvas is not in the DOM, the CanvasResizer will have no effect.
- The canvas will always be resized to fully fill it's parent element.
- The canvas will only automatically resize if the window resizes. If your DOM layout changes and the canvas's parent dimensions change, but the window remains the same size, the canvas will NOT automatically resize. You must manually call the canvasRenderer.resize() function.
- You should dispose of the canvas resizer if you know you're done with it!

## Recommendations ##
- Specify a single viewport meta tag at the top of your html files, it should include the property initial-scale=1. EX: <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=3.0, minimum-scale=0.1" />
- Canvas sizes (width and height) must be whole numbers. When the canvas's parent element is a subpixel size (say... 800.5 by 600.5) the canvas will be 1/2 pixel too small / large. You should set the canvas style width and height to 100% to make it a perfect fit. EX: <canvas style="width: 100%; height: 100%;"></canvas>

## Known Issues and Considerations ##
- The canvas will always be resized to fully fill it's parent element.
- The canvas will only automatically resize if the window resizes. If your DOM layout changes and the canvas's parent dimensions change, but the window remains the same size, the canvas will NOT automatically resize. You must manually call the canvasRenderer.resize() function.

## Future Changes ##
- It would be nice to have the canvas be able to resize based on css styling without simply filling the parent element.
- It would be nice if the canvas could perform a resize check on any DOM layout change, not just a window resize.

## Compiling TypeScript ##
Compiling the typescript is not required to use the library. Should you decide to do so, run the compiler within the src directory. It should pickup the tsconfig.json configuration file and output to www/js/swevans/canvas-resizer-X.X.js.
