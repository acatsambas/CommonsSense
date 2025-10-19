
import { Bill } from '../types';

const RSS_URL = 'https://bills.parliament.uk/rss/allbills.rss';
// Using a CORS proxy to fetch the RSS feed from the browser
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`;

export const fetchBills = async (): Promise<Bill[]> => {
  const response = await fetch(PROXY_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  const items = Array.from(xmlDoc.querySelectorAll('item'));
  
  return items.map((item) => {
    const title = item.querySelector('title')?.textContent ?? 'No Title';
    const link = item.querySelector('link')?.textContent ?? '#';
    const guid = item.querySelector('guid')?.textContent ?? Math.random().toString();
    const pubDate = item.querySelector('pubDate')?.textContent ?? new Date().toUTCString();
    
    // The description contains HTML, so we parse it to get clean text
    const descriptionHtml = item.querySelector('description')?.textContent ?? '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = descriptionHtml;
    const description = tempDiv.textContent || tempDiv.innerText || '';

    return {
      id: guid,
      title,
      link,
      description: description.trim(),
      pubDate,
    };
  });
};
