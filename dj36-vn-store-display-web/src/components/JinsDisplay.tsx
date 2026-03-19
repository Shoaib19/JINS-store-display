import TimeDisplay from "./common/TimeDisplay";
import jinsDiplay from "../../src/assets/images/jins-display.svg"

function JinsDisplay() {
 
  return (
    <div className=" flex h-screen relative justify-center items-center 2xl:p-12 p-6 select-none">

    <div className="p-3 3xl:p-6 w-full h-full">
    <div className="relative h-full flex flex-col justify-center">
          <TimeDisplay textColor="text-black"/>
        <div className="flex h-full justify-center items-center">
          <img src={jinsDiplay} alt="jins display" height={'125px'} width={'400px'} />
        </div>
    </div>
    </div>
  </div>
  
  );
}

export default JinsDisplay;
