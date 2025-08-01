#!/usr/bin/env node

/**
 * SEO Setup Verification Script
 * Run this script to verify your SEO setup is working correctly
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://alliedhealthjobs.au';

// Test URLs to check
const testUrls = [
  '/',
  '/jobs',
  '/blog',
  '/resources',
  '/career-info',
  '/locations',
  '/employer',
  '/post-job',
  '/sitemap.xml',
  '/robots.txt'
];

// Blog posts to test
const blogPosts = [
  '/blog/how-to-write-winning-allied-health-resume-2025',
  '/blog/allied-health-salary-guide-australia-2025',
  '/blog/top-10-allied-health-jobs-high-demand-2025',
  '/blog/physiotherapy-career-guide-australia-2025'
];

// Location pages to test
const locationPages = [
  '/locations/nsw/sydney',
  '/locations/vic/melbourne',
  '/locations/qld/brisbane',
  '/locations/wa/perth'
];

// Job category pages to test
const categoryPages = [
  '/jobs/occupation/physiotherapy',
  '/jobs/occupation/occupational-therapy',
  '/jobs/occupation/speech-pathology',
  '/jobs/occupation/psychology'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const fullUrl = `${BASE_URL}${url}`;
    const client = fullUrl.startsWith('https') ? https : http;
    
    const req = client.get(fullUrl, (res) => {
      resolve({
        url: fullUrl,
        status: res.statusCode,
        success: res.statusCode >= 200 && res.statusCode < 400
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url: fullUrl,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url: fullUrl,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

async function checkSitemap() {
  try {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    const text = await response.text();
    
    // Count URLs in sitemap
    const urlMatches = text.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    
    return {
      success: response.ok,
      status: response.status,
      urlCount,
      hasSitemap: text.includes('<?xml version="1.0" encoding="UTF-8"?>'),
      hasUrlset: text.includes('<urlset')
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function checkRobotsTxt() {
  try {
    const response = await fetch(`${BASE_URL}/robots.txt`);
    const text = await response.text();
    
    return {
      success: response.ok,
      status: response.status,
      hasSitemap: text.includes('Sitemap:'),
      hasUserAgent: text.includes('User-agent:'),
      hasDisallow: text.includes('Disallow:'),
      hasAllow: text.includes('Allow:')
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🔍 SEO Setup Verification\n');
  console.log('Testing website:', BASE_URL);
  console.log('='.repeat(50));
  
  // Test basic pages
  console.log('\n📄 Testing Basic Pages:');
  const basicResults = await Promise.all(testUrls.map(checkUrl));
  basicResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.status}`);
  });
  
  // Test blog posts
  console.log('\n📝 Testing Blog Posts:');
  const blogResults = await Promise.all(blogPosts.map(checkUrl));
  blogResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.status}`);
  });
  
  // Test location pages
  console.log('\n📍 Testing Location Pages:');
  const locationResults = await Promise.all(locationPages.map(checkUrl));
  locationResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.status}`);
  });
  
  // Test category pages
  console.log('\n🏷️ Testing Category Pages:');
  const categoryResults = await Promise.all(categoryPages.map(checkUrl));
  categoryResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.status}`);
  });
  
  // Test sitemap
  console.log('\n🗺️ Testing Sitemap:');
  const sitemapResult = await checkSitemap();
  if (sitemapResult.success) {
    console.log(`✅ Sitemap accessible - ${sitemapResult.urlCount} URLs found`);
    console.log(`   Has XML declaration: ${sitemapResult.hasSitemap ? '✅' : '❌'}`);
    console.log(`   Has urlset: ${sitemapResult.hasUrlset ? '✅' : '❌'}`);
  } else {
    console.log(`❌ Sitemap error: ${sitemapResult.error}`);
  }
  
  // Test robots.txt
  console.log('\n🤖 Testing Robots.txt:');
  const robotsResult = await checkRobotsTxt();
  if (robotsResult.success) {
    console.log(`✅ Robots.txt accessible`);
    console.log(`   Has sitemap reference: ${robotsResult.hasSitemap ? '✅' : '❌'}`);
    console.log(`   Has user-agent: ${robotsResult.hasUserAgent ? '✅' : '❌'}`);
    console.log(`   Has disallow rules: ${robotsResult.hasDisallow ? '✅' : '❌'}`);
    console.log(`   Has allow rules: ${robotsResult.hasAllow ? '✅' : '❌'}`);
  } else {
    console.log(`❌ Robots.txt error: ${robotsResult.error}`);
  }
  
  // Summary
  console.log('\n📊 Summary:');
  const allResults = [...basicResults, ...blogResults, ...locationResults, ...categoryResults];
  const successful = allResults.filter(r => r.success).length;
  const total = allResults.length;
  
  console.log(`Total pages tested: ${total}`);
  console.log(`Successful responses: ${successful}`);
  console.log(`Success rate: ${((successful / total) * 100).toFixed(1)}%`);
  
  if (successful === total) {
    console.log('\n🎉 All tests passed! Your SEO setup looks good.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Set up Google Search Console');
  console.log('2. Submit your sitemap to search engines');
  console.log('3. Set up Google Analytics');
  console.log('4. Monitor your indexing progress');
}

// Run the tests
runTests().catch(console.error); 