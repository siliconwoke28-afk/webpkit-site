# WebP to PNG converter, lossless in your browser

> Convert WebP to PNG in your browser. Transparent pixels are preserved, the PNG step is lossless, and the file stays on your device.

This converter decodes a WebP and re-encodes it as PNG without another lossy step, so the pixels you get match what the browser decoded, transparency included. Expect the PNG to be larger. That is the normal trade for a lossless container, not a sign that something went wrong.

## What changes when WebP becomes PNG

A WebP file can hold lossy pixels, lossless pixels, or an alpha channel, depending on how it was encoded. The browser decodes whichever variant it finds and hands the canvas an uncompressed bitmap. PNG then stores that bitmap losslessly. The practical result is a file that opens everywhere, keeps transparency, and is usually much bigger.

### Alpha and transparency

WebP supports transparency, but only when the encoder kept an alpha channel. If the source has one, this converter preserves it: the canvas is cleared to transparent, the decoded image is drawn over it, and the PNG encoder writes the alpha values. If the source WebP has no alpha, the PNG will be fully opaque. You cannot add transparency in this step, only carry through what exists.

Semi-transparent pixels matter here. A logo with a soft shadow is not a binary mask; it has thousands of partial alpha values. Both WebP and PNG can store those values, so a round trip through this tool keeps them. JPEG cannot, which is why a WebP to JPG conversion flattens the same image onto white.

### File size usually grows

PNG compresses without discarding data, using prediction filters and DEFLATE. On flat graphics it can be efficient. On photographs it is not: a WebP photo that is a few hundred kilobytes may become a multi-megabyte PNG. The exact increase depends on image content, so this tool reports the measured result rather than promising a range. If size matters more than lossless storage, PNG to WebP conversion is the opposite trade.

## When PNG is the right target

Choose PNG when a downstream tool or person needs the image exactly as decoded. Typical cases:

- Editing in an application that does not read WebP, or that re-saves aggressively.

- Screenshots, diagrams, and UI assets where sharp edges and text must stay sharp.

- Images with transparency that will be placed on an unknown background.

- Archival copies where another lossy generation is unacceptable.

PNG is also the safe choice when you are unsure. It is the most predictable output this tool can produce: no quality decision, no chroma subsampling, no block artifacts.

## When PNG is the wrong target

If the image is a photograph and the destination is a web page, PNG will cost bandwidth without a visible benefit. A JPG or a WebP will look the same at normal sizes and download faster. PNG is also a poor fit for very large images that only need a preview. In those cases, use the size control above to resize the WebP before or during conversion, or keep the original WebP.

## How this conversion runs

The script reads the file with the File API, decodes it with **createImageBitmap** when available (falling back to an Image element), draws it onto a canvas, and calls **canvas.toBlob** with the PNG MIME type. Because PNG is lossless, the quality slider is disabled when PNG is selected. The resize field still applies: if you set a longest edge, the canvas is scaled first and the PNG stores the scaled pixels.

Metadata does not survive. EXIF fields, XMP packets, and textual chunks are not copied by canvas; the output contains pixels and alpha only. Most browsers also draw into an sRGB canvas, so wide-gamut profiles are not preserved as tags. If you need the original metadata, keep the source file.

Nothing is uploaded at any point. The encoder runs in the same tab that displays this page, and you can confirm the absence of network activity in your browser's developer tools.

## Frequently asked questions

###

### Is WebP to PNG lossless?

The PNG step is lossless, but it cannot recover detail that a lossy WebP already discarded. You get an exact copy of the decoded pixels, not of the pre-WebP original.

###

### Does transparency survive WebP to PNG conversion?

Yes. PNG and WebP both support an alpha channel, so transparent pixels remain transparent and the PNG keeps a real alpha channel rather than a white background.

###

### Why is the PNG larger than the WebP?

PNG stores pixels without lossy compression, so photographic images often expand several times over. The exact ratio depends on the image, not on a fixed rule.

###

### Does WebPKit upload my WebP file?

No. The file is read locally with the File API and re-encoded by your browser; the script makes no network requests.

## Related converters

ConverterPNG to WebPConverterWebP to JPGConverterResize WebP

## Bottom line

WebP to PNG is the right move when you need lossless pixels or guaranteed transparency and can afford a larger file. The conversion preserves alpha and adds no new compression loss, but it cannot undo loss from the original WebP. Keep the file local, check the measured size, and convert only once.
