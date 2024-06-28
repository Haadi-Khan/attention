import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

import React from "react";

const Home: React.FC = () => {
  const [activeWindow, setActiveWindow] = useState("");

  useEffect(() => {
    const unlisten = appWindow.listen("active-window-update", (event) => {
      console.log(event.payload);
      setActiveWindow(event.payload as string);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute w-full h-20">
        <h1 className="text-lg text-center">Attention</h1>
      </div>

      <div className="absolute h-full w-full m-10">
        <div>
          <div className="flex flex-col">
            <p className="text-primary">{activeWindow}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
