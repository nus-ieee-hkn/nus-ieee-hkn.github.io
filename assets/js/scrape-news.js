// Script to scrape NUS ECE news page and display HKN-related entries

(function() {
    'use strict';

    // Function to fetch and parse news from local cde_ref.html file
    async function fetchHKNNews() {
        try {
            const localFileUrl = '/cde_ref.html';
            const newsUrl = 'https://cde.nus.edu.sg/ece/highlights/news/';
            
            console.log('[API Request] Starting fetch from local file:', localFileUrl);
            
            // Fetch from local file (no CORS proxy needed for same-origin requests)
            const response = await fetch(localFileUrl);
            console.log('[API Request] Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const htmlContent = await response.text();
            console.log('[API Request] Successfully fetched HTML content from cde_ref.html');
            console.log('[API Request] Response HTML (first 500 chars):', htmlContent.substring(0, 500));
            console.log('[API Request] Total HTML content length:', htmlContent.length, 'characters');
            
            // Parse the HTML content
            console.log('[HKN Extraction] Parsing HTML content...');
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // Find all news entries - structure: <ul class="ws-news-list"><li><div class="ws-news-content">...
            const newsItems = doc.querySelectorAll('li .ws-news-content, .ws-news-content');
            console.log('[HKN Extraction] Found', newsItems.length, 'total news items');
            
            const hknNews = [];
            const seenTitles = new Set();
            let processedCount = 0;
            
            // Iterate through news items and find those with "HKN" in description
            newsItems.forEach((item, index) => {
                processedCount++;
                
                // Extract title from .content-title h3
                const titleEl = item.querySelector('.content-title h3');
                const title = titleEl ? titleEl.textContent.trim() : '';
                
                // Extract description from .content-text p
                const descEl = item.querySelector('.content-text p');
                const description = descEl ? descEl.textContent.trim() : '';
                
                // Extract link from .content-container a
                const linkEl = item.querySelector('.content-container a');
                const link = linkEl ? (linkEl.href || linkEl.getAttribute('href')) : '';
                
                // Extract date from .content-date span
                const dateEl = item.querySelector('.content-date span');
                const date = dateEl ? dateEl.textContent.trim() : '';
                
                // Extract image from .content-image .news-image img or .news-image img
                const imgEl = item.querySelector('.content-image .news-image img, .news-image img');
                const imageUrl = imgEl ? (imgEl.src || imgEl.getAttribute('src')) : '';
                
                console.log(`[HKN Extraction] Item ${index + 1}:`, {
                    title: title.substring(0, 50) + (title.length > 50 ? '...' : ''),
                    description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
                    link: link,
                    date: date,
                    imageUrl: imageUrl
                });
                
                // Check if description contains "HKN" (case insensitive)
                const fullText = (title + ' ' + description).toUpperCase();
                const containsHKN = fullText.includes('HKN');
                
                console.log(`[HKN Extraction] Item ${index + 1} - Contains HKN:`, containsHKN);
                
                if (containsHKN && title && !seenTitles.has(title)) {
                    seenTitles.add(title);
                    const newsItem = {
                        title: title,
                        description: description.length > 300 ? description.substring(0, 300) + '...' : description,
                        link: link ? (link.startsWith('http') ? link : 'https://cde.nus.edu.sg' + link) : newsUrl,
                        date: date,
                        imageUrl: imageUrl
                    };
                    hknNews.push(newsItem);
                    console.log(`[HKN Extraction] ✓ Added HKN news item:`, newsItem);
                } else if (seenTitles.has(title)) {
                    console.log(`[HKN Extraction] Item ${index + 1} - Skipped (duplicate title)`);
                }
            });
            
            console.log('[HKN Extraction] Processing complete. Processed', processedCount, 'items');
            console.log('[HKN Extraction] Found', hknNews.length, 'HKN-related news items:');
            console.log('[HKN Extraction] Final HKN news array:', hknNews);
            
            // Display the news items
            displayHKNNews(hknNews);
            
        } catch (error) {
            console.error('[API Request] Error fetching HKN news:', error);
            console.error('[API Request] Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            displayError('Unable to load news at this time. Please check your internet connection and try again later.');
        }
    }
    
    // Function to display HKN news items
    function displayHKNNews(newsItems) {
        const newsSection = document.querySelector('#news .inner');
        if (!newsSection) return;
        
        // Get or create the existing news container
        let container = newsSection.querySelector('#hkn-news-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'hkn-news-container';
            container.style.width = '100%';
            newsSection.appendChild(container);
        } else {
            // Clear existing contents
            container.innerHTML = '';
            // Ensure styles are set
            container.style.width = '100%';
        }
        
        if (newsItems.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No HKN-related news found at this time.</p>';
            return;
        }
        
        // Create vertical list container
        const newsList = document.createElement('div');
        newsList.style.display = 'flex';
        newsList.style.flexDirection = 'column';
        newsList.style.gap = '20px';
        newsList.style.width = '100%';
        
        newsItems.forEach((item, index) => {
            // Create clickable card container
            const card = document.createElement('a');
            card.href = item.link;
            card.target = '_blank';
            card.rel = 'noopener';
            card.style.display = 'flex';
            card.style.flexDirection = 'row';
            card.style.alignItems = 'stretch';
            card.style.gap = '0';
            card.style.padding = '0';
            card.style.border = '1px solid #ddd';
            card.style.borderRadius = '8px';
            card.style.backgroundColor = '#fff';
            card.style.textDecoration = 'none';
            card.style.color = '#000';
            card.style.transition = 'all 0.3s ease';
            card.style.cursor = 'pointer';
            card.style.width = '100%';
            card.style.boxSizing = 'border-box';
            card.style.overflow = 'hidden';
            
            // Hover effect
            card.onmouseenter = function() {
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                this.style.transform = 'translateY(-2px)';
            };
            card.onmouseleave = function() {
                this.style.boxShadow = 'none';
                this.style.transform = 'translateY(0)';
            };
            
            // Image container (left side) - fills to corners
            const imageContainer = document.createElement('div');
            imageContainer.style.flexShrink = '0';
            imageContainer.style.width = '300px';
            imageContainer.style.minHeight = '100%';
            imageContainer.style.overflow = 'hidden';
            imageContainer.style.borderRadius = '0';
            imageContainer.style.backgroundColor = '#f0f0f0';
            imageContainer.style.alignSelf = 'stretch';
            
            const image = document.createElement('img');
            image.src = item.imageUrl || '';
            image.alt = item.title || 'News image';
            image.style.width = '100%';
            image.style.height = '100%';
            image.style.objectFit = 'cover';
            image.style.display = item.imageUrl ? 'block' : 'none';
            
            // Fallback if no image
            if (!item.imageUrl) {
                imageContainer.style.display = 'flex';
                imageContainer.style.alignItems = 'center';
                imageContainer.style.justifyContent = 'center';
                imageContainer.style.backgroundColor = '#e0e0e0';
                const placeholder = document.createElement('div');
                placeholder.textContent = 'No Image';
                placeholder.style.color = '#999';
                placeholder.style.fontSize = '14px';
                imageContainer.appendChild(placeholder);
            } else {
                imageContainer.appendChild(image);
            }
            
            // Text container (right side)
            const textContainer = document.createElement('div');
            textContainer.style.flex = '1';
            textContainer.style.display = 'flex';
            textContainer.style.flexDirection = 'column';
            textContainer.style.gap = '10px';
            textContainer.style.color = '#000';
            textContainer.style.padding = '20px';
            
            // Title
            const title = document.createElement('h3');
            title.textContent = item.title || '';
            title.style.margin = '0';
            title.style.padding = '0';
            title.style.color = '#000';
            title.style.fontSize = '1.2em';
            title.style.fontWeight = 'bold';
            
            // Description
            const description = document.createElement('p');
            description.textContent = item.description || '';
            description.style.margin = '0';
            description.style.padding = '0';
            description.style.color = '#000';
            description.style.fontSize = '0.95em';
            description.style.lineHeight = '1.5';
            
            // Date
            if (item.date) {
                const date = document.createElement('p');
                date.textContent = item.date;
                date.style.margin = '0';
                date.style.padding = '0';
                date.style.color = '#666';
                date.style.fontSize = '0.85em';
                textContainer.appendChild(date);
            }
            
            textContainer.appendChild(title);
            textContainer.appendChild(description);
            
            // Assemble card
            card.appendChild(imageContainer);
            card.appendChild(textContainer);
            
            newsList.appendChild(card);
        });
        
        container.appendChild(newsList);
    }
    
    // Function to display error message
    function displayError(message) {
        const newsSection = document.querySelector('#news .inner');
        if (!newsSection) return;
        
        // Get or create the existing news container
        let container = newsSection.querySelector('#hkn-news-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'hkn-news-container';
            newsSection.appendChild(container);
        } else {
            // Clear existing contents
            container.innerHTML = '';
        }
        
        container.innerHTML = '<p style="text-align: center; color: #d32f2f;">' + message + '</p>';
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchHKNNews);
    } else {
        fetchHKNNews();
    }
})();

