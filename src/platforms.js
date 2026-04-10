import { Actor } from 'apify';
import axios from 'axios';
import * as cheerio from 'cheerio';

// 🔹 LinkedIn (Apify Actor)
export async function scrapeLinkedIn(keyword, location, max_results) {
    const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;

    const run = await Actor.call("hKByXkMQaC5Qt9UMN", {
        urls: [url],
        maxItems: max_results
    });

    return run?.dataset?.items || [];
}

// 🔹 Indeed
export async function scrapeIndeed(keyword, location) {
    try {
        const url = `https://in.indeed.com/jobs?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let jobs = [];

        $('.job_seen_beacon').each((i, el) => {
            jobs.push({
                title: $(el).find('h2').text(),
                company: $(el).find('.companyName').text(),
                location: $(el).find('.companyLocation').text(),
                source: 'Indeed'
            });
        });

        return jobs;

    } catch (err) {
        console.error("Indeed error:", err.message);
        return [];
    }
}

// 🔹 ZipRecruiter
export async function scrapeZipRecruiter(keyword, location) {
    try {
        const url = `https://www.ziprecruiter.com/jobs-search?search=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let jobs = [];

        $('.job_content').each((i, el) => {
            jobs.push({
                title: $(el).find('.job_title').text(),
                company: $(el).find('.hiring_company').text(),
                location,
                source: 'ZipRecruiter'
            });
        });

        return jobs;

    } catch (err) {
        console.error("ZipRecruiter error:", err.message);
        return [];
    }
}

// 🔹 SimplyHired
export async function scrapeSimplyHired(keyword, location) {
    try {
        const url = `https://www.simplyhired.com/search?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let jobs = [];

        $('.SerpJob-jobCard').each((i, el) => {
            jobs.push({
                title: $(el).find('.jobposting-title').text(),
                company: $(el).find('.jobposting-company').text(),
                location,
                source: 'SimplyHired'
            });
        });

        return jobs;

    } catch (err) {
        console.error("SimplyHired error:", err.message);
        return [];
    }
}

// 🔹 BuiltIn
export async function scrapeBuiltIn(keyword) {
    try {
        const url = `https://builtin.com/jobs?search=${encodeURIComponent(keyword)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let jobs = [];

        $('.job-card').each((i, el) => {
            jobs.push({
                title: $(el).find('h2').text(),
                company: $(el).find('.company-name').text(),
                location: 'Mumbai',
                source: 'BuiltIn'
            });
        });

        return jobs;

    } catch (err) {
        console.error("BuiltIn error:", err.message);
        return [];
    }
}
