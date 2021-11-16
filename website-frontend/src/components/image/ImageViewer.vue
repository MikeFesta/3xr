<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/image/ImageViewer.pug">
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import XrAddImg from '@/components/image/XrAddImg.vue';
import XrImageRollImg from '@/components/image/XrImageRollImg.vue';
import 'viewerjs/dist/viewer.css';
import { component as Viewer } from 'v-viewer';
import Image, { ImageInterface } from '@/store/interfaces/common/Image';

export default Vue.extend({
  name: 'image-viewer',
  components: {
    Viewer,
    XrImageRollImg,
    XrAddImg,
  },
  computed: {
    sliderSlotsCount(): number {
      return this.images.length + 1;
    },
    imageNamesAsStringArray(): string[] {
      let result = [];
      for (let i = 0; i < this.images.length; i++) {
        result.push(this.images[i].src);
      }
      return result;
    },
    selectedImage(): ImageInterface {
      if (this.loading) {
        return new Image(null);
      } else {
        if (this.images.length == 0) {
          return new Image(null);
        } else {
          return this.images[this.selectedImageIndex];
        }
      }
    },
  },
  data: function () {
    return {
      selectedImageIndex: 0,
      sliderStatus: null as any as number,
      viewer: null as any,
      viewerOptions: {
        backdrop: true,
        inline: true,
        button: true,
        navbar: false,
        title: this.showFilename,
        toolbar: {
          zoomIn: 1,
          zoomOut: 1,
          oneToOne: 1,
          reset: 1,
          prev: 1,
          play: 0,
          next: 1,
          rotateLeft: 0,
          rotateRight: 0,
          flipHorizontal: 0,
          flipVertical: 0,
        },
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: false,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true,
        zoomOnWheel: false,
      },
    };
  },
  methods: {
    getImageIndexBasedOnSlotPosition(position: number): number {
      // Note: this is here because of the Add Image button (xr-add-img), but should be refactored
      return position - 1;
    },
    select(): void {
      if (this.viewer != null) {
        this.viewer.view(this.selectedImageIndex);
      }
    },
    setImage(index: number): void {
      this.selectedImageIndex = index;
      if (this.sliderStatus != index) {
        this.sliderStatus = index;
      }
    },
    viewerInitialized(viewer: any): void {
      this.viewer = viewer;
      let setImage = this.setImage;
      viewer.element.addEventListener('viewed', function (this: any) {
        setImage(this.viewer.index);
      });
    },
  },
  props: {
    images: Array as PropType<Array<ImageInterface>>,
    loading: Boolean,
    showFilename: Boolean,
    showImageUploader: {
      type: Boolean,
      default: false,
    },
    showPrimaryImageStar: {
      type: Boolean,
      default: false,
    },
    showSecondaryImageStar: {
      type: Boolean,
      default: false,
    },
    showRemoveImage: {
      type: Boolean,
      default: false,
    },
    onChangeImage: {
      type: Function,
      default: (file: File[]) => {},
    },
    onClickImage: {
      type: Function,
      default: (image: any) => {},
    },
    onClickRemove: {
      type: Function,
      default: (image: any) => {},
    },
    onClickSecondaryStar: {
      type: Function,
      default: (image: any) => {},
    },
  },
});
</script>

<style lang="scss">
.img-fit {
  width: 100%;
}
.image-viewer-wrapper {
  text-align: center;
  width: 100%;
}
.hidden {
  display: none;
}
/** This cannot be scoped because it is editing an attribute of the image viewer */
.viewer-backdrop {
  background-color: #fff;
}
</style>
