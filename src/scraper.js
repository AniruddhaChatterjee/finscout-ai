import { Actor } from 'apify';
import { parseJobs } from './parser.js';
import { enrichJobs } from './aiEnrichment.js';

export async function scrapeJobs(input) {
    const { keywords = [], locations = ["India"], max_results = 50 } = input;

    let allJobs = [];

    // 🔹 Loop through keywords
    for (const keyword of keywords) {
        console.log(`Scraping jobs for: ${keyword}`);

        // Call Apify LinkedIn Jobs Scraper
        const run = await Actor.call("apify/linkedin-jobs", {
            keywords: keyword,
            location: locations[0],
            maxItems: max_results
        });

        const jobs = run.dataset?.items || [];

        // 🔹 Optional parsing layer (clean structure)
        const parsedJobs = parseJobs(jobs);

        allJobs.push(...parsedJobs);
    }

    console.log(`Total jobs scraped: ${allJobs.length}`);

    // 🔹 AI Enrichment
    const enrichedJobs = await enrichJobs(allJobs);

    return enrichedJobs;
}
