import React from "react";
import { ImSpinner } from "react-icons/im";

const Button = ({ name, width, loading }) => {
  return (
    <button
    type="submit"
      disabled={loading}
      className={`w-${
        width ? `${width}` : "full"
      }  py-2 flex justify-center mx-auto border border-transparent items-center gap-2 px-5 rounded text-center bg-primary ${
        loading ? "bg-opacity-60" : "bg-opacity-95"
      } text-white hover:bg-transparent hover:border hover:border-green-500 hover:text-green-500 transition-all duration-300`}
    >
      {loading ? (
        <>
          <ImSpinner className="animate-spin size-5" /> {name}
        </>
      ) : (
        `${name}`
      )}
    </button>
  );
};

export default Button;
