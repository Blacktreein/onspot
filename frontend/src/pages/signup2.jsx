import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleAuthImg from "../components/AuthComponents/GoogleAuthImg";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useContext, useEffect, useState } from "react";
import { setCookie } from "../utils/Cookies";
import { useNavigate } from "react-router-dom";
import { LoggedInContext, UserContext } from "../main";
import { vkyreq } from "../utils/vkyreq";
import Logo from '../assets/logo_w.png'
import { Link } from "react-router-dom";
import './sign.css'
function Signup() {
  // importing env variables
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const backend = import.meta.env.VITE_BACKEND_URL;
  const JWTexpireIn = import.meta.env.VITE_JWT_EXPIRES_IN;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {setLoggedin} = useContext(LoggedInContext);

  const {setUserData} = useContext(UserContext);

  // sending signup request to backend
  const setSignupRequest = async (userData) =>{
    setLoading(true);
    try {
      const res = await axios.post(backend+'/auth/signup', userData);
      console.log(res.data.token);
      setCookie("jwt", res.data.token, JWTexpireIn || 90);
      setLoggedin(true);
      const userDetailInfo = await vkyreq('get', '/users/me');
      setUserData(userDetailInfo.data.data)
      navigate('/');

    } catch (error) {
      console.log(error);
    }finally{
        setLoading(false)
    }
  }

  
  // state to track changes made in fields of username password and email...
  const [userinfo, setUserInfo] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    img: "" // check what is the name of image in googleoauth response
  })
  

  // to check if the state is updated in google oauth or not...
  const [updated, setUpdated] = useState(false);

  useEffect(()=>{
    const checkerFunc = ()=>{
      if (updated){
        setSignupRequest(userinfo);
        setUpdated(false);
      }
    }

    checkerFunc();
  }, [updated])
  useEffect(() => {
    if (userinfo.email.length > 0 && userinfo.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [userinfo]);

  return (
    <section className={`bg-black h-screen bg-cover bg-center`}>
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

      <div className="w-full bg-black  border-2 border-gray-500 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#2e3944] dark:border-[#124E66]">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <a
        href="#"
        className="flex items-center mb-6 text-2xl justify-center font-semibold text-[#d3d9d4] dark:text-white"
      >
        <img src={Logo} alt="logo" height="30"/>
        <span className="pt-2 font-semibold text-[#d3d9d4]"></span>
      </a>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-[#D3D9D4]">
            Create an account
          </h1>
          <form className="space-y-4 md:space-y-6" action={setSignupRequest}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-white dark:text-[#D3D9D4]"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={userinfo.email}
                onChange={(e) => setUserInfo({ ...userinfo, email: e.target.value })}
                className="bg-gray-600 border border-gray-300 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder placeholder:text-[#d3d9d4] dark:text-white dark:focus:ring-[#124e66] dark:focus:border-[#124e66]"
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
                value={userinfo.password}
                onChange={(e) =>
                  setUserInfo({ ...userinfo, password: e.target.value })
                }
                placeholder="••••••••"
                className="bg-gray-600 border border-gray-300 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder placeholder:text-[#d3d9d4] dark:text-white dark:focus:ring-[#124e66] dark:focus:border-[#124e66]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-white dark:text-white"
              >
                Username
              </label>
              <input
                type="username"
                name="username"
                id="username"
                value={userinfo.username}
                onChange={(e) =>
                  setUserInfo({ ...userinfo, username: e.target.value })
                }
                placeholder="leafy"
                className="bg-gray-600 border border-gray-300 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder placeholder:text-[#d3d9d4] dark:text-white dark:focus:ring-[#124e66] dark:focus:border-[#124e66]"
                required
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="terms"
                  className="font-light text-gray-500 dark:text-gray-300"
                >
                  I accept the{" "}
                  <a
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <button
              onClick={setSignupRequest}
              disabled={buttonDisabled}
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
            {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Sign in"}
            </button>
            <GoogleOAuthProvider
              clientId={clientId}
            >
              <GoogleAuthImg updatingUserInfo={setUserInfo} trackUserInfo={setUpdated}/>
            </GoogleOAuthProvider>
            <p className="text-sm font-light text-white dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-primary-600 hover:underline dark:text-primary-500"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
  );
}

export default Signup;