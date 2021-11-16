<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/Platform.pug">
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'platform',
  metaInfo: {
    title: 'Platform | 3XR',
    meta: [
      {
        name: 'description',
        content:
          'The 3XR platform unlocks the ability to use a single source of truth, one 3D model, to push the customer experience to all your distribution channels.',
      },
      {
        name: 'keywords',
        content:
          '3xr platform, platform for ar, augmented reality platform, augmented reality conversion, images to 3d, images to ar, product to ar, 3d qa platform, ar qa platform, 3d asset creation, ar asset creation, pay for ar assets, ar assets, ar commerce, shop in ar, augmented reality assets, ar for dummies, how to create ar assets, how to 3d commerce',
      },
      { property: 'og:image', content: 'https://cdn.3xr.com/images/home/PO-laptop.jpg' },
    ],
  },
});
</script>

<style lang="scss" scoped>
.top-margin {
  margin-top: -20px;
}
.light-mint-bkg {
  background-color: #e9f4f3;
}
.light-green-bkg {
  background-color: #e9f4ec;
}
.med-blue-bkg {
  background-color: #cce5f4;
}
.white-bkg {
  background-color: #ffffff;
}
.desktop {
  display: none;
}
.mobile {
  display: block;
}
.upper {
  text-transform: uppercase;
  font-weight: 900;
  line-height: 1.24;
}
.padding-top-less {
  padding-top: 5%;
}
.padding-btm-less {
  padding-bottom: 5%;
}
.reg {
  line-height: 1.63;
}
.caption {
  font-size: 14px;
}
.rounded {
  border-radius: 22px;
  font-weight: bold;
}
.chair-demo {
  background-image: linear-gradient(#1e1e1e, #6c6c6c, #9a9a9a);
}
.screen {
  border: 2px solid #000;
}
.browser-text {
  font-weight: 500;
  padding-top: 5px;
}
.gallery-arrows {
  padding-top: 40%;
  padding-bottom: 40%;
}
.promo-vid {
  height: 240px;
  padding-top: 20px;
}
@media (min-width: 960px) {
  .desktop {
    display: block;
  }
  .mobile {
    display: none;
  }
  .chair-demo {
    padding-top: 0px;
  }
  .block1 {
    padding-left: 5%;
    padding-right: 8%;
    padding-top: 80px;
  }
  .block2 {
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 80px;
  }
  .block2b {
    padding-top: 80px;
  }
  .block3 {
    padding-left: 5%;
    padding-right: 5%;
    padding-bottom: 10px;
  }
  .block3b {
    padding-left: 10%;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .block6 {
    margin-left: 100px;
    margin-right: 100px;
    padding-top: 80px;
  }
  .promo-vid {
    height: 440px;
    padding-top: 20px;
  }
  .model-viewer-container {
    height: 450px;
  }
}
@media (min-width: 1264px) {
  .block1 {
    padding-left: 200px;
    padding-right: 200px;
    padding-top: 80px;
  }
  .demo {
    width: 500px;
  }
  .block2 {
    padding-left: 200px;
    padding-top: 80px;
  }
  .block2b {
    padding-right: 80px;
    padding-left: 100px;
    padding-top: 80px;
  }
  .block3 {
    padding-left: 200px;
    padding-top: 80px;
    padding-bottom: 100px;
  }
  .block3b {
    padding-left: 60px;
    padding-top: 90px;
    padding-bottom: 100px;
  }
  .browser-text {
    font-weight: 500;
    padding-top: 10px;
  }
  .block6 {
    margin-left: 200px;
    margin-right: 200px;
    padding-top: 80px;
  }
  .promo-vid {
    height: 500px;
  }
}
@media (min-width: 1600px) {
  .block2 {
    padding-left: 200px;
    padding-top: 80px;
  }
  .block2b {
    padding-right: 80px;
    padding-left: 100px;
    padding-top: 80px;
  }
  .block3 {
    padding-left: 200px;
    padding-top: 80px;
    padding-bottom: 100px;
  }
  .block3b {
    padding-left: 60px;
    padding-top: 90px;
    padding-bottom: 100px;
  }
  .block6 {
    margin-left: 200px;
    margin-right: 200px;
    padding-top: 80px;
  }
  .promo-vid {
    height: 560px;
    padding-top: 20px;
  }
  @media (min-width: 1904px) {
    .block1 {
      padding-top: 200px;
      padding-left: 20%;
    }
    .promo-vid {
      height: 640px;
    }
    p {
      font-size: 24px;
    }
    h1 {
      font-size: 48px;
    }
    h2 {
      font-size: 36px;
    }
    .chair-demo {
      padding-top: 40px;
      padding-left: 100px;
      padding-right: 100px;
    }
    .demo {
      width: 700px;
    }
    .caption {
      font-size: 18px !important;
    }
    .model-viewer-container {
      height: 650px;
    }
  }
}
</style>
