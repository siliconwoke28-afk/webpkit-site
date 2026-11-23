/* WebPKit converter — client-side only. No network requests of any kind. */
(function () {
  'use strict';

  var root = document.getElementById('converter');
  if (!root) {
    return;
  }

  var MAX_BYTES = 25 * 1024 * 1024;
  var MIN_EDGE = 16;
  var MAX_EDGE = 12000;
  var MIME = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg' };
  var EXT = { webp: 'webp', png: 'png', jpg: 'jpg' };
  var LABEL = { webp: 'WebP', png: 'PNG', jpg: 'JPG' };

  var fileInput = document.getElementById('file');
  var dropzone = document.getElementById('dropzone');
  var statusEl = document.getElementById('status');
  var filemeta = document.getElementById('filemeta');
  var metaFormat = document.getElementById('meta-format');
  var metaDims = document.getElementById('meta-dims');
  var metaSize = document.getElementById('meta-size');
  var qualityEl = document.getElementById('quality');
  var qualityOut = document.getElementById('quality-out');
  var qualityHint = document.getElementById('quality-hint');
  var edgeEl = document.getElementById('maxedge');
  var convertBtn = document.getElementById('convert');
  var result = document.getElementById('result');
  var preview = document.getElementById('preview');
  var outFormat = document.getElementById('out-format');
  var outDims = document.getElementById('out-dims');
  var outSize = document.getElementById('out-size');
  var outDelta = document.getElementById('out-delta');
  var download = document.getElementById('download');
  var resultStatus = document.getElementById('result-status');
  var formatInputs = root.querySelectorAll('input[name="format"]');

  var state = {
    file: null,
    bitmap: null,
    outUrl: null,
    runId: 0
  };

  var webpSupport = null;
  var convertTimer = 0;
  var lastTrack = 0;

  function currentFormat() {
    for (var i = 0; i < formatInputs.length; i++) {
      if (formatInputs[i].checked) {
        return formatInputs[i].value;
      }
    }
    return 'webp';
  }

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.classList.toggle('is-error', !!isError);
  }

  function formatBytes(bytes) {
    if (typeof bytes !== 'number' || isNaN(bytes)) {
      return '—';
    }
    if (bytes < 1024) {
      return bytes + ' B';
    }
    if (bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function canEncode(fmt) {
    if (fmt !== 'webp') {
      return true;
    }
    if (webpSupport === null) {
      var probe = document.createElement('canvas');
      probe.width = 1;
      probe.height = 1;
      try {
        webpSupport = probe.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } catch (err) {
        webpSupport = false;
      }
    }
    return webpSupport;
  }

  function syncControls() {
    var fmt = currentFormat();
    var lossy = fmt !== 'png';
    qualityEl.disabled = !lossy;
    qualityOut.textContent = lossy ? Number(qualityEl.value).toFixed(2) : 'n/a';
    qualityHint.textContent = lossy
      ? 'Lossy encoding. 0.80 is a common starting point.'
      : 'PNG is lossless. The quality value has no effect.';
  }

  function resetOutput() {
    state.runId++;
    if (state.outUrl) {
      URL.revokeObjectURL(state.outUrl);
      state.outUrl = null;
    }
    result.hidden = true;
    resultStatus.textContent = '';
    preview.removeAttribute('src');
    download.removeAttribute('href');
  }

  function clearImage() {
    resetOutput();
    if (state.bitmap && state.bitmap.close) {
      state.bitmap.close();
    }
    state.bitmap = null;
    state.file = null;
    filemeta.hidden = true;
    convertBtn.disabled = true;
  }

  function decode(file) {
    if ('createImageBitmap' in window) {
      return createImageBitmap(file).catch(function () {
        return decodeWithElement(file);
      });
    }
    return decodeWithElement(file);
  }

  function decodeWithElement(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('decode-failed'));
      };
      img.src = url;
    });
  }

  function showMeta(file) {
    var subtype = (file.type || '').split('/')[1] || 'unknown';
    metaFormat.textContent = subtype.toUpperCase();
    metaDims.textContent = state.bitmap.width + ' × ' + state.bitmap.height;
    metaSize.textContent = formatBytes(file.size);
    filemeta.hidden = false;
  }

  function scheduleConvert(delay) {
    window.clearTimeout(convertTimer);
    convertTimer = window.setTimeout(convert, delay);
  }

  function convert() {
    if (!state.file || !state.bitmap) {
      setStatus('Add an image first, or drop one into the panel above.', true);
      return;
    }

    var fmt = currentFormat();
    if (!canEncode(fmt)) {
      setStatus('This browser cannot encode ' + LABEL[fmt] + '. Choose PNG or JPG instead.', true);
      return;
    }

    var edgeText = edgeEl.value.trim();
    var edge = parseInt(edgeText, 10);
    if (edgeText !== '' && (isNaN(edge) || edge < MIN_EDGE || edge > MAX_EDGE)) {
      setStatus('Longest edge must be a whole number between ' + MIN_EDGE + ' and ' + MAX_EDGE + ' px.', true);
      return;
    }

    var runId = ++state.runId;
    var srcW = state.bitmap.width;
    var srcH = state.bitmap.height;
    var outW = srcW;
    var outH = srcH;

    if (edgeText !== '') {
      var scale = edge / Math.max(srcW, srcH);
      outW = Math.max(1, Math.round(srcW * scale));
      outH = Math.max(1, Math.round(srcH * scale));
    }

    var canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    var ctx = canvas.getContext('2d');
    if (!ctx) {
      setStatus('Canvas is unavailable in this browser, so the image cannot be converted.', true);
      return;
    }

    if (fmt === 'jpg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(state.bitmap, 0, 0, outW, outH);

    var quality = fmt === 'png' ? undefined : parseFloat(qualityEl.value);
    setStatus('Encoding ' + LABEL[fmt] + '…');

    canvas.toBlob(function (blob) {
      if (runId !== state.runId) {
        return;
      }
      if (!blob) {
        if (window.track) window.track('webp_error', { reason: 'encode' });
        setStatus('This browser could not encode ' + LABEL[fmt] + '. Try PNG or JPG instead.', true);
        return;
      }
      showResult(blob, fmt, outW, outH);
    }, MIME[fmt], quality);
  }

  function showResult(blob, fmt, outW, outH) {
    if (state.outUrl) {
      URL.revokeObjectURL(state.outUrl);
    }
    state.outUrl = URL.createObjectURL(blob);

    preview.src = state.outUrl;
    outFormat.textContent = LABEL[fmt];
    outDims.textContent = outW + ' × ' + outH;
    outSize.textContent = formatBytes(blob.size);

    var delta = blob.size - state.file.size;
    var pct = state.file.size > 0 ? (delta / state.file.size) * 100 : 0;
    var sign = pct > 0 ? '+' : (pct < 0 ? '\u2212' : '');
    var deltaText = sign + Math.abs(pct).toFixed(1) + '%';
    outDelta.textContent = deltaText;
    outDelta.classList.toggle('save', pct < 0);
    outDelta.classList.toggle('grow', pct > 0);

    var base = state.file.name.replace(/\.[^.]+$/, '') || 'image';
    download.href = state.outUrl;
    download.download = base + '-webpkit.' + EXT[fmt];
    state.outFmt = fmt;
    result.hidden = false;
    var now = Date.now();
    if (window.track && now - lastTrack > 1500) {
      lastTrack = now;
      window.track('webp_convert', { to: fmt, w: outW, h: outH, kb: Math.round(blob.size / 1024) });
    }

    var direction = pct < 0 ? 'smaller than the original' : (pct > 0 ? 'larger than the original' : 'the same size as the original');
    resultStatus.textContent = 'Converted to ' + LABEL[fmt] + ' at ' + outW + ' × ' + outH + '. '
      + formatBytes(blob.size) + ', ' + Math.abs(pct).toFixed(1) + '% ' + direction + '.';
    setStatus('Done. The output was built on this device and was never uploaded.');
  }

  function handleFile(file) {
    if (!file) {
      return Promise.resolve();
    }

    if (!file.type || file.type.indexOf('image/') !== 0) {
      if (window.track) window.track('webp_error', { reason: 'type' });
      setStatus('That file is not an image. Use a WebP, PNG, JPG, GIF, or AVIF file.', true);
      return Promise.resolve();
    }

    if (file.size > MAX_BYTES) {
      if (window.track) window.track('webp_error', { reason: 'size' });
      setStatus('That image is ' + formatBytes(file.size) + '. The limit is 25 MB per file.', true);
      return Promise.resolve();
    }

    resetOutput();
    setStatus('Reading ' + file.name + '…');

    return decode(file).then(function (bitmap) {
      if (state.bitmap && state.bitmap.close) {
        state.bitmap.close();
      }
      state.bitmap = bitmap;
      state.file = file;
      showMeta(file);
      if (window.track) window.track('webp_upload', { type: file.type, kb: Math.round(file.size / 1024), w: bitmap.width, h: bitmap.height });
      convertBtn.disabled = false;
      setStatus('Loaded ' + file.name + '. Adjust the output and it converts automatically.');
      convert();
    }).catch(function () {
      clearImage();
      setStatus('That file could not be decoded as an image. Try a PNG, JPG, or WebP file.', true);
    });
  }

  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    fileInput.value = '';
    handleFile(file);
  });

  dropzone.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput.click();
    }
  });

  var dragDepth = 0;
  dropzone.addEventListener('dragenter', function (event) {
    event.preventDefault();
    dragDepth++;
    dropzone.classList.add('is-over');
  });
  dropzone.addEventListener('dragover', function (event) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  });
  dropzone.addEventListener('dragleave', function () {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) {
      dropzone.classList.remove('is-over');
    }
  });
  dropzone.addEventListener('drop', function (event) {
    event.preventDefault();
    dragDepth = 0;
    dropzone.classList.remove('is-over');
    var files = event.dataTransfer && event.dataTransfer.files;
    if (!files || !files.length) {
      return;
    }
    handleFile(files[0]).then(function () {
      if (files.length > 1) {
        setStatus('One image at a time. The first of ' + files.length + ' files was used.', true);
      }
    });
  });

  window.addEventListener('dragover', function (event) {
    event.preventDefault();
  });
  window.addEventListener('drop', function (event) {
    event.preventDefault();
  });

  for (var i = 0; i < formatInputs.length; i++) {
    formatInputs[i].addEventListener('change', function () {
      syncControls();
      if (state.bitmap) {
        convert();
      }
    });
  }

  qualityEl.addEventListener('input', function () {
    qualityOut.textContent = Number(qualityEl.value).toFixed(2);
    if (state.bitmap) {
      scheduleConvert(140);
    }
  });

  edgeEl.addEventListener('input', function () {
    if (state.bitmap) {
      scheduleConvert(420);
    }
  });

  download.addEventListener('click', function () {
    if (window.track) window.track('webp_download', { to: state.outFmt || 'unknown' });
  });

  convertBtn.addEventListener('click', convert);

  syncControls();
  convertBtn.disabled = true;
})();
