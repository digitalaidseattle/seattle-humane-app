/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '/seattle-humane' : '',
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '/seattle-humane' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '/seattle-humane/upload.php' : '/api/upload'
    }
};

module.exports = nextConfig;
