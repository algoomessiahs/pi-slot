
import React from "react";

const BackgroundEffects: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute top-0 left-0 w-full h-full bg-pi-pattern bg-repeat opacity-10"></div>
      <div className="absolute top-[15%] -left-[10%] w-[300px] h-[300px] bg-[#9b87f5] rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute top-[40%] -right-[10%] w-[350px] h-[350px] bg-[#7E69AB] rounded-full blur-[180px] opacity-20"></div>
      <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-[#FFDB58] rounded-full blur-[200px] opacity-20"></div>
    </div>
  );
};

export default BackgroundEffects;
