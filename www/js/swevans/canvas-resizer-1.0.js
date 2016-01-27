/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2004 Spencer Evans, NAUT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @version     1.0
 * @copyright   Copyright © 2015 Spencer Evans
 * @author		Spencer Evans	evans.spencer@gmail.com
 * @license     http://opensource.org/licenses/MIT
 * @website     http://spencer-evans.com/
 */
var swevans;
(function (swevans) {
    /**
     * A helper class for to dynamically resize canvas elements to fill parent bounds and
     * resize the canvas pixels to match device pixels.
     *
     * Resizing Behavior:
     * 	- The CanvasResizer class updates the width and height properties of a canvas to
     *		match dimensions of the parent container.
     *  - If autoSize is set to true (it is by default), then the CanvasResizer will automatically
     *		resize the canvas to fit the bounds of it's parent container. A resize check is
     *		triggered any time the window resizes.
     *
     * High Definition Behavior:
     *  - The CanvasResizer will attempt to render canvas graphics in 'high definition' if the
     *		highDefinition flag is set to true (it is by default).
     *  - High Definition rendering (as it is defined here :) means that the canvas is resized
     *		such that each canvas pixel will match the size of a single device pixel.
     *	- As an example.. if the canvas is running on an iPad 3, the logical webpage resolution
     *		will be 1024x768, but the actual device resolution is 2048x1536. This results in
     *		each canvas pixel taking up 4 (2x2) device pixels. This will lead to blurry strokes.
     *		CanvasResizer high def rendering reconciles this by enlarging the canvas to twice the
     *		desired size then scales the graphics up to match. This creates clean, sharp strokes.
     *
     * RECOMMENDATIONS:
     *	- Specify a single viewport meta tag at the top of your html files, it should include
     *		the property initial-scale=1. EX:
     *		<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=3.0, minimum-scale=0.1" />
     *	- Canvas sizes (width and height) must be whole numbers. When the canvas's parent element
     *		is a subpixel size (say... 800.5 by 600.5) the canvas will be 1/2 pixel too small / large.
     *		You should set the canvas style width and height to 100% to make it a perfect fit. EX:
     *		<canvas style="width: 100%; height: 100%;"></canvas>
     *
     * BROWSWER SUPPORT:
     * 	- The CanvasResizer class should work in all modern browsers (IE9+).
     *
     * FUTURE CHANGES:
     *	- It would be nice to have the canvas be able to resize based on css styling without
     *		simply filling the parent element.
     */
    var CanvasResizer = (function () {
        //}
        //{ Constructor
        /**
         * Creates a new canvas resizer. A resize is immediately triggered autoResize is true and a resize is needed.
         * @param canvas HTMLCanvasElement; The canvas that should be resized.
         * @param highDefinition boolean (optional, default=true); Indicates if the canvas should be rendered at high definition.
         * @param autoResize boolean (optional, default=true); Indicates if the canvas should resize when parent element dimensions change.
         */
        function CanvasResizer(canvas, highDefinition, autoResize) {
            if (highDefinition === void 0) { highDefinition = true; }
            if (autoResize === void 0) { autoResize = true; }
            /** @private The current width of the canvas. */
            this._width = undefined;
            /** @private The current height of the canvas. */
            this._height = undefined;
            /** @private Indicates if the canvas resizer is disposed. */
            this._isDisposed = false;
            /** @private The current scale being applied to the canvas to achieve high definition rendering. */
            this._contentScaleFactor = 1;
            /** @private Indicates if the canvas should be rendered at high definition. */
            this._highDefinition = true;
            /** @private Indicates if the canvas should automatically resize when the parent element dimension changes. */
            this._autoResize = true;
            // store params
            this._canvas = canvas;
            this._highDefinition = highDefinition;
            this._autoResize = autoResize;
            // bind event handlers
            this.window_resize = this.window_resize.bind(this);
            // listen for events
            window.addEventListener("resize", this.window_resize, false);
            // do an initial resize
            if (this._autoResize)
                this.resize();
        }
        Object.defineProperty(CanvasResizer.prototype, "contentScaleFactor", {
            /** number: Gets the current scale being applied to the canvas to achieve high definition rendering. */
            get: function () { return this._contentScaleFactor; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasResizer.prototype, "highDefinition", {
            /** boolean: Gets whether the canvas should be rendered at high definition. True by default. */
            get: function () { return this._highDefinition; },
            /** boolean: Sets whether the canvas should be rendered at high definition. True by default. */
            set: function (value) { if (this._highDefinition === value) {
                return;
            } this._highDefinition = value; this.resize(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasResizer.prototype, "autoResize", {
            /** boolean: Gets whether the canvas should automatically resize when the parent element dimension changes. True by default. */
            get: function () { return this._autoResize; },
            /** boolean: Sets whether the canvas should automatically resize when the parent element dimension changes. True by default. */
            set: function (value) { if (this._autoResize === value) {
                return;
            } this._autoResize = value; this.resize(); },
            enumerable: true,
            configurable: true
        });
        /**
         * Disposes of the canvas resizer by removing event listeners. No parameters, no return value.
         */
        CanvasResizer.prototype.dispose = function () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            // stop listening for events
            window.removeEventListener("resize", this.window_resize, false);
        };
        //}
        //{ Resizing
        /**
         * Triggers a resize check. No parameters. No return.
         */
        CanvasResizer.prototype.resize = function () {
            // Grab the canvas's holder
            var parent = this._canvas.parentNode;
            // If the parent is null, the element is not in the DOM and we cannot respond
            if (parent === null || typeof (parent) === "undefined")
                return;
            // Hide the canvas so we can get the parent's responsive bounds
            var displayBackup = this._canvas.style.display;
            this._canvas.style.display = "none";
            // Measure parent without the canvas
            var w = parent.clientWidth;
            var h = parent.clientHeight;
            // Scale the canvas to match device pixels if high definition is requested and a viewport is defined
            var scale = 1;
            if (this._highDefinition) {
                var currentScale = CanvasResizer.readViewportScale();
                if (currentScale != null) {
                    var pixelRatio = (window.devicePixelRatio ? window.devicePixelRatio : 1);
                    if (pixelRatio != 1)
                        scale = pixelRatio * currentScale;
                }
            }
            this._contentScaleFactor = scale;
            w *= scale;
            h *= scale;
            // Check to see if a resize is even necessary
            var resizeNeeded = true;
            if (this._width === w && this._height === h)
                resizeNeeded = false;
            // Set the new canvas size
            if (resizeNeeded) {
                this._canvas.width = w; // * scale;
                this._canvas.height = h; // * scale;
                this._width = w;
                this._height = h;
                // Reset and scale the rendering transform
                var ctx = this._canvas.getContext('2d');
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(this._contentScaleFactor, this._contentScaleFactor);
            }
            // Restore the canvas display property
            this._canvas.style.display = displayBackup;
            // dispatch the resize event if we actually resized
            if (resizeNeeded)
                this._canvas.dispatchEvent(new Event("resize"));
        };
        //}
        //{ Event Handlers
        /**
         * Handles window resize events.
         */
        CanvasResizer.prototype.window_resize = function (evt) {
            // make the canvas respond in size
            if (this._autoResize)
                this.resize();
        };
        //}
        //{ Utilities
        /**
         * Reads the initial scale property of the window.
         * @return The initial scale value of the viewport tag, null if not defined.
         * @private Do not call
         */
        CanvasResizer.readViewportScale = function () {
            // Get the viewport tag
            var viewports = document.querySelectorAll("meta[name=viewport]");
            var viewport = null;
            if (viewports.length > 0)
                viewport = viewports[viewports.length - 1];
            // If there is no viewport tag, return null
            if (viewport === null)
                return null;
            // Get the content property of the viewport tag
            var contentValue = viewport.content;
            // If there is no content property, return null
            if (contentValue === "" || contentValue === null)
                return null;
            // Split the content property into a set of values
            var contentValues = contentValue.split(",");
            // Look for the initial scale property
            for (var i = 0; i < contentValues.length; ++i) {
                var val = contentValues[i];
                // Remove white space
                while (val.indexOf(" ") >= 0)
                    val = val.replace(" ", "");
                // Split prop and value
                var parts = val.split("=");
                var prop = parts[0];
                var value = parts[1];
                // return the initial scale if it is found, round it to 4 decimal places to avoid float rounding issues
                if (prop === "initial-scale")
                    return Math.round(parseFloat(value) * 1000) / 1000;
            }
            // No initial scale value was found, return null
            return null;
        };
        return CanvasResizer;
    })();
    swevans.CanvasResizer = CanvasResizer;
})(swevans || (swevans = {}));
