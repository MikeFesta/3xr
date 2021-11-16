<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/artist/resources/Help.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import VueScrollTo from 'vue-scrollto';

export default Vue.extend({
  name: 'help',
  metaInfo: {
    title: 'Help | 3XR',
  },
  created() {
    backend
      .get('/help/chapters')
      .then((result) => {
        this.chapters = result.data;
        let chapter = this.chapter ? parseInt(this.chapter) : 1;
        this.activeChapter = this.chapters[chapter - 1];
        this.panels = [chapter - 1];
      })
      .catch((err) => {});
  },
  watch: {
    chapter: function (newVal, oldVal) {
      this.activeChapter = this.chapters[newVal - 1];
      this.panels = [newVal - 1];
      this.editPage = false;
      this.$nextTick(() => {
        this.scrollTo('#section-' + this.section);
      });
    },
    section: function (newVal, oldVal) {
      this.$nextTick(() => {
        this.scrollTo('#section-' + newVal);
      });
    },
  },
  props: ['chapter', 'section'],
  data: function () {
    return {
      activeChapter: {
        id: 0,
        title: 'LOADING',
        sections: [{ id: 0, title: '', content: '', sortWeight: 0 }],
      },
      chapters: [],
      editHTML: false,
      editPage: false,
      newChanges: true,
      panels: [0],
      saving: false,
      scrolling: false,
    };
  },
  methods: {
    addNewSection: function () {
      let maxSortWeight = 0;
      for (let i = 0; i < this.activeChapter.sections.length; i++) {
        if (this.activeChapter.sections[i].sortWeight > maxSortWeight) {
          maxSortWeight = this.activeChapter.sections[i].sortWeight;
        }
      }
      this.activeChapter.sections.push({
        id: 0,
        title: 'New Section',
        content: 'New Content',
        sortWeight: maxSortWeight + 1,
      });
    },
    saveChanges: function (chapterSection: any) {
      this.saving = true;
      backend
        .post('/help/save_chapter_section', {
          chapterSectionId: chapterSection.id,
          title: chapterSection.title,
          content: chapterSection.content,
          chapterId: this.activeChapter.id,
          sortWeight: chapterSection.sortWeight,
        })
        .then((result) => {
          this.saving = false;
        })
        .catch((err) => {
          this.saving = false;
        });
    },
    scrollStart: function () {
      this.scrolling = true;
    },
    scrollEnd: function () {
      this.scrolling = false;
    },
    scrollTo: function (target: string) {
      if (!this.scrolling) {
        VueScrollTo.scrollTo(target, 300, {
          container: 'body',
          easing: 'ease-in',
          offset: -60,
          force: true,
          cancelable: true,
          onStart: this.scrollStart,
          onDone: this.scrollEnd,
          onCancel: this.scrollEnd,
          x: false,
          y: true,
        });
      }
    },
  },
});
</script>

<style lang="scss">
// Note: can't use scoped here because it won't get applied to v-html
.help-content img {
  height: auto;
  max-width: 100%;
}
.videoWrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  padding-top: 25px;
  height: 0;
}
.videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.help-section-spacer {
  margin-bottom: 60px;
}
.help-section-html-edit {
  background-color: #000;
  color: #fff;
  height: 100px;
  width: 100%;
}
</style>
