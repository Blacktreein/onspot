import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleAuthImg from "../components/AuthComponents/GoogleAuthImg";
import { setCookie } from "../utils/Cookies";

import { ClipLoader } from "react-spinners";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { LoggedInContext, UserContext } from "../main";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { vkyreq } from "../utils/vkyreq";
import Logo from '../assets/logo_w.png'

function Signin() {
  // importing all environment variables
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const backend  = import.meta.env.VITE_BACKEND_URL;
  const JWTexpireIn = import.meta.env.VITE_JWT_EXPIRES_IN;

  const navigate = useNavigate();

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setLoggedin } = useContext(LoggedInContext);

  const {setUserData} = useContext(UserContext);

  const sendLogin = async (userData) => {
    try {
        setLoading(true);
      const res = await axios.post(backend + "/auth/login", userData);
      console.log(res.data.token);
      
      setCookie("jwt", res.data.token, JWTexpireIn || 90);
      setLoggedin(true);
      const userDetailInfo = await vkyreq('get', '/users/me');
      setUserData(userDetailInfo.data.data)

      navigate("/");

    } catch (error) {
      console.log(error);
    }finally{
        setLoading(false);
    }
  };

  // to update the userInfo
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  // to check if the state is updated in google oauth or not...
  const [updated, setUpdated] = useState(false);

  //  // Step 2: Create a state variable
  //  const [isChecked, setIsChecked] = useState(false);

  //  // Step 3: Update the state variable when the checkbox is clicked
  //  const handleCheckboxChange = (event) => {
  //    setIsChecked(event.target.checked);
  //  };
 
  // to send the data is
  useEffect(() => {
    const checkerFunc = () => {
      if (updated) {
        sendLogin(userInfo);
        setUpdated(false);
      }
    };

    checkerFunc();
  }, [updated]);
  useEffect(() => {
    if (userInfo.email.length > 0 && userInfo.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [userInfo]);

  return (
    <section className=" bg-black h-screen w-full  ">
    <div
      className={`flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0`}
    >

      <div className="w-full bg-black rounded-lg  border-2 border-gray-500  md:mt-0 sm:max-w-md xl:p-0">
      <a
        href="/login"
        className="flex items-center mb-6 pt-5  text-2xl justify-center font-semibold text-[#d3d9d4] dark:text-white"
      >
        
        <img src= {Logo} alt="logo" height="30"/>
        <span className="pt-2 font-semibold text-[#d3d9d4]"></span>
       
      </a>
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-[#d3d9d4]">
            Sign in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" action={sendLogin}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-white dark:text-[#d3d9d4]"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value = {userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                className="bg-gray-600 border border-gray-300 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder placeholder:text-white dark:text-white dark:focus:ring-[#124e66] dark:focus:border-[#124e66]"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white dark:text-[#d3d9d4]"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, password: e.target.value })
                }
                placeholder="••••••••"
                className="bg-gray-600 border border-white text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full placeholder:text-white p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-[#d3d9d4] dark:focus:ring-[#124e66] dark:focus:border-[#124e66]"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border  border-gray-300 rounded  focus:ring-3 focus:ring-primary-300  bg-secondary dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-white dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-white hover:underline dark:text-primary-500"
              >
                Forgot password?
              </a>
            </div>
            <button
              onClick={sendLogin}
              disabled={buttonDisabled}
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
               {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Sign in"}
            </button>
            <div className="flex items-center justify-center">
              <div><span className="text-sm  text-center font-light text-gray-500 dark:text-gray-400">or</span></div>
            </div>
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleAuthImg
                updatingUserInfo={setUserInfo}
                trackUserInfo={setUpdated}
                className="w-full  text-white bg-red-[#124E66] hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300  rounded-lg font-semibold text-sm px-5 py-2.5 text-center dark:bg-[#124E66] dark:hover:bg-red-700 dark:focus:ring-red-800"
              />
            </GoogleOAuthProvider>
    
            <p className="text-sm font-light text-white dark:text-gray-400">
              Don’t have an account yet?{" "}
              <Link
                to="/signup"
                className="font-bold text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
  );
}

export default Signin;
