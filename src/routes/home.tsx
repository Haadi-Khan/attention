import { useState, useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";

import React from "react";

const Home: React.FC = () => {
  const [activeWindow, setActiveWindow] = useState("");
  const [shouldListen, setShouldListen] = useState(() => {
    const saved = localStorage.getItem("shouldListen");
    return saved === "true";
  });

  async function toggleListen() {
    setShouldListen(!shouldListen);
    console.log(shouldListen);
  }

  useEffect(() => {
    localStorage.setItem("shouldListen", shouldListen.toString());
    let unlisten: () => void | undefined;

    if (shouldListen) {
      (async () => {
        unlisten = await appWindow.listen("active-window-update", (event) => {
          console.log(event.payload);
          setActiveWindow(event.payload as string);
        });
      })();
    }

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [shouldListen]);

  return (
    <div className="relative">
      <div className="absolute w-full h-20">
        <h1 className="text-lg text-center">Attention</h1>
      </div>

      <div className="absolute h-full w-full m-10">
        <div>
          <button className="bg-primary p-2 rounded-lg" onClick={toggleListen}>
            Toggle Listening
          </button>
          <div className="flex flex-col">
            <p className="text-primary">{activeWindow}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
