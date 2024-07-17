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
1. [Node.js](https://nodejs.org/en/)
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
1. [VS Code](https://code.visualstudio.com/download)
1. [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Local Environment Setup

### Setup NextJS Application
    
1. Go in the folder you want the project to exist, run:

   ```bash
   git clone https://github.com/openseattle/seattle-humane-app
   ```

1. Open VS code.

1. (Optional but recommended!) From VS code, open the command palette using `⇧⌘P` on Mac or `Ctrl+Shift+P` on Windows and type:
    ```
    Dev Containers: Open Folder in Container...
    ```

    _Note: For more information check out: https://code.visualstudio.com/docs/devcontainers/containers_

1. Open a shell and install dependecies by running:
    ```bash
    yarn install
    ```

### Setup Environment Variables

This setup uses a shared cloud Supabase database for simplicity.
1. Run the command:
   ```bash
   cp .env.local.example .env.local
   ```
2. Request the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the team or go to settings > api from the Supabase Dashboard tp get them yourself. Other variables in `.env.local` can be ignored for now.

### Run the application
1. Run the command in your terminal from the project directory:
```bash
   yarn dev
   ```

## Testing

- To run all tests: `yarn test`.
- To exclude tests while running your own, you may temporarily put 'x' in front of 'describe' or 'it'. However, DO NOT exclude tests on a PR to a sprint branch.

## Setup Application with Local Database (Optional)

This section is only needed if you want to isolate your database and not use a shared environment.

### Configure Environmental Variables
Local setup requires a few one-time steps. In the following steps, you will start Supabase locally and put values from Supabase into your .env.local file.

1. Like before, create a copy of .env.local.example:

   ```bash
   cp .env.local.example .env.local
   ```

1. Open the .env.local file in VSCode. You will need to put values in this file after the next step, so keep it open.

1. Start Supabase locally. Open a *[local terminal window](https://stackoverflow.com/questions/59815283/open-local-terminal-in-vscode-when-running-in-ssh-mode?rq=1)* from the seattle-humane-app folder and run: 
   ```bash 
   npx supabase start
   ```

    Enter "y" when/if asked to install the Supabase package.

    Give it a moment to spin up the containers. When it's finished, it will display URLs and keys that need to go into your local environment file.
    
    Put the API URL after `NEXT_PUBLIC_SUPABASE_URL=` variable and the anon key after the `NEXT_PUBLIC_SUPABASE_ANON_KEY=` variable in the .env.local file. Double-check you copied the value correctly then save the file.

    (These steps are derived from the [Original Supabase instructions here](https://supabase.com/docs/guides/cli/local-development#start-supabase-services))

    _Note: If you have existing Supabase containers running, you may need to run `supabase stop --no-backup` to reset your environment. Careful, this will delete anything saved in your local database._

1. Run `supabase stop` to close Supabase when you are done.

#### Configure OAuth Environment Variables

1. If you need to use OAuth, be sure to follow the steps listed in _.env.local.example_ to set the OAuth variables. Once the variables are set, run:
    ```bash
    supabase stop # You need to stop Supabase execution so that the new configuration changes will be picked up.
    source .env.local
    supabase start
    ```

### Running the application and backend locally (optional still)

#### Run the frontend

1. Open a shell inside the docker container (default option when opening shells with Dev Container).

1. Load the values from the env file into the environment by running:
    ```bash
      source .env.local
    ```

1. Start development server
   ```bash
   yarn dev
   ```

1. Open local instance in browser: <http://localhost:3000>.

1. Use `Ctrl+C` to stop the server when you are done.

#### Run Supabase

1. Open a *[local terminal window](https://stackoverflow.com/questions/59815283/open-local-terminal-in-vscode-when-running-in-ssh-mode?rq=1)* from the seattle-humane-app folder.

1. Run `supabase start`. If Supabase is already running, you can stop it by running `supabase stop` first.

1. Run `supabase stop` when you are done.

## Manually updating Supabase types

- To login to supabase: npx supabase login.
- To update type file: npx supabase gen types typescript --project-id "liuebfxbxugpfsfwbkks" --schema public > supabase/database.types.ts

## FAQ

### 1. Developing in Windows 

Dev containers on Windows rely on Docker via WSL (Windows Subsystem for Linux). When developing in a dev container (not in WSL), your repo is stored on a windows drive. Docker links to this via WSL, slowing down changes and builds, and breaking HMR in tools like Vite and Next.js. Cloning the repo inside WSL speeds this up, enabling Docker to work faster and support HMR.

Non WSL change flow: Dev container -> Docker (WSL) -> windows filesystem

WSL Flow: Dev container -> Docker (WSL)

Follow these steps to get setup for development on windows

__i. Dev container setup in WSL__

Install these prerequisites on windows:
    
- [Visual Studio Code](https://code.visualstudio.com/download)

- Enable WSL 2 by following the [WSL 2 installation guide](https://learn.microsoft.com/windows/wsl/install)

- Ubuntu (or your preferred Linux distribution) from the [Microsoft store](https://www.microsoft.com/p/ubuntu/9nblggh4msv6)

- [Docker Desktop Stable 2.3.0.2](https://docs.docker.com/docker-for-windows/wsl-tech-preview/#download)

Then follow all the directions [here](https://code.visualstudio.com/blogs/2020/07/01/containers-wsl) to finish setup. 

__ii. Clone repo inside the WSL filesystem__

Now you should be able to do yarn && yarn dev inside WSL and HMR should work. 

__iii. Local Supabase in WSL__

You will need to install Node and NPM in WSL first. You can do it however you want, but it's recommended that you use NVM** to install/manage them. 

##### \*\*Apt is not updated with the latest Node version so use NVM to reduce headaches for maintaing/upgrading Node versions on Linux.

Follow [these steps](https://nodejs.org/en/download/package-manager) to install NVM on Linux. I copied them down below for convenience

```bash
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# download and install Node.js (you may need to restart the terminal)
nvm install 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.15.1`

# verifies the right NPM version is in the environment
npm -v # should print `10.7.0`
```

__iiii. Install Supabase__

Follow [these instructions](https://github.com/supabase/cli?tab=readme-ov-file#install-the-cli) to install supabase in WSL

__iiiii. Running Supabase Locally__

You will want to run Supabase from outside the dev container but within the repo directory inside WSL. 

Use your favorite command line interpreter to run `supabase start` in WSL inside the repo dir.

I recommend [Windows Terminal from Microsoft Store](https://apps.microsoft.com/detail/9n0dx20hk701?rtc=1&hl=en-us&gl=US)