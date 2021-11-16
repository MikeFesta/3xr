<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./XrModelViewer.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { ModelViewerElement } from '@google/model-viewer/lib/model-viewer';
import { SphericalPosition } from '@google/model-viewer/lib/features/controls';
import store from '@/store/index';
import RabbitButton from '@/components/buttons/RabbitButton.vue';

interface SpinData {
  assetUid: string;
  name: string;
  phi: number;
  radius: number;
}

interface ImageData extends SpinData {
  theta: number;
  filename: string;
  lineDraw: boolean;
}

export default Vue.extend({
  // TODO: Merge this with QaModelViewer
  components: {
    ModelViewerElement,
    RabbitButton,
  } as any,
  computed: {
    cameraOrbit(): string {
      if (this.rotateOnScroll) {
        return 'calc(30deg - env(window-scroll-y) * 60deg) 75deg 100%';
      } else {
        return '';
      }
    },
    environmentImage(): string {
      let hdrName = this.hdr || 'custom_3xr_v2';
      if (hdrName == 'bw_lebombo') {
        // Need to keep old products looking as they did originally
        // Use the old QA lighting for products with this hdr
        // Moving away from this because QA viewer did not match web viewer
        // TODO: rename data in the DB to a different hdr name like 'legacy'
        hdrName = 'custom_3xr_v2';
      }
      // Adding www_ to the names to prevent caching bug where CORS blocks
      // cached hdr files from different sub-domains (www. vs view.)
      // Currently need to maintain a copy of the hdrs with the www_ prefix
      return 'https://cdn.3xr.com/images/hdr/www_' + hdrName + '_1k.hdr';
    },
    exposure(): string {
      if (this.hdr == 'bw_lebombo') {
        // Legacy info: bw_lebombo was the default asset.hdr value
        // Old QA lighting was 1.25 with custom_3xr_v2
        return '1.25';
      } else {
        // 0.8 matches view.3xr.com
        return '0.8';
      }
    },
    iosSrc(): string {
      return 'https://cdn.3xr.com/models/' + this.uid + '/' + this.name + '.usdz';
    },
    src(): string {
      return 'https://cdn.3xr.com/models/' + this.uid + '/' + this.name + '.glb';
    },
  },
  data: () => ({
    filename: '',
    mounted: false,
  }),
  mounted() {
    this.$nextTick(() => {
      this.mounted = true;
    });
  },
  methods: {
    async saveImage(): Promise<void> {
      if (window.confirm('Download a screenshot image from the viewer with a transparent background?')) {
        let posterUrl = '';
        const viewer = this.$el.getElementsByTagName('model-viewer')[0] as ModelViewerElement;
        const orbit = viewer.getCameraOrbit();
        this.setFilenameForOrbit(orbit);
        viewer.fieldOfView = 'auto';
        viewer.jumpCameraToGoal();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        URL.revokeObjectURL(posterUrl);
        const blob = await viewer.toBlob({
          mimeType: 'image/png',
          idealAspect: true,
        });
        posterUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = posterUrl;
        a.download = this.filename;
        a.click();
      }
    },
    imageRenderedFailureCallback(): void {
      store.dispatch.asset.refresh();
      // TODO: The rabbit message is being marked failed when it is working
      this.renderCompleteCallback(this.filename);
    },
    imageRenderedSuccessCallback(): void {
      store.dispatch.asset.refresh();
      // Switch to 2D view and select the new render
      this.renderCompleteCallback(this.filename);
    },
    render360SpinData(): SpinData | { [K in any]: never } {
      const viewer = this.$el.getElementsByTagName('model-viewer')[0] as ModelViewerElement;
      if (!viewer) {
        return {};
      } else {
        const orbit = viewer.getCameraOrbit();
        let phi = orbit.phi - Math.PI / 2;
        if (phi < 0) {
          // Convert negative angles to positive
          phi = phi + 2 * Math.PI;
        }
        return {
          assetUid: this.uid,
          name: this.name,
          phi: phi,
          radius: orbit.radius,
        };
      }
    },
    render360SpinFailureCallback(): void {
      // For now, both success and failure refreshes the asset
      this.spinSetCompleteCallback();
    },
    render360SpinSuccessCallback(): void {
      this.spinSetCompleteCallback();
    },
    renderImageData(): ImageData | { [K in any]: never } {
      // TODO: Error Code 500 on rabbit button click (still works though)
      const viewer = this.$el.getElementsByTagName('model-viewer')[0] as ModelViewerElement;
      if (!viewer) {
        return {};
      } else {
        const orbit = viewer.getCameraOrbit();
        this.setFilenameForOrbit(orbit);
        // Invert theta so x rotation is clockwise from front
        let theta = 0 - orbit.theta;
        if (theta < 0) {
          // Convert negative angles to positive
          theta = theta + 2 * Math.PI;
        }
        let phi = orbit.phi - Math.PI / 2;
        if (phi < 0) {
          // Convert negative angles to positive
          phi = phi + 2 * Math.PI;
        }
        return {
          assetUid: this.uid,
          filename: this.filename,
          name: this.name,
          phi: phi,
          radius: orbit.radius,
          theta: theta,
          lineDraw: false, // Disabled for now - TODO: add a checkbox for this feature
        };
      }
    },
    setFilenameForOrbit(orbit: SphericalPosition): void {
      let theta = 0 - orbit.theta;
      if (theta < 0) {
        // Convert negative angles to positive
        theta = theta + 2 * Math.PI;
      }
      let phi = orbit.phi - Math.PI / 2;
      if (phi < 0) {
        // Convert negative angles to positive
        phi = phi + 2 * Math.PI;
      }
      const orbitX = Math.floor((theta * 180) / Math.PI);
      const orbitY = Math.floor((phi * 180) / Math.PI);
      this.filename = this.name + '-' + orbitX + '_' + orbitY + '.png';
    },
  },
  props: {
    hdr: String,
    loading: Boolean,
    name: String,
    renderCompleteCallback: Function,
    rotateOnScroll: Boolean,
    spinSetCompleteCallback: Function,
    showImageButtons: Boolean,
    uid: String,
  },
});
</script>

<style lang="scss" scoped>
/* (more styles are in QaModelViewer) */
.full-width,
.model-image {
  display: block;
  width: 100%;
}
.model-viewer-container {
  display: block;
  width: 100%;
  text-align: left;
  height: 450px;
  position: relative;
}
model-viewer {
  height: 100%;
  width: 100%;
  --progress-mask: #2e2e2eff;
  --progress-bar-color: #0b82c5;
  --progress-bar-height: 5px;
}
</style>
