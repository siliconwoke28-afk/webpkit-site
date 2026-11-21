# PNG to WebP converter that keeps transparency

> Convert PNG to WebP in your browser. Alpha is preserved, quality is adjustable, and you see the real before and after file size. No uploads.

This PNG to WebP converter keeps the alpha channel and usually produces a smaller file. The caveat: below quality 1.0 the browser's WebP encoder is lossy, and at 1.0 Chromium browsers switch to lossless, which can produce a much larger file. For logos and screenshots with fine text, compare the preview and the measured size before replacing your PNG.

## What PNG to WebP keeps and drops

A PNG is lossless and can carry an alpha channel. WebP can also be lossless and can also carry alpha, but those are encoder settings rather than automatic properties of the extension. The canvas API exposes a quality value: in Chromium browsers, values below 1.0 take the lossy WebP path and 1.0 takes the lossless path. At a quality below 1.0 the conversion keeps transparency and composition while discarding a small amount of detail.

### Transparency and alpha

If the PNG has transparent pixels, the canvas starts empty and the image is drawn over it. The WebP encoder writes the resulting alpha channel, so cut-out images stay cut out. Semi-transparent shadows survive as semi-transparent shadows. This is the main reason to choose WebP over JPG for interface graphics: JPG to WebP is a different conversation, but PNG sources keep their alpha here.

One edge case: fully transparent regions in a lossy WebP are stored with limited precision. If you place the result on a very different background, faint halos can appear around soft edges. For strict compositing work, keep the PNG or use a lossless encoder outside the browser.

### Lossy below 1.0, browser-dependent at 1.0

At quality values below 1.0, Chromium-based browsers produce lossy WebP. At exactly 1.0 they switch the encoder to lossless, so the output can be pixel-identical to the decoded PNG and much larger. Other browsers may not make that switch. Because the canvas API does not expose a dedicated lossless flag, this page describes the result by measured size instead of promising a mode. If lossless storage is the requirement, keep the PNG.

## Quality settings for graphics

Graphics behave differently from photographs. Large flat areas compress well, but hard edges and small text expose artifacts quickly. The useful range for screenshots and UI assets is usually 0.85 to 0.95; for photographic PNGs, 0.8 is a sensible default. The top of the range is not linear: 0.95 is still lossy, while 1.0 may jump to lossless in Chromium and produce a much larger file.

### Start at 0.8, then raise it for detail

Convert at 0.8, look at the preview at 100% if you can, then raise the slider if edges look soft. The measured size updates with every change, so you can see exactly what the extra fidelity costs. There is no penalty for trying several values; the conversion reruns locally.

### Text, line art and screenshots

Thin strokes and small type are the first things lossy compression damages. If the image is a screenshot that people will read, a slightly larger PNG may be the better product decision even though WebP wins on bytes. Test one representative image before converting a whole set by hand.

### There is no lossless switch here

Some command-line encoders offer **-lossless**. The canvas API takes a quality number instead of a mode flag, and 1.0 may or may not engage lossless depending on the browser. This page therefore does not offer a guaranteed lossless WebP export; use PNG when that guarantee matters.

## Browser support for WebP

Modern browsers display WebP natively, including transparency, so a WebP served to a current browser renders like any other image. The remaining risk is not the browser but the rest of the pipeline: email clients, older design tools, some CMS upload filters, and print services may reject or mishandle WebP. Check the destination before you standardize on it.

If you need to move back to a universally accepted format, convert WebP to PNG for lossless output with alpha, or use JPG for opaque photos. The WebP converter home page covers the format trade-offs in more depth.

## When PNG should stay PNG

Keep the PNG when the file is a master asset, when it will be edited repeatedly, when a lossless guarantee is part of the workflow, or when the image is small enough that the byte savings do not matter. Converting a 12 KB icon to a 10 KB WebP adds a compatibility question for almost no gain.

## How the conversion runs locally

The PNG is read with the File API, decoded by the browser, drawn to a canvas, and encoded with **canvas.toBlob('image/webp', quality)**. The optional longest-edge field scales the canvas first, which is often the biggest lever on file size. No request leaves the page, and the size numbers come from the encoded blob rather than from an estimate.

## Frequently asked questions

###

### Does PNG to WebP keep transparency?

Yes. The canvas keeps the alpha channel and the WebP encoder writes it, so transparent and semi-transparent pixels stay intact in the output.

###

### Is the WebP output lossless?

Only at quality 1.0 in browsers that map that value to lossless WebP, such as Chromium-based ones. Below 1.0 the output is lossy, and other browsers may treat 1.0 differently.

###

### How much smaller will the file be?

There is no fixed ratio. Flat graphics and screenshots often shrink a lot, while detailed PNGs may shrink modestly or even grow at high quality settings; the tool shows the measured result for your image.

###

### Will text stay sharp in WebP?

Only at a high quality setting, and even then it depends on the image. Lossy WebP can soften thin strokes, so keep PNG for UI assets where crisp text is critical.

## Related converters

ConverterWebP to PNGConverterJPG to WebPConverterResize WebP

## Bottom line

PNG to WebP is a good trade when you want smaller transparent graphics for modern browsers and can accept lossy encoding. Keep quality high for text, verify the preview, and retain the PNG if you need a lossless master. The conversion runs entirely on your machine.
