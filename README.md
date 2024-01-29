<p align='center'>
    <a href='https://www.digitalaidseattle.org'>
        <img src='https://avatars.githubusercontent.com/u/3466034?s=200&v=4' height='128'>
    </a>
    <h1 align='center'>Digital Aid Seattle/Seattle Humane Website</h1>
</p>
<p align='center'>
    <img alt="GitHub commit activity (main)" src="https://img.shields.io/github/commit-activity/m/openseattle/open-seattle-website/main">
</p>

## Introduction

Digital Aid Seattle aims to amplify community impact with technology by connecting organizations who need technical solutions with skilled volunteers.

People across thousands of Seattle civic and nonprofit organizations have dedicated their lives to making the world safer, more equitable, and more sustainable. This work is responsible for so much good in the world, and we owe them a huge debt of gratitude.

Unfortunately, many of these organizations lack access to digital tools that are vital to success in the modern age. Nonprofits struggle to create and scale their impact without the resources they need.

Just outside their doors is a fleet of experts and technologists with the talent, capacity, and drive to build.

Seattle is world-renowned as a hub for technology talent, full of motivated builders, designers, and creators that want to use their skills for good. Digital Aid Seattle is bringing these communities together to create a sum greater than its parts.

This website is for organizations that want to [learn more about partnering with Digital Aid Seattle](https://www.digitalaidseattle.org/partner) and for passionate, skilled Seattlites who want to [learn more about volunteering!](https://www.digitalaidseattle.org/volunteer)

## Technology Stack

The website is built using **Next.js**, a React-based framework for server-side rendering and static site generation. Learn more about Next.js [here](https://nextjs.org/docs/getting-started).

**Vercel** is used for deployment, providing a fast and scalable hosting environment for the website. Once a pull request is made, Vercel will automatically deploy a staged version of the website for final approval prior to deploying these changes to the public-facing website. Learn more about Vercel [here](https://vercel.com/docs).

## System Requirements

1. [Node.js](https://nodejs.org/en/)

## Local Environment Setup

1. Setup the frontend environment

   ```bash
   git clone https://github.com/openseattle/seattle-humane-app
   cd seattle-humane-app
   git checkout main
   npm install
   ```

2. Setup VSCode for auto formatting

- Install extensions: ESLint and Prettier
- Go to VSCode setting `Settings` > `Text Editor` > `Formatting` > `Format On Save`
- In the same setting window, look up `Default Formatter` and set to Prettier.

### Configure Environmental Variables

1. Create .env.local file:

   ```bash
   touch .env.local
   ```

2. Paste the following into this file and save:

   ```.env
   # Defaults, used by ./intro-template and can be deleted if the component is removed
   NEXT_PUBLIC_VERCEL_GIT_PROVIDER="github"
   NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG="template-nextjs-clean"
   ```

### Run locally

1. Start development server

   ```bash
   yarn dev
   ```

2. Open local instance in browser: <http://localhost:3000>. Note: Pages populated by Sanity.io will return 404 until Sanity is properly configured.

3. In order to work on Sanity components, request to be added to Sanity.io as an administrator, and then populate the respective fields in the .env.local file.

4. In order to work on Airtable forms, request access to Airtable and create a personal access token

5. In order to connect to supabase need to add these two environmental variables in your .env.local

   ```.env
   # You can find the values for these two variables in your settings > api from supabase dashboard.
   NEXT_PUBLIC_SUPABASE_URL="supabaseurl"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="supabase_anon_key"
   ```

