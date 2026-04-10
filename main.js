import { Actor } from 'apify';
import { scrapeJobs } from './src/scraper.js';

await Actor.init();

const input = await Actor.getInput();

const jobs = await scrapeJobs(input);

await Actor.pushData(jobs);

await Actor.exit();
