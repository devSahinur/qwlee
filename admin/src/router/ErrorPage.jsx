import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

 
const ErrorPage = () => {
    return (
       
        <div className="flex justify-center mt-36 items-center w-[1200px] mx-auto">
         
         <Link to = '/'
         className="text-2xl bg-slate-300 px-5 py-2"
         >
         
          <button className="flex items-center"> <FaArrowLeft /> back</button>
         </Link>
          
               <img src="https://atlassianblog.wpengine.com/wp-content/uploads/2017/12/screen-shot-2017-11-16-at-3.50.20-pm-1.png" alt="" />
        
        </div>
    );
};

export default ErrorPage;