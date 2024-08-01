import React from "react";

const Today = () => {
  return (
    <div className="rounded-lg border-2 border-neutral p-4">
      <h2 className="text-xl mb-4">Today's Sessions</h2>

      <div className="relative w-1/2">
        <div className="p-4">
          {/* TODO: Pull from local database storage and build the day's sessions */}
          {/* The div template below is what they should look like */}
          <div className="flex justify-between">
            <div className="p-2">
              <h1 className="text-lg">Session 1</h1>
              <p>Time: 1hr 30min</p>
            </div>
            <div className="p-2">
              {/* <button className="bg-primary p-2 rounded-full">View</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Today;
