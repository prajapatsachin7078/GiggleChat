import React from 'react'
import { Skeleton } from '../ui/skeleton';

function CurrentChatShimmer() {

    const arr = [1,2,3,4,5,6,7,8,9,10,11,12];
  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 bg-gray-100">
      {arr.map((item,index) => (
        <div key={index} className={`flex items-center space-x-4 ${index%2==0 ? "self-start flex gap-2 items-center"
                      : "self-end"} `}>
          {index%2==0  && <Skeleton className="h-12 w-12 rounded-full" />}
          <div className="space-y-2">
            <Skeleton className="h-8 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CurrentChatShimmer;