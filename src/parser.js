export function parseJobs(jobs) {
    return jobs.map(job => ({
        job_title: job.title || job.job_title || '',
        company: job.company || '',
        location: job.location || '',
        description: job.description || '',
        source: job.source || 'Unknown',
        apply_link: job.url || job.link || ''
    }));
}
