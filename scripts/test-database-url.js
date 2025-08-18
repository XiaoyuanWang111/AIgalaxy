#!/usr/bin/env node

/**
 * Test Database URL locally before deploying to Vercel
 */

// Test URL - replace with your actual DATABASE_URL
const testUrl = process.argv[2] || 'postgresql://postgres.xjvnzhpgzdabxgkbxxwx:xT%23Uxs7uB-FfTjD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1';

console.log('🧪 Testing Database URL');
console.log('======================\n');

// Test 1: Basic format check
console.log('1️⃣ Format Check:');
const formatValid = testUrl.startsWith('postgresql://') || testUrl.startsWith('postgres://');
console.log(`   Starts with postgresql://: ${formatValid ? '✅' : '❌'}`);

// Test 2: Character analysis
console.log('\n2️⃣ Character Analysis:');
const hasUnencodedHash = testUrl.includes('#') && !testUrl.includes('%23');
const hasSpace = testUrl.includes(' ');
const hasNewline = testUrl.includes('\n') || testUrl.includes('\r');
const hasTab = testUrl.includes('\t');

console.log(`   Unencoded # symbol: ${hasUnencodedHash ? '❌ Found' : '✅ None'}`);
console.log(`   Spaces: ${hasSpace ? '❌ Found' : '✅ None'}`);
console.log(`   Line breaks: ${hasNewline ? '❌ Found' : '✅ None'}`);
console.log(`   Tabs: ${hasTab ? '❌ Found' : '✅ None'}`);

// Test 3: URL parsing
console.log('\n3️⃣ URL Parsing:');
try {
    // Replace postgresql:// with https:// for URL parsing
    const parseUrl = testUrl.replace(/^postgresql:\/\//, 'https://').replace(/^postgres:\/\//, 'https://');
    const parsed = new URL(parseUrl);
    
    console.log(`   ✅ URL is parseable`);
    console.log(`   Protocol: ${testUrl.startsWith('postgresql://') ? 'postgresql' : 'postgres'}`);
    console.log(`   Username: ${parsed.username}`);
    console.log(`   Password: ${parsed.password ? '***' + parsed.password.slice(-3) : 'None'}`);
    console.log(`   Host: ${parsed.hostname}`);
    console.log(`   Port: ${parsed.port}`);
    console.log(`   Database: ${parsed.pathname.slice(1)}`);
    console.log(`   Query params: ${parsed.search || 'None'}`);
} catch (error) {
    console.log(`   ❌ Failed to parse URL: ${error.message}`);
}

// Test 4: Prisma compatibility
console.log('\n4️⃣ Prisma Compatibility:');
try {
    // Set environment variable temporarily
    process.env.DATABASE_URL = testUrl;
    
    // Try to load Prisma
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: testUrl
            }
        }
    });
    
    console.log('   ✅ Prisma can load with this URL');
} catch (error) {
    console.log(`   ❌ Prisma error: ${error.message}`);
    if (error.message.includes('invalid domain character')) {
        console.log('   💡 This usually means there are hidden characters in the URL');
    }
    if (error.message.includes('invalid port number')) {
        console.log('   💡 Check for unencoded special characters in the password');
    }
}

// Test 5: Recommendations
console.log('\n5️⃣ Recommendations:');
const issues = [];

if (hasUnencodedHash) issues.push('Encode # as %23');
if (hasSpace) issues.push('Remove all spaces');
if (hasNewline) issues.push('Remove line breaks');
if (hasTab) issues.push('Remove tabs');
if (!formatValid) issues.push('URL must start with postgresql://');

if (issues.length === 0) {
    console.log('   ✅ URL looks good!');
    console.log('   Copy this exact value to Vercel:');
    console.log(`\n   ${testUrl}\n`);
} else {
    console.log('   ❌ Issues found:');
    issues.forEach(issue => console.log(`      - ${issue}`));
}

// Test 6: Encoded URL suggestion
if (hasUnencodedHash || testUrl.includes('#')) {
    console.log('\n6️⃣ Suggested Encoded URL:');
    const encoded = testUrl.replace(/#/g, '%23');
    console.log(`   ${encoded}`);
}