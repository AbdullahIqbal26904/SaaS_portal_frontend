import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setopenSlider, setshowloader, setsliderData } from "@/redux/slices/urlslice";
import { loginUser, registerUser, clearError } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";

function Slider() {
  const { openSlider, loading, sliderData } = useSelector(state => state.ui);
  const { loading: authLoading, error: authError, isAuthenticated, user } = useSelector(state => state.auth);
  const [animate, setAnimate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const isMounted = useRef(true);

  // Prevent unexpected values in sliderData
  if (typeof sliderData !== "string") return null;

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.is_root_admin) {
        router.push('/rootAdminDashboard');
      } else if (user.is_reseller_admin) {
        router.push('/resellerAdmindashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    if (openSlider) {
      setTimeout(() => {
        if (isMounted.current) setAnimate(true);
      }, 10);
    } else {
      if (isMounted.current) setAnimate(false);
    }
  }, [openSlider]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (isAuthenticated && openSlider) {
      dispatch(setopenSlider(false));
      resetForm();
    }
  }, [isAuthenticated, dispatch, openSlider]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (authError) {
      setLoginError(
        authError.detail ||
        (typeof authError === 'string' ? authError : 'Authentication failed')
      );
    }
  }, [authError]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setLoginError("");
    dispatch(clearError());
  };

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(setopenSlider(false));
    resetForm();
  };

  const signupkholo = () => {
    dispatch(setopenSlider(false));
    dispatch(setsliderData("Sign Up"));
    resetForm();
    setTimeout(() => {
      dispatch(setopenSlider(true));
    }, 300);
  };

  const signinkholo = () => {
    dispatch(setopenSlider(false));
    dispatch(setsliderData("Sign In"));
    resetForm();
    setTimeout(() => {
      dispatch(setopenSlider(true));
    }, 300);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError("Please enter both email and password");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setLoginError("Please fill out all fields");
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  // Reusable Cross Button
  const CrossButton = () => (
    <div
      onClick={handleClick}
      className="w-10 mt-5 h-10 flex items-center justify-center cursor-pointer bg-gray-700 text-gray-300 rounded-md hover:text-white text-2xl"
    >
      ✖
    </div>
  );

  // Reusable Error Box
  const ErrorBox = () => (
    loginError && (
      <div className="w-[80%] mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
        {loginError}
      </div>
    )
  );

  // Render component based on sliderData
  switch (sliderData) {
    case "My URLs":
      return (
        <div className={`fixed top-0 right-0 w-full sm:w-[44%] h-full bg-white z-50 transform transition-transform duration-500 ${animate ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between w-full px-4">
            <p className="font-Montserrat font-bold text-2xl mt-4 flex-grow text-left">SaaS Portal</p>
            <CrossButton />
          </div>
          <hr className="border-t border-gray-300 w-full mt-10" />
        </div>
      );

    case "Sign Up":
      return (
        <div className={`fixed top-0 right-0 w-full sm:w-[35%] h-full bg-white z-50 transform transition-transform duration-500 ${animate ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-end w-full px-4">
            <CrossButton />
          </div>
          <hr className="border-t border-gray-300 w-full mt-5" />
          <form onSubmit={handleSignup} className="w-full h-full mt-5 flex flex-col items-center justify-start">
            <p className="font-bungee text-[#087da8] font-medium text-3xl">SaaS Portal</p>
            <p className="text-gray-600">Welcome to SaaS Portal</p>
            <ErrorBox />
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-[80%] mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-[80%] mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-[80%] mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" />
            <p className="w-[80%] mt-5 text-center text-s text-gray-900">
              By clicking on <span className="font-semibold">"Create Account"</span>, I agree to the
              <span className="text-[#087da8] cursor-pointer"> Terms of Service</span>,
              <span className="text-[#087da8] cursor-pointer"> Privacy Policy</span>, and
              <span className="text-[#087da8] cursor-pointer"> Use of Cookies</span>.
            </p>
            <button type="submit" disabled={authLoading} className="w-[80%] mt-5 p-2 bg-[#087da8] text-white font-semibold rounded-md hover:bg-[#065c81] transition flex items-center justify-center">
              {authLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : "Create Account"}
            </button>
            <p className="mt-4 text-s text-gray-600">Already a user? <span onClick={signinkholo} className="text-[#087da8] font-semibold cursor-pointer">Log In</span></p>
            <p className="mt-6 text-gray-600 text-sm">Or register via:</p>
          </form>
        </div>
      );

    case "Sign In":
      return (
        <div className={`fixed top-0 right-0 w-full sm:w-[35%] h-full bg-white z-50 transform transition-transform duration-500 ${animate ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-end w-full px-4">
            <CrossButton />
          </div>
          <hr className="border-t border-gray-300 w-full mt-5" />
          <form onSubmit={handleLogin} className="w-full h-full mt-5 flex flex-col items-center justify-start">
            <p className="font-bungee text-[#087da8] font-medium text-3xl">SaaS Portal</p>
            <p className="text-gray-600">Welcome to SaaS Portal</p>
            <ErrorBox />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-[80%] mt-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-[80%] mt-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" />
            <div className="flex items-center justify-between w-[80%] mt-7">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="hidden peer" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all">
                  {rememberMe && (
                    <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Remember Me</span>
              </label>
              <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
            </div>
            <button type="submit" disabled={authLoading} className="w-[80%] mt-8 p-2 bg-[#087da8] text-white font-semibold rounded-md hover:bg-[#065c81] transition flex items-center justify-center">
              {authLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : "Sign In"}
            </button>
            <p className="mt-4 text-s text-gray-600">Don't have an account? <span onClick={signupkholo} className="text-[#087da8] font-semibold cursor-pointer">Sign Up</span></p>
            <p className="mt-6 text-gray-600 text-sm">Or login via:</p>
          </form>
        </div>
      );

    default:
      return null;
  }
}

export default Slider;
