import React from "react";

const Monitor: React.FC<{
  shouldListen: boolean;
  toggleListen: () => void;
}> = ({ shouldListen, toggleListen }) => {
  return (
    <div className="rounded-lg border-2 border-neutral p-4">
      <span className="w-full">
        <h2 className="text-xl mb-4">Monitoring</h2>
        Monitoring is {shouldListen ? "on" : "off"}
        <button
          className="mx-3 bg-primary p-2 rounded-full"
          onClick={toggleListen}
        >
          {shouldListen ? "Stop" : "Start"} Monitoring
        </button>
      </span>
    </div>
  );
};

export default Monitor;
