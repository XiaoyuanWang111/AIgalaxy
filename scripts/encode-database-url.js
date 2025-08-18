#!/usr/bin/env node

/**
 * Database URL Encoder for Supabase/PostgreSQL
 * Handles all special characters in connection strings
 */

const originalUrl = 'postgresql://postgres.xjvnzhpgzdabxgkbxxwx:xT#Uxs7uB-FfTjD@aws-0-us-east-1.pooler.supabase.com:6543/postgres';

console.log('🔧 Database URL Encoder');
console.log('======================\n');

// Parse the URL components
const urlPattern = /^(postgresql|postgres):\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/(.+)$/;
const match = originalUrl.match(urlPattern);

if (!match) {
    console.error('❌ Invalid database URL format');
    process.exit(1);
}

const [, protocol, username, password, host, port, database] = match;

console.log('📊 Original URL Components:');
console.log(`Protocol: ${protocol}`);
console.log(`Username: ${username}`);
console.log(`Password: ${password}`);
console.log(`Host: ${host}`);
console.log(`Port: ${port}`);
console.log(`Database: ${database}`);
console.log('');

// Encode special characters in password
const encodedPassword = password
    .replace(/#/g, '%23')
    .replace(/@/g, '%40')
    .replace(/:/g, '%3A')
    .replace(/\//g, '%2F')
    .replace(/\?/g, '%3F')
    .replace(/&/g, '%26')
    .replace(/=/g, '%3D')
    .replace(/\+/g, '%2B')
    .replace(/\s/g, '%20');

console.log('🔒 Password Encoding:');
console.log(`Original: ${password}`);
console.log(`Encoded:  ${encodedPassword}`);
console.log('');

// Construct encoded URLs for different scenarios
const encodedUrls = {
    basic: `${protocol}://${username}:${encodedPassword}@${host}:${port}/${database}`,
    withPooler: `${protocol}://${username}:${encodedPassword}@${host}:${port}/${database}?pgbouncer=true&connection_limit=1`,
    withSSL: `${protocol}://${username}:${encodedPassword}@${host}:${port}/${database}?sslmode=require`,
    full: `${protocol}://${username}:${encodedPassword}@${host}:${port}/${database}?pgbouncer=true&connection_limit=1&sslmode=require`
};

console.log('✅ Encoded Database URLs:\n');
console.log('1️⃣ Basic (DATABASE_URL):');
console.log(encodedUrls.basic);
console.log('');

console.log('2️⃣ With Connection Pooler (Recommended for Vercel):');
console.log(encodedUrls.withPooler);
console.log('');

console.log('3️⃣ With SSL Mode:');
console.log(encodedUrls.withSSL);
console.log('');

console.log('4️⃣ Full Configuration:');
console.log(encodedUrls.full);
console.log('');

// Alternative encoding using encodeURIComponent
const fullyEncodedPassword = encodeURIComponent(password);
const alternativeUrl = `${protocol}://${username}:${fullyEncodedPassword}@${host}:${port}/${database}`;

console.log('🔄 Alternative (using encodeURIComponent):');
console.log(`Password: ${fullyEncodedPassword}`);
console.log(`URL: ${alternativeUrl}`);
console.log('');

// Vercel environment variable format
console.log('📝 For Vercel Environment Variables:');
console.log('Copy and paste this exactly (no quotes needed in Vercel UI):');
console.log('');
console.log('DATABASE_URL=');
console.log(encodedUrls.withPooler);
console.log('');

// Test decoding
console.log('🧪 Decode Test:');
const decodedPassword = decodeURIComponent(encodedPassword);
console.log(`Decoded password: ${decodedPassword}`);
console.log(`Matches original: ${decodedPassword === password}`);