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

        // 🔹 1. LinkedIn
        const linkedinJobs = await scrapeLinkedIn(keyword, locations[0], max_results);

        // 🔹 2. Indeed
        const indeedJobs = await scrapeIndeed(keyword, locations[0]);

        // 🔹 3. Naukri
        const naukriJobs = await scrapeNaukri(keyword);

        allJobs.push(...linkedinJobs, ...indeedJobs, ...naukriJobs);
    }

    console.log(`Total jobs scraped: ${allJobs.length}`);

    const parsedJobs = parseJobs(allJobs);
    const enrichedJobs = await enrichJobs(parsedJobs);

    return enrichedJobs;
}
