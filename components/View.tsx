
import React from 'react';
import Ping from './Ping';
import { client } from '@/sanity/lib/client';
import { STARTUP_VIEWS_QUERY } from '@/sanity/lib/queries';
import { after } from "next/server";
import { writeClient } from '@/sanity/lib/write';

const View = async ({ id }: { id: string }) => {
    const { view: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

    after (async () => 
          await writeClient
            .patch(id)
            .set({ view: totalViews + 1 })
            .commit(),
      );

  return (
    <div className='view-container'>
        <div className="absolute -top-2 -right-2">
            <Ping />
        </div>

        <p className="view-text">
            <span className="font-black">
                View: {totalViews}            
            </span>
        </p>
    </div>
  )
}

export default View