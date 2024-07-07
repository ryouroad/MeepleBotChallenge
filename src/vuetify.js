import "vuetify/styles";
import { createVuetify } from "vuetify";
import '@mdi/font/css/materialdesignicons.css';
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

