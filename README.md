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

Digital Aid Seattle aims to amplify community impact with technology by
connecting organizations who need technical solutions with skilled volunteers.

People across thousands of Seattle civic and nonprofit organizations have
dedicated their lives to making the world safer, more equitable, and more
sustainable. This work is responsible for so much good in the world, and we owe
them a huge debt of gratitude.

Unfortunately, many of these organizations lack access to digital tools that are
vital to success in the modern age. Nonprofits struggle to create and scale
their impact without the resources they need.

Just outside their doors is a fleet of experts and technologists with the
talent, capacity, and drive to build.

Seattle is world-renowned as a hub for technology talent, full of motivated
builders, designers, and creators that want to use their skills for good.
Digital Aid Seattle is bringing these communities together to create a sum
greater than its parts.

This website is for organizations that want to
[learn more about partnering with Digital Aid Seattle](https://www.digitalaidseattle.org/partner)
and for passionate, skilled Seattlites who want to
[learn more about volunteering!](https://www.digitalaidseattle.org/volunteer)

## Technology Stack

The website is built using **Next.js**, a React-based framework for server-side
rendering and static site generation. Learn more about Next.js
[here](https://nextjs.org/docs/getting-started).

**Vercel** is used for deployment, providing a fast and scalable hosting
environment for the website. Once a pull request is made, Vercel will
automatically deploy a staged version of the website for final approval prior to
deploying these changes to the public-facing website. Learn more about Vercel
[here](https://vercel.com/docs).

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

1. Setup VSCode for auto formatting

- Install extensions: ESLint and Prettier
- Go to VSCode setting `Settings` > `Text Editor` > `Formatting` >
  `Format On Save`
- In the same setting window, look up `Default Formatter` and set to Prettier.

### Configure Environmental Variables

1. Create .env.local file:

   ```bash
   touch .env.local
   ```

1. Paste the following into this file and save:

   ```.env
   # Defaults, used by ./intro-template and can be deleted if the component is removed
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_AUTH_GOOGLE_CLIENT_ID=
   SUPABASE_AUTH_GOOGLE_SECRET=
   SUPABASE_AUTH_GOOGLE_REDIRECT_URI="http://localhost:54321/auth/v1/callback"
   ```

#### Setup Supabase

1. Install Docker desktop. The local Supabase services run in containers.

1. Login to the supabase project:
   ```bash
   npm run supa-login
   ```

1. Start the local Supabase services. From inside the repository directory:
   ```bash
   npm run supa-start
   ```
1. Copy the `anon key` output in the terminal and update the env variable
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Setup Deno

Deno is used by Supabase Edge functions. You need to install it to run these
functions locally during development.

1. Install Deno or your host machine:
   [Deno installation](https://docs.deno.com/runtime/manual/getting_started/installation)
1. Or see the VS Code Dev Container option below 👇

#### Setup Google OAuth

The only way to access the web app locally right now is via Google OAuth

1. Go to the
   [Google API console](https://console.cloud.google.com/apis/dashboard)
1. Sign in with your Digital Aid Seattle account
1. Go to `Credentials` via the menu on the left
   - You may be prompted to setup an OAuth consent screen first. You only need
     to specify the App name, and set your DAS email as the support and contact
     emails.
   - You don't need to add an authorized domain, logo file or add other links.
   - You do need to choose the email, profile and openid under non-sensitive
     scopes. You don't need to setup the other sensitive or restricted scopes.
   - Go to Credential via the menu on the left
1. Click `+ Create Credentials`
1. Choose `OAuth Client ID`
1. For Application type choose `Web application`
1. Give it a meaningful name, but you won't need the name later.
1. Under Authorized JavaScript origins click `+ ADD URI` and specify
   `http://localhost:54321`
1. Under Authorized redirect URIs click `+ ADD URI` and specify
   `http://localhost:54321/auth/v1/callback`
1. Click `Create`
1. Copy the `Client ID` and set it to the `SUPABASE_AUTH_GOOGLE_CLIENT_ID` env
   variable
1. Copy the `Client secret` and set it to the `SUPABASE_AUTH_GOOGLE_SECRET` env
   variable

#### Run the app (in a VS Code Dev Container)

1. Open this repository in VS Code

1. If you want to run the app in a VS Code Dev Container:

   1. Open the command pallet and run "Open in container" or something like that

   1. Wait for container to start and VS Code to open. You will see some
      commands run on startup to install Deno inside the container. You can
      close the terminal when those are done.

   1. In the .env file, replace the IP address in the URL with
      `host.docker.internal` so that it reads like
      `http://host.docker.internal:54321`. This will ensure that when the app
      runs in your dev container, it can connect to the supabase services
      running in other containers on your host machine.

   1. Be aware that the supabase commands need to be run on the host machine,
      not in a terminal in your dev container.

1. run `npm run supa-start` (if you didn't already have this running from
   previous setup)
1. run `npm run dev` to start the website.

## Testing

- To run all tests: npm test.
- To exclude tests while running your own, you may temporarily put 'x' in front
  of 'describe' or 'it'. However, DO NOT exclude tests on a PR to a sprint
  branch.
