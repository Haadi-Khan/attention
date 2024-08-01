import { useState, useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";

import React from "react";
import Today from "./home/today";
import Upcoming from "./home/upcoming";
import QuickStart from "./home/quick_start";
import Monitor from "./home/monitor";

const Home: React.FC = () => {
  const [activeWindow, setActiveWindow] = useState("");
  const [shouldListen, setShouldListen] = useState(() => {
    const saved = localStorage.getItem("shouldListen");
    return saved === "true";
  });

  async function toggleListen() {
    setShouldListen(!shouldListen);
  }

  useEffect(() => {
    localStorage.setItem("shouldListen", shouldListen.toString());
    let unlisten: () => void | undefined;

    // triggers the rust backend for productivity tracking
    if (shouldListen) {
      (async () => {
        unlisten = await appWindow.listen("active-window-update", (event) => {
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
    <div className="relative p-10">
      <div className="w-full h-20 mb-10 text-center">
        <h1 className="text-2xl font-bold">Sessions</h1>
      </div>

      <div className="flex justify-between">
        <div className="w-1/2 p-4">
          <Today />
          <br />
          <Upcoming />
        </div>

        <div className="w-1/2 p-4">
          <Monitor shouldListen={shouldListen} toggleListen={toggleListen} />
          <br/>
          <QuickStart />
        </div>
      </div>
    </div>
  );
};

export default Home;