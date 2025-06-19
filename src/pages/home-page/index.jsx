import { useEffect } from "react";
import Homecomponent from "@/components/Hero/Homecomponent";
import Navbar from "../../components/Navbarcomponent/Navbar";
import { useSelector, useDispatch } from "react-redux";
import Slider from "@/components/Slider/Slider";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/router";
import { setopenSlider, setsliderData } from "@/redux/slices/urlslice";

const Home = () => {
  const { loading, openSlider } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const router = useRouter();
  const { openSlider: shouldOpenSlider, sliderType } = router.query;

  useEffect(() => {
    if (openSlider) {
      document.body.classList.add("overflow-hidden"); // Disable scrolling
    } else {
      document.body.classList.remove("overflow-hidden"); // Enable scrolling
    }
  }, [openSlider]);

  // Handle opening slider based on URL query parameters
  useEffect(() => {
    if (shouldOpenSlider === 'true' && sliderType) {
      // Set the slider type (Sign In or Sign Up)
      dispatch(setsliderData(sliderType));
      
      // Open the slider
      dispatch(setopenSlider(true));
      
      // Clean up the URL to remove the query parameters
      router.replace('/home-page', undefined, { shallow: true });
    }
  }, [shouldOpenSlider, sliderType, dispatch, router]);

  return (
    <div className="relative">
      <Navbar />
      <Slider openSlider={openSlider} />

      {/* Blur overlay when openSlider is true */}
      {openSlider && (
        <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-20"></div>
      )}

      {/* Background Content */}
      <div className="scroll-smooth bg-[#031f39] h-[1020px] relative z-10">
        <Homecomponent />
        
      </div>
      <Footer />
    </div>
  );
};

export default Home;
