import "vuetify/styles";
import { createVuetify } from "vuetify";
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases: {
            mdi: {
                component: 'mdi',
            },
        },
    },
});

export default vuetify;

