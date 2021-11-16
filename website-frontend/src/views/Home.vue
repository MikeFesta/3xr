<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/Home.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import VueScrollTo from 'vue-scrollto';

interface Frame {
  src: string;
}
interface Tab {
  name: string;
  icon: string;
  link: string;
  iframes: Frame[];
}
interface IHomeData {
  dialog: boolean;
  errorMessage: string;
  input: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    phone: string;
    message: string;
  };
  submitting: boolean;
  submitSuccess: boolean;
  tabs: Tab[];
  currentTab: number;
}
const initialTabs: Tab[] = [
  {
    name: 'Furniture',
    icon: 'mdi-table-furniture',
    link: 'furniture',
    iframes: [
      {
        src: 'https://www.3xr.com/embed.html?a=ahmn8g2qjbqg&autoload=true&bg=eff2f9&nologo=true',
      },
      {
        src: 'https://www.3xr.com/embed.html?a=5wbnarebnf2u&autoload=true&bg=eff2f9&nologo=true',
      },
      {
        src: 'https://www.3xr.com/embed.html?a=e4usttlaaqi8&autoload=true&bg=eff2f9&nologo=true',
      },
    ],
  },
  {
    name: 'Equipment',
    icon: 'mdi-bike',
    link: 'equipment',
    iframes: [
      {
        src: 'https://www.3xr.com/embed.html?a=ypavz6c69dav&autoload=true&bg=eff2f9&nologo=true',
      },
      {
        src: 'https://www.3xr.com/embed.html?a=ssv0569ri7az&autoload=true&bg=eff2f9&nologo=true',
      },
      {
        src: 'https://www.3xr.com/embed.html?a=puc1cqctwpke&autoload=true&bg=eff2f9&nologo=true',
      },
    ],
  },
  {
    name: 'Appliances',
    icon: 'mdi-coffee-maker',
    link: 'appliances',
    iframes: [
      {
        src: 'https://www.3xr.com/embed.html?a=sm94bkeiaxqi&autoload=true&bg=eff2f9&nologo=true',
      },
      {
        src: 'https://www.3xr.com/embed.html?a=cag1b5p05c9s&autoload=true&bg=eff2f9&nologo=true',
      },
      {
        src: 'https://www.3xr.com/embed.html?a=q6xtpm85xws0&autoload=true&bg=eff2f9&nologo=true',
      },
    ],
  },
  {
    name: 'Style',
    icon: 'mdi-purse',
    link: 'style',
    iframes: [
      {
        src: 'https://www.3xr.com/embed.html?a=kigwfw1sphho&autoload=true&bg=eff2f9&nologo=true',
      },
      {
        src: 'https://www.3xr.com/embed.html?a=8aely7noitqs&autoload=true&bg=eff2f9&nologo=true',
      },
      {
        src: 'https://www.3xr.com/embed.html?a=fwuii3v1vpb9&autoload=true&bg=eff2f9&nologo=true',
      },
    ],
  },
];

export default Vue.extend({
  name: 'home',
  metaInfo: {
    title: '3XR',
    meta: [
      {
        name: 'description',
        content: 'The 3XR platform provides endless opportunities to create amazing customer experiences.',
      },
      {
        name: 'keywords',
        content:
          '3XR, 360 spin products, AR platform, AR conversion, how to convert products to AR, convert images to AR, model conversion, products in AR, catalog in AR, make products 3D, easy AR, create augmented reality content, ar content, ar shopping, ar ecommerce, easy ar, 3d commerce, 3d modelling, affordable 3d models, view in room',
      },
      { property: 'og:image', content: 'https://cdn.3xr.com/images/fan-promo.jpg' },
    ],
  },
  components: {
    SpinnerButton,
  },
  data() {
    return {
      dialog: false,
      errorMessage: '',
      input: {
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        message: '',
      },
      submitting: false,
      submitSuccess: false,
      tabs: initialTabs,
      currentTab: 0,
    } as IHomeData;
  },
  computed: {
    shuffledTabs(): Tab[] {
      return this.shuffle(this.tabs);
    },
  },
  methods: {
    scrollTo: function (target: string) {
      var cancelScroll = VueScrollTo.scrollTo(target, 300, {
        container: 'body',
        easing: 'ease-in',
        offset: -60,
        force: true,
        cancelable: true,
        onStart: function (element) {
          // scrolling started
        },
        onDone: function (element) {
          // scrolling is done
        },
        onCancel: function () {
          // scrolling has been interrupted
        },
        x: false,
        y: true,
      });
    },
    submitInquireForm: function () {
      if (this.validateForm()) {
        this.submitting = true;
        backend
          .post('/contact_us', {
            firstName: this.input.firstName,
            lastName: this.input.lastName,
            email: this.input.email,
            phone: this.input.phone,
            company: this.input.company,
            message: this.input.message,
          })
          .then((result) => {
            this.submitting = false;
            if (result.data == 'success') {
              this.submitSuccess = true;
            } else {
              this.errorMessage = 'Sorry, there was an error. Please try again later.';
            }
          })
          .catch((err) => {
            this.errorMessage = err;
            this.submitting = false;
          });
      }
    },
    validateForm: function () {
      let firstName: HTMLInputElement = document.getElementById('firstName') as HTMLInputElement;
      if (!firstName.checkValidity()) {
        this.errorMessage = 'First Name is required';
        return false;
      }
      let lastName: HTMLInputElement = document.getElementById('lastName') as HTMLInputElement;
      if (!lastName.checkValidity()) {
        this.errorMessage = 'Last Name is required';
        return false;
      }
      let email: HTMLInputElement = document.getElementById('email') as HTMLInputElement;
      if (!email.checkValidity()) {
        this.errorMessage = 'Invalid Email';
        return false;
      }
      let message: HTMLInputElement = document.getElementById('message') as HTMLInputElement;
      if (!message.checkValidity()) {
        this.errorMessage = 'Please provide a message';
        return false;
      }
      return true;
    },
    shuffle(tabs: Tab[]) {
      return [...tabs].sort(() => Math.random() - 0.5);
    },
  },
  mounted() {
    const { tab } = this.$route.query;
    const selectedTabIdx = this.shuffledTabs.findIndex(({ link }) => link === tab);
    if (selectedTabIdx) {
      this.currentTab = selectedTabIdx;
    }
  },
});
</script>

<style lang="scss" scoped>
.bg-vid {
  width: 100%;
  object-fit: cover;
  height: 600px;
  top: 300px;
}
.home-vid {
  margin-top: -20px;
  margin-bottom: -20px;
}
.home-mobile {
  background-image: url('https://cdn.3xr.com/images/home/3XR-short.gif');
  background-size: cover;
  height: 250px;
  margin-top: -15px;
}
.banner-mobile {
  color: #fff;
  font-size: 22px;
  padding-top: 75px;
  padding-left: 20px;
  padding-right: 20px;
}
.reduce-pb {
  margin-bottom: -25px;
}
.intro-text {
  margin-top: -610px;
  padding-top: 250px;
  padding-bottom: 200px;
  color: #fff;
  position: relative;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.3);
  height: 603px;
}
.intro-header {
  z-index: 2 !important;
  text-transform: uppercase;
  padding-bottom: 15px;
}
.intro-tag {
  padding-bottom: 20px;
  padding-left: 10%;
  padding-right: 10%;
  font-size: 30px;
}
.xl-font {
  font-size: 40px;
}
.furniture-renders {
  background-color: #fafafa;
  background-image: url('https://cdn.3xr.com/images/FurnitureOnWhite_1k.jpg');
  background-position-x: right;
  background-position-y: top;
  height: 673px;
}
.home-card {
  margin-left: 10%;
  margin-right: 10%;
  padding: 5%;
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  min-height: 290px;
}
.home-card-title {
  color: #0b82c5;
  font-weight: bold;
  margin: 8px 0 12px 0;
  text-transform: capitalize;
}
.home-news-box {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5%;
}
.browser-text {
  font-weight: 500;
  padding-top: 15px;
}
.home-news {
  background-image: url('https://cdn.3xr.com/images/3xr-logo-ar_1k.jpg');
  background-size: cover;
  background-position-x: center;
  background-position-y: top;
}
.learn-more-button {
  color: #fff;
  min-height: 70px;
  margin-right: 10px;
  margin-left: 10px;
}
.material-renders {
  background-color: #323232;
  background-image: url('https://cdn.3xr.com/images/MaterialsRenderGray.jpg');
  background-position-x: left;
  background-position-y: top;
  height: 673px;
}
.section-blue {
  background-color: #0b82c5;
  color: #fff;
}
.section-gray {
  background-color: #323232;
  color: #fff;
}
.section-white {
  background-color: #fafafa;
  color: #000;
}
.rtl {
  direction: rtl;
}
.desktop {
  display: none;
}
.mobile {
  display: block;
}
.percent {
  font-size: 90px;
  padding-top: 5%;
  padding-bottom: 5%;
}
.increase {
  padding-top: 5%;
  padding-bottom: 5%;
}
@media (min-width: 960px) {
  .desktop {
    display: block;
  }
  .mobile {
    display: none;
  }
}
@media (min-width: 1500px) {
  .xl-font {
    font-size: 48px;
  }
  .bg-vid {
    height: 900px;
    top: 300px;
  }
  .intro-text {
    margin-top: -910px;
    padding-top: 250px;
    padding-bottom: 200px;
    color: #fff;
    position: relative;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.3);
    height: 903px;
  }
}
.tabs-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eff2f9;
}
</style>
