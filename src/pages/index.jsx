import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();
  const { openSlider, sliderType } = router.query;

  useEffect(() => {
    // If login redirect requested, go to the login page
    if (openSlider && (sliderType === "Sign In" || sliderType === "Sign Up")) {
      router.push('/login');
    }
    // Otherwise, forward any query parameters to the home-page route
    else if (openSlider && sliderType) {
      router.push({
        pathname: '/home-page',
        query: { openSlider, sliderType }
      });
    } else {
      router.push('/home-page');
    }
  }, [router, openSlider, sliderType]);

  return null;
}
