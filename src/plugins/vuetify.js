
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme: {
        dark: false,
        colors: {
          primary: '#1976D2',
          // ... 다른 색상 설정 ...
        },
        typography: {
          fontFamily: 'Noto Sans KR, sans-serif', // 폰트 설정
          fontWeightBold: 700, 
        },
      },
      // ... 필요에 따라 다른 테마 설정 추가
    },
  },
  icons: { // icons 설정 추가
    defaultSet: 'mdi', // 기본 아이콘 세트를 mdi로 설정
},
});

export default vuetify; // vuetify 인스턴스 export