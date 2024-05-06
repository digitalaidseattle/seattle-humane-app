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

**Supabase** is used for Postgres database services and authentication with Google and Azure accounts via OAuth. 


## System Requirements

Install:
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
1. [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Local Environment Setup

1. Setup the frontend environment.
    
    Go in the folder you want the project to exist, run:

   ```bash
   git clone https://github.com/openseattle/seattle-humane-app
   ```

1. Open VS code

1. From VS code, open the command palette using `⇧⌘P` and type
    ```
    Dev Containers: Open Folder in Container...
    ```

    _Note: For more information check out: https://code.visualstudio.com/docs/devcontainers/containers_


### Configure Environmental Variables
Local requires a few one-time steps. You will need to start Supabase locally, put values from Supabase into your .env.local file.

1. Create a copy of .env.local.example

   ```bash
   cp .env.local.example .env.local
   ```

1. Open the .env.local file in VSCode. You will need to put values in this file after the next step, so keep it open.

1. Start Supabase locally. First, ensure you have NodeJS and Docket Desktop installed, then run: 
   ```bash 
   npx supabase start
   ```

    Enter "y" when/if asked to install the Supabase package.

    Give it a moment to spin up the containers. When it's finished, it will display URLs and keys that need to go into your local environment file. You already have the URL set in your .env.local, so just add the displayed anon key after the `NEXT_PUBLIC_SUPABASE_ANON_KEY=` variable in the .env.local file. Double-check you copied the value correctly then save the file.

    (These steps are derived from the [Original Supabase instructions here](https://supabase.com/docs/guides/cli/local-development#start-supabase-services))

    _Note: Make sure you run this outside of the Docker environment! More info [here](https://stackoverflow.com/questions/59815283/open-local-terminal-in-vscode-when-running-in-ssh-mode?rq=1)._

    _Note: If you have existing Supabase containers running, you may need to run `supabase stop --no-backup` to reset your environment. Careful, this will delete anything saved in your local database._

1. IS THIS NEEDED? Load the values from the env file into the environment by running:
    ```bash
      source .env.local
    ```

### Run the application

1. Start development server
   ```bash
   yarn dev
   ```

1. Open local instance in browser: <http://localhost:3000>.

## Testing

- To run all tests: yarn test.
- To exclude tests while running your own, you may temporarily put 'x' in front of 'describe' or 'it'. However, DO NOT exclude tests on a PR to a sprint branch.

