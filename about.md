# About WebPKit, a browser-only image converter

> WebPKit is a static, client-side image converter. No accounts, no uploads, no tracking scripts - just canvas conversion for WebP, PNG and JPG.

WebPKit is a small static site that converts images between WebP, PNG and JPG, and resizes them, using nothing but the browser's own canvas API. There is no upload, no account, and no queue. The site exists because changing an image format should not require handing a private file to an unknown server.

## What WebPKit is

The site is a set of focused pages: a general WebP converter, dedicated pages for WebP to PNG, WebP to JPG, PNG to WebP, JPG to WebP, and a resizer for WebP images. Each page carries the same converter with a different default output and its own explanation of the trade-offs. Nothing is stored between visits: there are no accounts, no saved history, and no image library.

The tool reads a file you choose, decodes it with the browser, draws it to a canvas, and encodes the result. That is the whole pipeline. The bytes never travel over the network, so the only copy of your image is the one on your disk and the temporary memory the browser uses while the tab is open.

## The constraints we chose

The site is deliberately plain. There is no JavaScript framework, no external font, no CDN, and no image asset in the interface. One stylesheet and one script ship with the pages. That keeps the first load small, makes the layout predictable on slow connections, and removes third-party requests that could see your IP address or set cookies.

The visual language follows the same idea: a near-black workbench, square corners, a single fluorescent accent, and monospaced labels for anything that behaves like a measurement. It is meant to feel like a tool, not a landing page.

## Limits we chose on purpose

Some constraints are technical and some are editorial. Both are intentional:

- **One image per run.** A single file keeps memory predictable and makes the before/after size comparison meaningful. Batch jobs belong in a command-line encoder.

- **25 MB per file.** Decoding a very large image can exhaust memory on a phone. The limit is checked before decoding starts.

- **No separate lossless switch.** The canvas API takes a quality value, not a mode flag. Chromium-based browsers use lossless WebP at 1.0, but other browsers may differ, so the site does not promise a lossless export. Use PNG when lossless output is required.

- **No metadata preservation.** Canvas output contains pixels and alpha, not EXIF or color-profile tags. This is a privacy gain and an archival loss, depending on your use.

- **No server-side history.** There is nothing to delete later because nothing was kept.

## How to verify the privacy claim

You do not have to take the sentence in the footer on faith. Open your browser's developer tools, switch to the network panel, and convert an image. No request carries the file. You can also load a page, disconnect from the network, and convert an image that is already on your device; the conversion still works because the encoder is local.

The privacy policy describes what the site does not collect, what a hosting provider might log at the network edge, and how to ask a question about it. If you find a discrepancy between the policy and the behavior, please report it through the contact page.

## Who the site is for

It is for people who need one image converted now: a WebP that a client's CMS will not accept, a PNG that is too large to email, a screenshot that needs a smaller longest edge. It is not a photo editor, an asset manager, or a batch pipeline. It does not crop, rotate, retouch, or strip metadata selectively. Those are different tools, and pretending otherwise would make this one worse at the job it actually does.

If a page claims something about format behavior, it is there because the behavior is observable in a browser, not because a marketing deck said so. Where results vary by image, the site reports the measured size and lets the preview speak.

## Frequently asked questions

###

### Who runs WebPKit?

WebPKit is an independent static site focused on browser-based image conversion; it has no accounts and no editorial team behind a content feed.

###

### Does WebPKit upload or store images?

No. The converters read files locally with the File API and encode them in the browser; there is no upload endpoint and no server-side image storage.

###

### Why only one image at a time?

Because the tool is built for careful single conversions: memory stays bounded, the size comparison stays meaningful, and each result can be checked before download.

###

### How is WebPKit funded?

The site is currently free and has no ads or affiliate links; if that changes, the privacy page will describe any third-party scripts before they are added.

## Related converters

ConverterWebP to PNGConverterPNG to WebPConverterResize WebP

## Bottom line

WebPKit does one job locally: convert and resize images with the browser's canvas. It is small on purpose, honest about its limits, and easy to verify. If that matches what you need, the converter is one click away.
