const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'https://alliedhealthjobs.au';
const PAGES_TO_CHECK = [
  '/',
  '/jobs',
  '/blog',
  '/resources',
  '/career-info',
  '/locations',
  '/employer',
  '/post-job',
  '/jobs/occupation/physiotherapy',
  '/jobs/occupation/occupational-therapy',
  '/jobs/occupation/speech-pathology',
  '/locations/nsw/sydney',
  '/locations/vic/melbourne',
  '/locations/qld/brisbane',
  '/locations/wa/perth',
  '/career-info/physiotherapist',
  '/career-info/occupational-therapist',
  '/career-info/speech-pathologist',
];

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Check if page has proper meta tags
function checkMetaTags(html, url) {
  const issues = [];
  
  // Check for title tag
  if (!html.includes('<title>')) {
    issues.push('Missing title tag');
  }
  
  // Check for meta description
  if (!html.includes('name="description"')) {
    issues.push('Missing meta description');
  }
  
  // Check for canonical tag
  if (!html.includes('rel="canonical"')) {
    issues.push('Missing canonical tag');
  }
  
  // Check for robots meta tag
  if (!html.includes('name="robots"')) {
    issues.push('Missing robots meta tag');
  }
  
  // Check for structured data
  if (!html.includes('application/ld+json')) {
    issues.push('Missing structured data');
  }
  
  return issues;
}

// Check if page returns proper status code
function checkStatusCode(statusCode, url) {
  if (statusCode === 200) {
    return 'OK';
  } else if (statusCode === 404) {
    return 'NOT_FOUND';
  } else if (statusCode >= 500) {
    return 'SERVER_ERROR';
  } else {
    return 'OTHER_ERROR';
  }
}

// Main function to check all pages
async function checkAllPages() {
  console.log('🔍 Checking SEO and indexing issues...\n');
  
  const results = [];
  
  for (const page of PAGES_TO_CHECK) {
    const url = BASE_URL + page;
    console.log(`Checking: ${url}`);
    
    try {
      const response = await makeRequest(url);
      const status = checkStatusCode(response.statusCode, url);
      const metaIssues = checkMetaTags(response.body, url);
      
      const result = {
        url,
        statusCode: response.statusCode,
        status,
        metaIssues,
        hasIssues: metaIssues.length > 0 || status !== 'OK'
      };
      
      results.push(result);
      
      if (result.hasIssues) {
        console.log(`❌ Issues found:`);
        console.log(`   Status: ${status} (${response.statusCode})`);
        if (metaIssues.length > 0) {
          console.log(`   Meta issues: ${metaIssues.join(', ')}`);
        }
      } else {
        console.log(`✅ OK`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results.push({
        url,
        statusCode: null,
        status: 'ERROR',
        metaIssues: ['Request failed'],
        hasIssues: true
      });
    }
    
    console.log('');
  }
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log('===========');
  
  const totalPages = results.length;
  const pagesWithIssues = results.filter(r => r.hasIssues).length;
  const pagesWithMetaIssues = results.filter(r => r.metaIssues.length > 0).length;
  const pagesWithStatusIssues = results.filter(r => r.status !== 'OK').length;
  
  console.log(`Total pages checked: ${totalPages}`);
  console.log(`Pages with issues: ${pagesWithIssues}`);
  console.log(`Pages with meta issues: ${pagesWithMetaIssues}`);
  console.log(`Pages with status issues: ${pagesWithStatusIssues}`);
  
  if (pagesWithIssues > 0) {
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('==================');
    
    if (pagesWithMetaIssues > 0) {
      console.log('1. Fix missing meta tags on pages with issues');
      console.log('2. Ensure all pages have proper canonical tags');
      console.log('3. Add structured data to all pages');
    }
    
    if (pagesWithStatusIssues > 0) {
      console.log('4. Fix pages returning non-200 status codes');
      console.log('5. Ensure proper error handling for dynamic routes');
    }
    
    console.log('6. Resubmit sitemap to Google Search Console');
    console.log('7. Request re-indexing of problematic pages');
  }
  
  return results;
}

// Run the check
if (require.main === module) {
  checkAllPages().catch(console.error);
}

module.exports = { checkAllPages }; 