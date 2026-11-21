# WebP to JPG converter with a white background

> Convert WebP to JPG without uploading. Transparency is flattened onto white, quality is adjustable, and the output size is measured locally.

Converting WebP to JPG re-encodes the image with lossy JPEG compression and flattens any transparency onto white. Use it when a destination rejects WebP and the picture is photographic. If the image has a cut-out subject or a soft shadow, expect a visible white fringe where the alpha channel used to be.

## What WebP to JPG actually changes

Two things change at once. The pixel data is re-encoded with the JPEG algorithm, which is lossy, and the alpha channel is removed, because the JPEG format has no way to store it. Everything else - dimensions, aspect ratio, and the visible composition - stays the same unless you set a longest edge.

### Transparency becomes white

This tool fills the canvas with solid white before drawing the image. Any pixel that was fully transparent becomes white; any pixel that was partially transparent is blended with white according to its alpha value. The output JPG is fully opaque, which is what JPG consumers expect.

### Soft edges and fringes

A cut-out product photo on a transparent background is the worst case. Its anti-aliased edges carry a gradient of alpha values, and after flattening those values turn into a pale halo against the new background. On a white page the halo is usually invisible; on a dark page it is obvious. If the target background is not white, this conversion is not the right step - keep the WebP or convert WebP to PNG so the alpha survives and you can composite the image properly.

## Quality: 0.8 is a reasonable start

The slider maps to the JPEG encoder's quality argument. At 0.8 you get a file that looks clean at normal viewing distance for most photographs while cutting a large share of the bytes. At 0.6 the image starts to soften; at 0.4 block artifacts appear in gradients, skies, and skin tones. Raise it to 0.9 or higher for detailed textures, small text, or images that will be cropped and zoomed after delivery.

### Artifacts to watch for

JPEG works on 8×8 blocks and subsamples color information. The visible symptoms are ringing around hard edges, blocking in smooth gradients, and color smearing on fine red details. Screenshots and line art show these problems badly. If your source is UI work rather than a photo, PNG is the better output.

### Why quality 1.0 is not lossless

Even at 1.0 the JPEG encoder quantizes and discards information; it just does so with the finest tables it has. The output is high quality, not identical to the input. And because the source WebP was already lossy, the conversion always adds a second generation of artifacts. Convert once from the best original you have rather than trading formats repeatedly.

## Metadata, EXIF and orientation

Canvas output contains pixels only. Camera model, capture time, GPS coordinates, copyright fields, and color-profile tags are not written to the JPG. That is often desirable for privacy: a photo taken on a phone can otherwise reveal where it was shot. It also means you cannot rely on this tool to preserve provenance metadata.

Orientation is handled during decoding. Browsers apply the EXIF orientation of the source when they draw the image, so the JPG shows the picture upright even though the orientation tag itself is gone. If you need the raw stored orientation, use a metadata-aware editor instead.

## When to convert, and when to keep the WebP

Convert when an upload form, email client, print service, or older application refuses WebP. JPG remains the most widely accepted photographic format. Keep the WebP when the image has transparency, when the destination is a modern browser, or when file size is the priority. A JPG of the same photo is often larger than the WebP it came from, so this is a compatibility move, not a size optimization.

If size is the goal, adjust the longest edge before converting. Reducing a 4000 px photo to 1600 px does more for the byte count than moving the quality slider, and it is easy to do with the size field above or on the dedicated resize WebP page. To go the other direction later, use JPG to WebP.

## How the local conversion works

The file is read with the File API, decoded by the browser, drawn to a canvas, and encoded with **canvas.toBlob('image/jpeg', quality)**. No network request is made, so the image never leaves the machine. The reported output size and percentage difference come from the actual JPEG blob, which is why they can differ from what a desktop editor produces with different encoder settings.

## Frequently asked questions

###

### Is WebP to JPG lossy?

Yes. JPG is a lossy format, so this conversion discards some detail on top of whatever the WebP already lost; the quality slider controls how much.

###

### What happens to transparent areas in the WebP?

They become white. JPG has no alpha channel, so the converter fills the canvas with white before drawing the image, and semi-transparent edges blend toward that white.

###

### Does the JPG keep EXIF data?

No. Canvas output contains pixels only, so EXIF, GPS coordinates, and capture time are dropped. Orientation is applied by the browser during decoding, so the image is not rotated incorrectly.

###

### Can I keep the file size down?

Yes, lower the quality slider and, if the image is larger than its display size, set a longest edge before converting. Both changes are applied before the JPEG encoder runs.

## Related converters

ConverterWebP to PNGConverterJPG to WebPConverterResize WebP

## Bottom line

Use WebP to JPG for opaque photographs that must open in software without WebP support. Accept the white background, start at quality 0.8, and resize before encoding if the file is too large. If transparency matters, output PNG instead.
