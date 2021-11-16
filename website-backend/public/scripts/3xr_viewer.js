// SPDX-License-Identifier: Apache-2.0
//////////////////////
// GLOBAL VARIABLES //
//////////////////////

// Session is provided on page load
var AB_ID = undefined;
const abIdInput = $('abId');
if (abIdInput) {
  AB_ID = abIdInput.value;
}

var ASSET_UID = '';
const assetInput = $('asset');
if (assetInput) {
  ASSET_UID = assetInput.value;
}

// Measure of how much the user has rotated the model
var CAMERA_ENGAGEMENT = 0;

// Custom parameter that can be provided by the client
var CUSTOMER_UID = '';
const customerUidInput = $('customerUid');
if (customerUidInput) {
  CUSTOMER_UID = customerUidInput.value;
}

// Check device type based on browser features
var DEVICE_TYPE_ID = 3; // Web - default
if (document.createElement('a').relList.supports('ar')) {
  DEVICE_TYPE_ID = 1; // iOS
} else if (/Android/i.test(navigator.userAgent)) {
  DEVICE_TYPE_ID = 2; // Android
}

// If this model has options, only assign listeners once
var OPTIONS_LISTENERS_ADDED = false;

// Location to redirect to when banner is clicked
var PRODUCT_URL = '';
const productUrlInput = $('productUrl');
if (productUrlInput) {
  PRODUCT_URL = productUrlInput.value;
}

// Session id from the backend
var SESSION_UID = '';
const sessionInput = $('session');
if (sessionInput) {
  SESSION_UID = sessionInput.value;
}

// Query parameter for source (embed, qr, ...)
const urlParams = new URLSearchParams(window.location.search);
const SRC = urlParams.get('src');

// How long the session has been running
var START_TIME = Date.now();

var VIEWER_SESSION_UID = '';
const viewerSessionUidInput = $('viewerSessionUid');
if (viewerSessionUidInput) {
  VIEWER_SESSION_UID = viewerSessionUidInput.value;
}

/////////////////////
// EVENT LISTENERS //
/////////////////////

const arButton = $('arButton');
if (arButton) {
  arButton.addEventListener('click', ev => {
    sendMetrics(15);
  });
}

// Banner with Buy Now action (Android)
const buyButton = $('buyButton');
if (buyButton) {
  buyButton.addEventListener('click', ev => {
    sendMetrics(14, PRODUCT_URL); // Quick Look Button Tapped
    if (PRODUCT_URL) {
      window.location = PRODUCT_URL;
    }
  });
}

// Full Screen Mode (embedded viewer only)
const fullscreenButton = $('fullscreenButton');
if (fullscreenButton) {
  fullscreenButton.addEventListener(
    'click',
    e => {
      const background = $('background');
      background.requestFullscreen();
    },
    false,
  );
  if (document.fullscreenEnabled) {
    fullscreenButton.style.display = 'block';
    document.addEventListener('fullscreenchange', e => {
      if (document.fullscreenElement) {
        // Enter Full Screen Mode
        exitFullscreenButton.style.display = 'block';
        fullscreenButton.style.display = 'none';
        sendMetrics(11); // Enter Fullscreen
      } else {
        // Exit Full Screen Mode
        exitFullscreenButton.style.display = 'none';
        fullscreenButton.style.display = 'block';
        sendMetrics(12); // Exit Fullscreen
      }
    });
  }
  const exitFullscreenButton = $('exitFullscreenButton');
  if (exitFullscreenButton) {
    exitFullscreenButton.addEventListener(
      'click',
      e => {
        document.exitFullscreen();
      },
      false,
    );
  }
}

// AR QR Code Button (non-AR devices)
const arQrButton = $('arQrButton');
if (arQrButton) {
  const qrCodePopup = $('qrCodePopup');
  arQrButton.addEventListener(
    'click',
    e => {
      qrCodePopup.style.display = 'flex';
      sendMetrics(10); // View in your space QR
    },
    false,
  );
  const qrExitButton = $('qrExitButton');
  qrExitButton.addEventListener(
    'click',
    e => {
      qrCodePopup.style.display = 'none';
    },
    false,
  );
}

// Model-Viewer events (see https://modelviewer.dev/)
const modelViewer = document.querySelector('model-viewer');
if (modelViewer) {
  // ar-status
  modelViewer.addEventListener('ar-status', ev => {
    const buyBanner = $('buyBanner');
    if (ev.detail.status == 'failed') {
      sendMetrics(9); // AR Failed
    } else if (ev.detail.status == 'session-started') {
      sendMetrics(7); // Web XR Session Started
    } else if (ev.detail.status == 'object-placed') {
      sendMetrics(8); // Web XR Object Placed
      if (buyBanner) {
        // Mimics Apple Pay button functionality
        buyBanner.style.display = 'block';
      }
    } else if (ev.detail.status == 'not-presenting') {
      sendMetrics(3); // Return from Viewer
      if (buyBanner) {
        buyBanner.style.display = 'none';
      }
    }
  });
  // blur
  modelViewer.addEventListener('blur', ev => {
    sendMetrics(17); // Focus Lost
  });
  // camera-change (warning: noisy)
  modelViewer.addEventListener('camera-change', ev => {
    if (ev.detail.source == 'user-interaction') {
      // Note this only applies to the model (not AR mode)
      CAMERA_ENGAGEMENT++;
    }
  });
  // environment-change
  // error
  modelViewer.addEventListener('error', ev => {
    sendMetrics(6); // Error
  });
  // focus
  modelViewer.addEventListener('focus', ev => {
    sendMetrics(16); // Focus
  });
  // load
  modelViewer.addEventListener('load', ev => {
    if ($('arButton').offsetHeight <= 0) {
      // Hide the QR code button if AR is enabled
      $('arQrButton').style.display = 'block';
    }
    sendMetrics(2); // Model Load
  });
  // model-visiblity
  // play
  // pause
  // preload
  // quick-look-button-tapped (apple action button / buy now)
  modelViewer.addEventListener('quick-look-button-tapped', ev => {
    // TODO: Implement the banner - add a boolean to asset to enable this feature
    sendMetrics(14, PRODUCT_URL); // Quick Look Button Tapped
    // Redirect to the product_url page (if any)
    if (PRODUCT_URL) {
      window.location = PRODUCT_URL;
    }
  });
  // scene-graph-ready
  modelViewer.addEventListener('scene-graph-ready', ev => {
    var material = modelViewer.model.materials[0];
    const buttons = document.querySelector('#buttons');
    if (buttons && !OPTIONS_LISTENERS_ADDED) {
      OPTIONS_LISTENERS_ADDED = true;
      for (let i = 0; i < buttons.children.length; i++) {
        buttons.children[i].addEventListener('click', event => {
          const diffuse = event.target.attributes.diffuse.value;
          const qr = event.target.attributes.qr.value;
          document.getElementById("qr-code").style.backgroundImage = "url('" + qr + "')";
          const usdz = event.target.attributes.usdz.value;
          material.pbrMetallicRoughness.baseColorTexture.texture.source.setURI(diffuse);
          modelViewer.setAttribute('ios-src', usdz + '#allowsContentScaling=0');
          sendMetrics(18, diffuse); // Option Change
        });
      }
    }
  });
}

window.addEventListener('unload', function () {
  sendMetrics(4); // Leave Page
});

// From https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
var hidden, visibilityChange;
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

if (typeof document.addEventListener !== 'undefined' && hidden !== undefined) {
  document.addEventListener(
    visibilityChange,
    function () {
      if (!document[hidden]) {
        sendMetrics(13); // Page Visible
        // For iOS, this could be used to know when the AR session has ended
        // Reset the timer because a lot of time my have elappesed and this is the start of new engagement
        START_TIME = Date.now();
      }
    },
    false,
  );
}

///////////////
// FUNCTIONS //
///////////////
function $(x) {
  return document.getElementById(x);
}

function sendMetrics(metricTypeId, notes = '') {
  var data = new Blob(
    [
      'abId=' +
      AB_ID +
      '&assetUid=' +
      ASSET_UID +
      '&cameraEngagement=' +
      CAMERA_ENGAGEMENT +
      '&customerUid=' +
      CUSTOMER_UID +
      '&deviceTypeId=' +
      DEVICE_TYPE_ID +
      '&metricTypeId=' +
      metricTypeId +
      '&notes=' +
      encodeURI(notes) +
      '&sessionTime=' +
      (Date.now() - START_TIME) +
      '&sessionUid=' +
      SESSION_UID +
      '&src=' +
      SRC +
      '&url=' +
      window.location.href,
      '&viewerSessionUid=' + VIEWER_SESSION_UID,
    ],
    { type: 'application/x-www-form-urlencoded' },
  );
  navigator.sendBeacon('https://metrics.3xr.com/metrics', data);
}
