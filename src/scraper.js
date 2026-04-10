import { Actor } from 'apify';
import { parseJobs } from './parser.js';
import { enrichJobs } from './aiEnrichment.js';

export async function scrapeJobs(input) {
    const {
        keywords = [],
        locations = ["India"],
        max_results = 20
    } = input;

    let allJobs = [];

    for (const keyword of keywords) {
        console.log(`Scraping jobs for: ${keyword}`);

        try {
            // ✅ Using correct working actor
            const run = await Actor.call("hKByXkMQaC5Qt9UMN", {
                query: keyword,
                location: locations[0],
                maxJobs: max_results
            });

            // ✅ Safe extraction
            const jobs = run?.dataset?.items || [];

            console.log(`Fetched ${jobs.length} jobs`);

            // 🔹 Parse jobs into your format
            const parsedJobs = parseJobs(jobs);

            allJobs.push(...parsedJobs);

        } catch (error) {
            console.error(`Error scraping for ${keyword}:`, error.message);
        }
    }

    console.log(`Total jobs scraped: ${allJobs.length}`);

    // 🔹 AI enrichment step
    const enrichedJobs = await enrichJobs(allJobs);

    return enrichedJobs;
}
