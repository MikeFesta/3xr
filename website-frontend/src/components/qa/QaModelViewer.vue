<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/qa/QaModelViewer.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { ModelViewerElement } from '@google/model-viewer/lib/model-viewer';
import store from '@/store/index';
import AssetSubmissionIssueHotspot from '@/store/interfaces/AssetSubmissionIssueHotspot';
import RabbitButton from '@/components/buttons/RabbitButton.vue';
import { SphericalPosition } from '@google/model-viewer/lib/features/controls';
import { USER_ROLE_TYPE } from '@/store/interfaces/types/UserRoleType';

export default Vue.extend({
  components: {
    ModelViewerElement,
    RabbitButton,
  } as any,
  computed: {
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
    isClient: () => store.getters.user.isClient,
    hotspotsOpen(): Array<any> {
      let hotspots = [];
      for (let i = 0; i < this.assetSubmission.openIssues.length; i++) {
        for (let h = 0; h < this.assetSubmission.openIssues[i].hotspots.length; h++) {
          let hotspot = this.assetSubmission.openIssues[i].hotspots[h];
          hotspot.issueId = this.assetSubmission.openIssues[i].id;
          if (!this.isClient || this.assetSubmission.openIssues[i].authorRoleId == USER_ROLE_TYPE.CLIENT) {
            // hide 3xr QA hotspots from client
            hotspots.push(hotspot);
          }
        }
      }
      return hotspots;
    },
    hotspotsResolved(): Array<any> {
      let hotspots = [];
      for (let i = 0; i < this.assetSubmission.resolvedIssues.length; i++) {
        for (let h = 0; h < this.assetSubmission.resolvedIssues[i].hotspots.length; h++) {
          let hotspot = this.assetSubmission.resolvedIssues[i].hotspots[h];
          hotspot.issueId = this.assetSubmission.resolvedIssues[i].id;
          hotspots.push(hotspot);
        }
      }
      return hotspots;
    },
    iosSrc(): string {
      return (
        'https://x.3xr.com/x/assets/' +
        this.uid +
        '/submissions/' +
        this.assetSubmission.submissionNumber +
        '/' +
        this.name +
        '.usdz'
      );
    },
    largeThumbnail(): string {
      return (
        'https://x.3xr.com/x/assets/' +
        this.uid +
        '/submissions/' +
        this.assetSubmission.submissionNumber +
        '/' +
        this.name +
        '-1k.png'
      );
    },
    src(): string {
      return (
        'https://x.3xr.com/x/assets/' +
        this.uid +
        '/submissions/' +
        this.assetSubmission.submissionNumber +
        '/' +
        this.name +
        '.glb'
      );
    },
    ...mapState({
      // this is in vuex so it can be passed across components (connected to QaSubmissionIssueForm)
      assetSubmissionIssueHotspots: (state: any) => state.assetSubmissionIssueHotspots,
    }),
  },
  data: () => ({
    filename: '',
    newHotspotCounter: 1,
  }),
  methods: {
    addHotspot: function (event: MouseEvent): void {
      if (this.assetSubmissionIssueHotspots.addingHotspot) {
        const viewer = this.$el.getElementsByTagName('model-viewer')[0] as ModelViewerElement;
        const rect = viewer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const positionAndNormal = viewer.positionAndNormalFromPoint(x, y);
        if (positionAndNormal) {
          const { position, normal } = positionAndNormal;
          let hotspot = new AssetSubmissionIssueHotspot({
            assetSubmissionIssueId: 0, // not created yet
            id: this.newHotspotCounter++,
            normal: normal.toString(),
            position: position.toString(),
          });
          store.dispatch.assetSubmissionIssueHotspots.addHotspot(hotspot);
          store.dispatch.assetSubmissionIssueHotspots.stopAdding();
          const overlay = this.$el as HTMLInputElement;
          if (overlay) {
            overlay.blur();
          }
        }
      }
    },
    cancelAddingHotspot(): void {
      store.dispatch.assetSubmissionIssueHotspots.stopAdding();
      const overlay = this.$el as HTMLInputElement;
      if (overlay) {
        overlay.blur();
      }
    },
    async saveImage(): Promise<void> {
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
    },
    imageRenderedFailureCallback(): void {
      store.dispatch.assetSubmission.refresh();
      // TODO: The rabbit message is being marked failed when it is working
      this.masterRenderCompleteCallback(this.filename);
    },
    imageRenderedSuccessCallback(): void {
      store.dispatch.assetSubmission.refresh();
      // Switch to 2D view and select the new render
      this.masterRenderCompleteCallback(this.filename);
    },
    renderMasterImageData(): object {
      const viewer = document.getElementById('viewer') as ModelViewerElement;
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
          assetUid: this.assetSubmission.asset.uid,
          filename: this.filename,
          name: this.assetSubmission.asset.name,
          phi: phi,
          radius: orbit.radius,
          submissionId: this.assetSubmission.id,
          submissionNumber: this.assetSubmission.submissionNumber,
          theta: theta,
        };
      }
    },
    selectHotspot(id: number): void {
      if (this.assetSubmissionIssueHotspots.assetSubmissionIssueId == id) {
        // If it is already selected, turn it off
        store.dispatch.assetSubmissionIssueHotspots.selectIssue(0);
      } else {
        store.dispatch.assetSubmissionIssueHotspots.selectIssue(id);
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
      this.filename = this.assetSubmission.asset.name + '-' + orbitX + '_' + orbitY + '.png';
    },
  },
  props: {
    assetSubmission: Object,
    hdr: String,
    name: String,
    masterRenderCompleteCallback: Function,
    showImageButtons: Boolean,
    uid: String,
  },
});
</script>

<style lang="scss">
/* Note that scopped does not work with styles for <model-viewer> */
.add-hotspot-text {
  background-color: #ff0;
  padding: 8px;
}
.annotation {
  background-color: #888888;
  position: absolute;
  transform: translate(10px, 10px);
  border-radius: 10px;
  padding: 10px;
  text-align: left;
}
.crosshair {
  cursor: crosshair;
}
.hotspot-new {
  background-color: yellow;
  border: none;
  border-radius: 50%;
  height: 20px;
  width: 20px;
}
.hotspot-open,
.hotspot-resolved {
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  padding: 3px;
  height: 20px;
  width: 20px;
}
.hotspot-open {
  background-image: url('https://cdn.3xr.com/images/error.png');
}
.hotspot-resolved {
  background-image: url('https://cdn.3xr.com/images/green-badge-checkmark.png');
}
.hotspots {
  margin-bottom: 4px;
}
.viewer-wrapper {
  position: relative;
  padding-bottom: 100%; /* 1:1 */
  height: 0;
}
.viewer-wrapper model-viewer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
model-viewer {
  height: 100%;
  width: 100%;
  --progress-mask: #2e2e2eff;
  --progress-bar-color: #0b82c5;
  --progress-bar-height: 5px;
}
.viewer-overlay {
  font-weight: bold;
  cursor: crosshair;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
