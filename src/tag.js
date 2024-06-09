import { useState, useGtag } from 'vue-gtag-next';

const { property } = useState();
const { event } = useGtag()

export const enableUserTracking = (userId) => {
//   console.log("enableUserTracking:", property.value);
  property.value = {
    id: process.env.VUE_APP_GTAG_ID,
    params: {
      user_id: userId,
    }
  };
  event('login', {'user_id':userId})
//   console.log("enableUserTracking:", property.value);
};

export const disableUserTracking = () => {
//   console.log("disableUserTracking:", property.value);
  event('logout', {'user_id':property.value.params?.userId})
  property.value = {
    id: process.env.VUE_APP_GTAG_ID,
    params: {
      user_id: null,
    }
  };
//   console.log("disableUserTracking:", property.value);
};
