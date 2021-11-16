// SPDX-License-Identifier: Apache-2.0
import Vue from 'vue';
import Vuetify, {
  VApp,
  VAutocomplete,
  VBadge,
  VBtn,
  VCard,
  VCardActions,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VCheckbox,
  VCol,
  VColorPicker,
  VCombobox,
  VContainer,
  VDataTable,
  VDialog,
  VDivider,
  VExpansionPanel,
  VExpansionPanelContent,
  VExpansionPanelHeader,
  VFileInput,
  VFooter,
  VForm,
  VHover,
  VIcon,
  VImg,
  VList,
  VListItem,
  VListItemAvatar,
  VListItemContent,
  VListItemIcon,
  VListItemTitle,
  VMain,
  VMenu,
  VNavigationDrawer,
  VProgressCircular,
  VProgressLinear,
  VRow,
  VSelect,
  VSimpleTable,
  VSlideItem,
  VSlideGroup,
  VSlider,
  VSpacer,
  VSwitch,
  VTabs,
  VTab,
  VTabItem,
  VTextarea,
  VTextField,
  VTooltip,
} from 'vuetify/lib';

export const vuetifyComponents = {
  VApp,
  VAutocomplete,
  VBadge, // 1 use in notification center
  VBtn,
  VCard,
  VCardActions,
  VCardSubtitle, // 2 uses, product card and user card
  VCardText,
  VCardTitle,
  VCheckbox,
  VCol,
  VColorPicker, // 1 use in NewMaterial.pug
  VCombobox, // 1 use purchase order form <-- this is what I want to use in more places
  VContainer,
  VDataTable,
  VDialog,
  VDivider,
  VExpansionPanel,
  VExpansionPanelContent,
  VExpansionPanelHeader,
  VFileInput,
  VFooter, // 1 use in App.pug
  VForm,
  VHover, // 1 use in SingleNotification.pug
  VIcon,
  VImg, // 3 uses - App.pug, XrImage.pug, ProductCard.pug
  VList,
  VListItem,
  VListItemAvatar, // 1 use in App.pug
  VListItemContent, // 1 use in App.pug
  VListItemIcon, // 1 use in App.pug
  VListItemTitle,
  VMain,
  VMenu,
  VNavigationDrawer, // 1 use in App.pug
  VProgressCircular,
  VProgressLinear,
  VRow,
  VSelect,
  VSimpleTable, // 1 use in Notifications.pug
  VSlideItem, // 1 use in ImageViewer.pug
  VSlideGroup, // 1 use in ImageViewer.pug
  VSlider, // 1 use in NewMaterial.pug
  VSpacer,
  VSwitch, // 3 uses in ArtistAccount.pug, ClientAccount.pug, ProductReview.pug
  VTabs,
  VTab,
  VTabItem, // 2 uses in Home.pug and HelpAndFaq.pug
  VTextarea,
  VTextField,
  VTooltip,
};

Vue.use(Vuetify, { components: { ...vuetifyComponents } });

// Note: Keep /src/store/interfaces/ColorSet.ts in sync with /src/styles/variables.scss
// It would be great to have a single source of truth, but there are some performance considerations
// https://stackoverflow.com/questions/57536228/export-sass-scss-variables-to-javascript-without-exporting-them-to-css
// https://vuetifyjs.com/en/customization/sass-variables/
// Another option would be to use vuetify color pack (https://vuetifyjs.com/en/styles/colors/)
import ColorSet from '@/store/interfaces/ColorSet';
const colors = new ColorSet('default');

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.blue,
        secondary: colors.orange,
        accent: colors.lightBlue,
        error: colors.orange,
        warning: colors.red,
        info: colors.darkBlue,
        success: colors.orange,
        anchor: colors.blue,
        blue: colors.blue,
        light_blue: colors.lightBlue,
        orange: colors.orange,
        white: colors.white,
        dark_blue: colors.darkBlue,
        red: colors.red,
        dark_gray: colors.darkGray,
        light_gray: colors.lightGray,
        green: colors.green,
        purple: colors.purple,
      },
      dark: {
        primary: colors.lightBlue,
        secondary: colors.orange,
        accent: colors.orange,
        error: colors.red,
        warning: colors.red,
        info: colors.darkBlue,
        success: colors.orange,
        anchor: colors.lightBlue,
        blue: colors.blue,
        light_blue: colors.lightBlue,
        orange: colors.orange,
        white: colors.white,
        dark_blue: colors.darkBlue,
        red: colors.red,
        dark_gray: colors.darkGray,
        light_gray: colors.gray,
        green: colors.green,
        purple: colors.purple,
      },
    },
  },
});
