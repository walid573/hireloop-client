import { getJobs } from '@/lib/api/jobs';
import React from 'react';

const page = async ({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
    const search = await searchParams;
    const urlSearch = new URLSearchParams(search as Record<string, string>).toString();
    const qurey = urlSearch.toString();
    const jobs = await getJobs(qurey);
    
    return (
        <div>
            <h2>Browse Jobs</h2>
            <ul>
                {jobs.map((job) => (
                    <li key={job._id}>
                        <h3>{job.title}</h3>   
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default page;