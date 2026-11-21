# Privacy policy: what WebPKit does and does not collect

> WebPKit processes images on your device. This policy explains what the site does not collect, what hosting logs may exist, and how to ask questions.

WebPKit converts images on your device. Images are not uploaded, stored, or transmitted by the site, and the pages currently load no analytics or advertising scripts. This policy describes that boundary, the small amount of data a web host may see, and how to ask a question about it.

## The short version

There is no account and no image storage. When you choose a file, the browser reads it from your disk, decodes it in memory, and encodes the result in the same tab. The site's JavaScript contains no upload code. The only data that can reach a server is the ordinary request for the page itself, which any web host receives. Every converter on the site follows this pattern, and the about page describes the design constraints behind it.

## Images and files

Images are handled with the browser's File API and an in-memory canvas. The site does not send them anywhere, does not read them in the background, and does not keep them after you close or reload the tab. The downloaded output is created by your browser from a local blob; it is not fetched from a server.

Because processing is local, the site cannot see your image's content, dimensions, metadata, or filename. If you use the converter on a work machine, the file is subject to that machine's policies, not to this site's. The same is true of browser extensions, which can read page content independently of WebPKit.

You can verify the behavior yourself: open the developer tools network panel, convert a file, and inspect the requests. No request body contains the image. Loading a page and then going offline still allows conversion of files already on your device.

## Cookies, analytics and advertising

The site currently sets no cookies and loads no analytics, tag managers, heatmaps, or advertising scripts. There is no consent banner because there is nothing to consent to at this time. Pages are static HTML, one stylesheet, and one JavaScript file served from the same domain.

If advertising or analytics is added later, this policy will be updated before the script ships. Advertising networks can set cookies and collect device information under their own policies; that would be disclosed here, along with the categories of data involved and any opt-out mechanism available. The same applies to affiliate links, which would be identified as such at the point of use.

## Hosting and server logs

WebPKit is a static site. The hosting provider serves files and may keep standard access logs, which typically include an IP address, the requested path, a timestamp, a referrer, and a user agent. Those logs are used for security, abuse prevention, and basic operations. The site does not combine them with other data to identify individuals, and it does not build visitor profiles.

Log retention is controlled by the hosting provider's configuration. If you need details for a compliance review, contact the site and ask; the answer will describe what the provider actually records rather than a generic promise.

## Third-party services

The pages do not embed third-party fonts, scripts, videos, or tracking pixels. Internal links stay on this domain. If you email the address on the contact page, your message is handled by the email provider that hosts the mailbox, and that provider's policies apply to the message. Do not send an image attachment unless it is necessary; a description of the file and the browser you used is usually enough to diagnose a problem.

## Your choices

You can use the site without providing any personal information. You can block JavaScript, in which case the converters will not run but the explanatory content remains readable. You can clear your browser's cache and storage at any time; the site keeps no local state that would be lost. If you want a copy of this policy for your records, print or save this page.

## Changes to this policy

When the site changes in a way that affects data handling, the "Updated" date at the top of this page will change and the relevant section will be revised. Material changes, such as adding advertising or analytics, will be described in plain language rather than hidden in a legal appendix. Continuing to use the site after an update means you accept the revised policy.

## Frequently asked questions

###

### Are my images uploaded to a server?

No. Conversion happens in your browser with the File API and canvas, and the site has no upload endpoint for images.

###

### Does WebPKit use cookies or analytics?

The site currently sets no cookies, loads no analytics, and includes no advertising scripts; the pages are static HTML, CSS, and JavaScript.

###

### What does the hosting provider log?

Like most web hosts, the provider may keep standard access logs such as IP address, request path, and user agent for security and operations. WebPKit does not use those logs to identify visitors or build profiles.

###

### What happens if ads are added later?

This policy will be updated before any advertising or analytics script is added, and the change will be described here rather than buried in a separate notice.

## Related converters

ConverterWebP to PNGConverterPNG to WebPConverterResize WebP

## Bottom line

WebPKit is built so that the sensitive part - your image - never leaves your device. The site collects no accounts, no image data, and no analytics at launch. Hosting logs may exist at the network edge, and any future advertising would be disclosed here before it appears.
