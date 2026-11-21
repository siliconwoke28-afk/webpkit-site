# WebP converter for PNG and JPG, in your browser

> Convert WebP to PNG or JPG, and PNG or JPG to WebP, inside your browser. Local canvas processing, transparency handled, real output size.

Drop an image and convert it between WebP, PNG and JPG without uploading anything. The file is decoded and re-encoded by your browser on a canvas, transparency is handled per format, and the size difference you see is measured from the actual output bytes. No account, no queue, no server.

## What this WebP converter actually does

Drop a WebP, PNG, or JPG into the panel above and choose an output: WebP, PNG, or JPG. Your browser decodes the file, draws it onto a canvas at the size you request, and re-encodes it with its own image encoder. There is no server in the loop. The source format, dimensions, and byte size are read from the file; the output size and the percentage change are measured from the resulting blob, not estimated.

The tool handles one image at a time. That is deliberate: a single-file workflow keeps memory use predictable and makes the size comparison honest. If you need to process a folder, a desktop tool or a command-line encoder such as **cwebp** is a better fit. The 25 MB ceiling exists for the same reason - a very large image can exhaust memory on a phone while it is being decoded.

## WebP, PNG or JPG: pick the output that fits the job

These three formats solve different problems, and the right choice depends on what happens after the file leaves this page.

### WebP: smaller files, lossy by default

WebP is not a single codec setting. The format supports lossy compression, lossless compression, and an alpha channel, and encoders can combine those modes. This tool passes the quality value to the browser's encoder through **canvas.toBlob**. In Chromium-based browsers, values below 1.0 produce lossy WebP and 1.0 switches to lossless; other browsers may map the value differently. The measured output size makes that difference visible.

Lossy WebP is usually the right choice for photographs and large illustrations on the web. It tends to beat JPEG at comparable visual quality and it keeps transparency when the source has it. If your source is a PNG and you want a smaller file, start with PNG to WebP conversion and check the preview for banding in flat areas.

### PNG: lossless pixels and clean transparency

PNG stores every pixel exactly and supports full alpha. That makes it the safe target for screenshots, UI assets, line art, logos, and images that will be edited again. The cost is size: a photographic PNG can be several times larger than the WebP it came from. When you need a lossless copy of what the browser decoded, convert WebP to PNG.

PNG output here is produced by the browser's PNG encoder and is lossless relative to the decoded source. It cannot restore detail that a lossy WebP already discarded.

### JPG: universal, photographic, no alpha

JPEG is the format every photo pipeline accepts. It does not support transparency, so this tool composites transparent pixels onto white before encoding. Choose JPG when a destination rejects WebP and the image is a photograph. For screenshots and text, JPEG's block artifacts are visible; PNG is the better target. If your source is a WebP with alpha, read WebP to JPG before you convert, because the background change is permanent in the output.

## How quality 0.8 behaves in practice

The slider runs from 0.4 to 1.0 and applies only to WebP and JPG. 0.8 is a common default because it removes a large share of the bytes while leaving artifacts hard to see at normal viewing sizes. At 0.4 you will see ringing around edges and smearing in flat areas; that can be acceptable for thumbnails and unacceptable for product shots. In Chromium browsers, sliding WebP to 1.0 changes the encoder to lossless, so the file can jump in size at the top of the range.

Quality is not a percentage of original quality, and the number is not comparable across formats. A WebP at 0.8 and a JPEG at 0.8 are different encoders doing different math. Judge by the preview and the measured size, not by the label. PNG ignores the slider; the control is disabled when PNG is selected so the interface does not imply a setting that has no effect.

## What conversion drops

Canvas conversion keeps pixels and alpha, but it does not carry container metadata. EXIF fields such as camera model, capture time, and GPS coordinates are not written to the output. Most browsers draw images into an sRGB canvas, so embedded color profiles are not preserved as tags; the pixels are converted to the canvas color space. For a screenshot or a web photo this rarely matters. For a print workflow or a photo that depends on a wide-gamut profile, convert in an application that manages color.

There is also a generational cost. Every lossy encode discards information. Converting WebP to JPG and back to WebP does not return the original; it stacks two sets of artifacts. Convert once, from the best source you have, and keep the untouched original somewhere.

## Why the file never leaves your device

The page has no upload endpoint and the script makes no network requests. Images are read with the File API, decoded with **createImageBitmap** or an Image element, and encoded with **canvas.toBlob**. You can verify this yourself by opening the network panel in your browser's developer tools while converting: no request carries your image. Once the page is loaded, conversion works offline.

That property is the main reason this tool exists. Uploading a client's screenshot to an unknown server just to change its format is a needless disclosure. Local processing removes the question entirely. The privacy policy describes the same boundary in more detail.

## Frequently asked questions

###

### Does converting to WebP reduce quality?

Below quality 1.0, yes: the WebP encoder is lossy. At 1.0 Chromium browsers switch to lossless WebP, which keeps pixels but can produce a much larger file, and other browsers may behave differently.

###

### Will transparency survive the conversion?

PNG and WebP keep the alpha channel; JPG does not. JPG output is composited onto white, so soft shadows become white fringes.

###

### Can I convert several images at once?

No. WebPKit converts one image per run by design, and the size comparison refers to that single file. Batch jobs need a different tool.

###

### Is there a file size limit?

Yes, 25 MB per image. Larger files are rejected before decoding so the browser tab does not run out of memory.

## Related converters

ConverterWebP to PNGConverterPNG to WebPConverterResize WebP

## Bottom line

Use WebP for the web when you control the destination, PNG when you need lossless pixels or transparency, and JPG when compatibility matters more than bytes. Start around quality 0.8, check the preview, and trust the measured size. Everything happens in this tab; nothing is uploaded.
