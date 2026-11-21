# Resize WebP images by their longest edge

> Resize a WebP by its longest edge while keeping the aspect ratio, then save as WebP, PNG or JPG. Everything runs in your browser.

Enter a target for the longest edge, drop a WebP, and the browser scales the image proportionally, then re-encodes it. Aspect ratio is preserved and the other dimension is computed, not entered. This is a single resample followed by a single encode, which is the least destructive way to hit a pixel budget.

## How longest-edge resizing works

You provide one number: the length of the longer side in pixels. The script compares the source width and height, finds the larger value, and computes a scale factor. Both dimensions are multiplied by that factor and rounded to whole pixels. The shorter side follows automatically, so the image is never stretched.

For example, a 3000 × 2000 image resized to a longest edge of 1600 gets a scale of 1600 / 3000 = 0.5333. The output is 1600 × 1067. The one-pixel difference comes from rounding 1066.67, and it is normal. If the source is portrait, the height is the longest edge and the width scales instead.

A target equal to the current longest edge changes nothing, and the tool still re-encodes if you press the button. That is useful for changing format, but it is not a free operation: it is a decode and encode cycle. If dimensions and format both already match your needs, skip the tool.

## Downscaling, upscaling, and detail

### Downscaling

Making an image smaller is the common case, and it is usually a net win. Fewer pixels mean fewer bytes, faster layout, and less memory use in the browser. Canvas resampling with high smoothing averages neighboring pixels, which preserves overall tone but softens single-pixel detail. For photographs this is invisible at reasonable output sizes. For text and thin lines, downscaling can make small type unreadable, so choose a target that matches how the image will actually be displayed.

### Upscaling

Making an image larger cannot add real detail. The browser interpolates between existing pixels, so edges get softer and textures look smooth rather than sharper. Use upscaling only to satisfy a minimum dimension required by an upload form or a layout, not as a quality improvement. If you need a genuinely larger original, you need a better source file.

## Resize and convert in one pass

The tool draws the decoded image directly onto a canvas at the final size, then encodes that canvas once. This avoids the classic mistake of compressing at full size, scaling the compressed result, and compressing again. One resample and one encode is the shortest quality-preserving path available in a browser.

The output format is your choice. Staying in WebP is the smallest option. Choosing PNG gives lossless output with alpha, which is useful if the resized image will be edited further; see WebP to PNG for that trade in detail. Choosing JPG flattens transparency onto white and is best kept for opaque photographs.

## Transparency and quality after resizing

Alpha is preserved for WebP and PNG output. Edges that were semi-transparent are resampled along with color, so a soft shadow stays soft, though very fine alpha detail can mute slightly. JPG output composites onto white before encoding, exactly as on the WebP to JPG page.

Quality works the same way as elsewhere on this site: the slider controls the lossy encoder and PNG ignores it. Downscaling already removes detail, so quality 0.8 is usually enough after a resize; raising it to 1.0 does not bring back the pixels that were averaged away. If the resized WebP looks soft, the cause is more likely the target size than the quality value.

## Choosing a target size

Start from where the image will be shown. A full-width hero on a 1440 px layout rarely needs more than 1600 px on its longest edge, even on high-density screens. A thumbnail can be 400 px. An image that will be zoomed should keep more pixels, because the viewer is inspecting detail. When in doubt, resize to the largest size the layout can display and compare the preview before publishing.

If you are preparing a batch, resize several representative images, note the measured sizes, and then pick one policy. This page intentionally handles one file at a time so each result can be checked. For automated pipelines, a command-line encoder is the better tool.

## Local processing, no upload

The file is read with the File API, decoded in the tab, resized on a canvas, and encoded with **canvas.toBlob**. No network request is made, and the output size shown is read from the resulting blob. You can confirm the absence of uploads in the browser's network panel. The same guarantee applies to PNG to WebP and every other converter on the site.

## Frequently asked questions

###

### Does resizing a WebP reduce quality?

Yes when the output stays lossy WebP. Downscaling averages pixels and the encoder compresses again, so the result is not identical; PNG output avoids the second compression but keeps the resampling change.

###

### Can I enlarge a WebP without losing sharpness?

No. Upscaling interpolates pixels and cannot invent detail, so a larger canvas looks softer. The tool allows it, but use it only when a minimum dimension is required.

###

### Does the tool keep the aspect ratio?

Yes. You set the longest edge and the other dimension is calculated from the source ratio, then rounded to the nearest pixel.

###

### Is the resize done before compression?

Yes. The image is drawn to the target canvas first and that canvas is encoded, so the encoder works on the final dimensions rather than compressing and then scaling.

## Related converters

ConverterWebP to PNGConverterPNG to WebPConverterJPG to WebP

## Bottom line

Resize by the longest edge when you need a specific maximum dimension, not when you want to improve an image. Pick a target that matches the display size, keep the aspect ratio, and encode once. Downscaling saves real bytes; upscaling only makes a bigger file.
