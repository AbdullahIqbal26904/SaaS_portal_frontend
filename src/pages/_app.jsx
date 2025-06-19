import { useEffect } from "react";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "@/redux/app/store";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { getAccessToken } from "@/utils/tokenPersistence";

export default function App({ Component, pageProps }) {
  // This runs client-side only
  useEffect(() => {
    // Check if we have an auth token, but no user profile
    const accessToken = getAccessToken();
    const state = store.getState();
    
    if (accessToken && !state.auth.user) {
      // If we have a token but no user data, fetch the profile
      store.dispatch(fetchUserProfile());
    }
  }, []);
  
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
