import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();
  const { openSlider, sliderType } = router.query;

  useEffect(() => {
    // Forward any query parameters to the home-page route
    if (openSlider && sliderType) {
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
