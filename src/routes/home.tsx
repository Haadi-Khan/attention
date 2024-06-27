import { useState } from "react";
import reactLogo from "../assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
export default function Home() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (

  <div className="relative">
    <div className="absolute w-full h-10">
      <h1 className="text-">

      </h1>
    </div>

    <div className="absolute h-full w-full m-10">
      <div>
        <div className="flex flex-col">

          <form
            className="flex flex-row pt-5 gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              greet();
            }}
          >
            <input
              id="greet-input"
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Enter a name..."
            />
            <button type="submit">Greet</button>
          </form>

          <p className="text-primary">{greetMsg}</p>
        </div>
      </div>
    </div>
  </div>
  );
}
