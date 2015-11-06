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
Download the repo and copy the www/js/swevans/viewport-config-X.X.js file into your project.

Include viewport-config-X.X.js in your JavaScript bundle or add it to your HTML page like this.

```html
<script type='application/javascript' src='/path/to/viewport-config-1.0.js'></script>
```
The script must be loaded prior to using it within your code. ViewportConfig follows a static interface and exists in a the "swevans" namespace, and thus does not need to be instantiated. Use the class directly to get / set viewport tag content properties:

```js
// Getting the initial-scale value
var theInitialViewportScale = swevans.ViewportConfig.initialScale;

// Setting the initial-scale value to some value
// note this will change the scale on all supporting browsers
swevans.ViewportConfig.initialScale = 5.1;

// Clearing a property by setting to null
swevans.ViewportConfig.initialScale = null;
```

Note that if no viewport tag is included in the page, one will be created when a property is set via ViewportConfig. If multiple viewport meta tags exist, the one appearing last in the document will be used by ViewportConfig.

### The API ###
ViewportConfig provides the following public interface:
```js
// NOTE: all numerical values are rounded to 4 decimal places
// NOTE: setting any property to null will remove it from the tag

// gets and sets the initial-scale property as a number
swevans.ViewportConfig.initialScale;

// gets and sets the minimum-scale property as a number
swevans.ViewportConfig.minimumScale;

// gets and sets the maximum-scale property as a number
swevans.ViewportConfig.maximumScale;

// gets and sets the user-scalable property as a boolean
// false=no, true=yes
swevans.ViewportConfig.userScalable;

// gets and sets the width property as a string
swevans.ViewportConfig.width;

// gets and sets the height property as a string
swevans.ViewportConfig.height;

// gets and sets the target-densitydpi property as a string
swevans.ViewportConfig.targetDensityDPI;

// gets the current device pixel ratio, 1 if undefined
swevans.ViewportConfig.pixelRatioScale;

// a bool indicating if the ViewportConfig tag is supported
// false means that the tag is ignored or not required
swevans.ViewportConfig.isSupported;

// A helper function to update the viewport initial scale such 
// that css pixels will match hardward pixels in 1:1 ratio.
swevans.ViewportConfig.matchDevice();
```

## Compatibility ##
- The ViewportConfig class should work in all modern browsers (IE9+). IE10+ does not support the viewport tag, but also isn't relevant / needed on desktop (where most of IE is used?), so lack of support is moot.
- The viewport tag itself may not be as widely supported, and thus ViewportConfig changes would have no effect.
- Widespread browser testing hasn't been done yet, but the simple code should run on just about anything.

## Additional Notes ##
- Note that if more than one viewport meta tag is included in the html file, the tag appearing last (closer to the end of the document) will be accessed / manipulated.
- If no viewport tag is present in the dom, one will be added when a property is set via ViewportConfig.
- ViewportConfig does not attempt to read the 'current' viewport scale. We cannot reliably do so because the user scalable, zoom properties, or scrollbar measuring method of the users web view could throw off the reading.
- Note that the viewport meta tag is not W3C standard. The future of viewport support is leaning in the direction of using '@viewport' css rules to control the viewport configuration. This CSS rule is still not widely supported. The only known implementation is in IE10.

## Recommendations ##
- Specify a single viewport meta tag at the top of your html files
- It is usually best to omit width, height, and target-densitydpi properties. 
- The Accessibility Project recommends allowing user-scalable, be sure to manage your max and min scale appropriately.
- An example ideal viewport meta tag is: <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=3.0, minimum-scale=0.1" />
- If you MUST know the current viewport scale, it is best to disallow user scaling and read the initial scale property

## Known Issues and Considerations ##
- There is a known limitation that the viewport class rounds all numerical values to four decimal places, this is to avoid issues when converting numbers to and from strings.
- The userScalable property may not behave exactly as expected. On some devices pages won't actually become scalable until they are too large to fit on the users screen, no matter what the userScalable setting is set to. They may also become scalable regardless of the userScalable setting on  some pages. These issues are mostly linked to android devices. This issue is systemic beyond this library.
- Viewport configuration might not even apply in some browsers (mostly desktop and IE10+).

## Future Changes ##
- It would be nice to support the '@viewport' CSS rules in addition to the meta tag.
- In an ideal world we could figure out the current viewport scale

## Compiling TypeScript ##
Compiling the typescript is not required to use the library. Should you decide to do so, run the compiler within the src directory. It should pickup the tsconfig.json configuration file and output to www/js/swevans/viewport-config-X.X.js.
