import {useState,useEffect, use} from "react";
import { useSelector,useDispatch } from "react-redux";
import { setopenSlider,setshowloader,setsliderData } from "@/redux/slices/urlslice";
import { useRouter } from "next/router";
function Navbarcomp() {
    const {loading,openSlider,sliderData} = useSelector(state => state.ui);
    const dispatch = useDispatch();
    const router = useRouter();
    const buttons = [
        {
            name: "Home",
            link: "/",
        },
        {
            name: "Plans",
            link: "/",
        },
        {
            name: "Asterisk IVR",
            link: "/asterik",
        },
        {
            name: "Sign Up",
            link: "/",
        },
        {
            name: "Sign In",
            link: "/",
        },
    ];
    function handleClick(e, item) {
        e.preventDefault();
        if(item.name === "Home"){
            router.push('/');
            return;
        }
        if(item.name === "Plans"){
            router.push('/plans');
            return;
        }
        if(item.name === "Asterisk IVR"){
            router.push('/asterik');
            return;
        }
        if(item.name === "My URLs"){
            router.push('/Myurls');
            return;
        }
        if(item.name === "Sign Up" || item.name === "Sign In"){
            // Redirect to the dedicated login page instead of opening slider
            router.push('/login');
            return;
            
            /* Original slider-based login functionality (commented out)
            // Check if already on home page
            if (router.pathname !== "/" && router.pathname !== "/home-page") {
                // Set up data for which slider to open after redirect
                dispatch(setsliderData(item.name));
                
                // Redirect to home page with a query parameter indicating to open slider
                router.push({
                    pathname: '/home-page',
                    query: { openSlider: 'true', sliderType: item.name }
                });
            } else {
                // If already on home page, just open the slider
                dispatch(setopenSlider(true));
                dispatch(setsliderData(item.name));
            }
            */
            return;
        }
        dispatch(setopenSlider(true));
        dispatch(setsliderData(item.name));
    }
    return (
        <div className="absolute right-12 top-4 w-[35.5rem] h-[3rem] bg-[#087da8] rounded-lg text-white flex items-center justify-center gap-1">
            
            {
                buttons.map((button, item) => {
                    return (
                        <button
                            key={item}
                            onClick={(e) => handleClick(e,button)}
                            className="font-montserrat font-medium h-full w-full text-white rounded-lg hover:bg-[#23a4c4] transition-colors duration-300 ease-in-out"
                        >
                            {button.name}
                        </button>
                    )
                })
            }
        </div>

    )
}

export default Navbarcomp;