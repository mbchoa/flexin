import React from 'react';

interface Props {
  currentDay: number;
}

const ProgressGrid = ({ currentDay }: Props) => {
  return (
    <div className="grid gap-1 grid-cols-7">
      {[...new Array(30)].map((_, index) => {
        let color = 'bg-gray-300';
        if (index < currentDay) {
          color = 'bg-green-400';
        }
        if (index === currentDay) {
          color = 'bg-green-300 animate-pulse';
        }
        return <div className={`h-0 pb-[100%] ${color}`} key={index} />;
      })}
    </div>
  );
};

export default ProgressGrid;
