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

**Supabase** is used for Postgres database services and authentication with Google accounts via OAuth. 


## System Requirements

1. [Node.js](https://nodejs.org/en/)
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Local Environment Setup

1. Setup the frontend environment

   ```bash
   git clone https://github.com/openseattle/seattle-humane-app
   cd seattle-humane-app
   git checkout main
   npm install
   ```

2. Setup VSCode for auto-formatting

- Install extensions: ESLint
- Go to VSCode setting `Settings` > `Text Editor` > `Formatting` > `Format On Save`

### Configure Environmental Variables
Local requires a few one-time steps. You will need to create a Google OAuth ID, put information about it into your .env.local file, start Supabase, put values from Supabase into your .env.local file, and then finally start the web app.

1. Create a copy of .env.local.example

   ```bash
   cp .env.local.example .env.local
   ```
1. Open the .env.local file in VSCode. You will need to put values in this file after the next step, so keep it open.
1. #### Create a Google OAuth ID
    Follow the [Configuration Steps provided by Supabase](https://supabase.com/docs/guides/auth/social-login/auth-google#configuration-web). 
    
    During setup, instead of providing a production URI like `https://<project-id>.supabase.co/auth/v1/callback`, provide the local development URI present in the .env.local.exmaple file: `http://localhost:54321/auth/v1/callback`.

    Also, note the Supabase instructions list the Consent Screen configuration as step 2, but it's likely Google will prompt you to complete the OAuth Consent Screen setup **before** allowing you to create the Credentials. When creating the OAuth Consent Screen you do **not** need to specify any Authorized domains, but you will need to select the scopes as mentioned.

    When you create the new Credentials, choose *OAuth Client ID* and for Application type choose *Web application* per the Supabase instructions. Add `http://localhost:54321` under the *Authorized JavaScript origins* and add `http://localhost:54321/auth/v1/callback` under *Authorized redirect URIs*.

    The next screen is important, don't close it. 
    
    Copy the *Client ID* shown and paste it after `SUPABASE_AUTH_GOOGLE_CLIENT_ID=` in your .env.local file.
    Do the same for the *Client secret*. Double-check you pasted the values correctly. Then save your .env.local file. 

    You can now close the `OAuth Client Created` popup. You can also close the entire window/tab as we are done with it now (though you may need to open it back up to troubleshoot if you did something wrong in the steps above). 

1. Load the values from the env file into the environment by running:
    ```bash
      source .env.local
    ```

1. Start Supabase locally. First, ensure you have NodeJS and Docket Desktop installed, then run: 
   ```bash 
   npx supabase start
   ```

    Enter "y" when/if asked to install the Supabase package.

    Give it a moment to spin up the containers. When it's finished, it will display URLs and keys that need to go into your local environment file. You already have the URL set in your .env.local, so just add the displayed anon key after the `NEXT_PUBLIC_SUPABASE_ANON_KEY=` variable in the .env.local file. Double-check you copied the value correctly then save the file.

    (These steps are derived from the [Original Supabase instructions here](https://supabase.com/docs/guides/cli/local-development#start-supabase-services))

1. Start development server
   ```bash
   yarn dev
   ```

1. Open local instance in browser: <http://localhost:3000>. 
1. Sign in with Google.

## Testing

- To run all tests: yarn test.
- To exclude tests while running your own, you may temporarily put 'x' in front of 'describe' or 'it'. However, DO NOT exclude tests on a PR to a sprint branch.

