import CircleLoader from "react-spinners/ScaleLoader";

const Loading = ({height}) => {
  return (
    <div className={`w-full h-${height} flex justify-center items-center`}>
      <CircleLoader
        color="#00BF63"
        loading={true}
        size={70}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default Loading
