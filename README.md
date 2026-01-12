> [!Important]
> While this project utilizes [Payload CMS](https://payloadcms.com/), Atomic Payload is not affiliated with [Payload CMS](https://payloadcms.com/) in any capacity.

![Atomic Payload](public/ogImage.webp)


A website builder that creates a hard separation between front-end development and the backend. Build your website directly in Payload CMS's dashboard, without ever having to touch real code.

This separation makes it easy to enforce best practices and achieve great performance out the box.

<img width="521" height="173" alt="100" src="https://github.com/user-attachments/assets/b3998740-6bd3-4980-b7d7-e2d3f7d0b782" />


> [!IMPORTANT]
> Our [Discord](https://discord.gg/54cEtwCVTk) is the best place to get quick answers to questions. We are also looking for contributors!

# Features
## Tailwind Styles
Write Tailwind directly in the Payload admin dashboard, so you can have custom styled blocks wherever you need them.

![styles](https://github.com/user-attachments/assets/6ccc46be-5431-4191-97c8-d070fb4969ff)

## Recursive Structure + Copy Paste Duplicate
Build entire custom components using Atomic Child Blocks. Combined with Payload's CPD functionality, you can reuse components with ease.

![duplicate](https://github.com/user-attachments/assets/f9a6580b-ab82-4e7b-8815-9fbed20e576b)

> [!NOTE]
> Once Payload CMS implements Sanity Style CPD, you will be able to reuse components across projects.

## UnoCSS Shortcuts
UnoCSS powers our style generation, so we can leverage the built in Shortcut functionality to group our styles for reuse across your website.

![shortcuts](https://github.com/user-attachments/assets/decf0194-1523-46dd-b8d0-ba82e7d7970e)

## Design Tokens
Create reusable values related to your website design. Including colors, sizings, screen sizes, animations and more!

![tokens](https://github.com/user-attachments/assets/b9344462-adf9-40f6-b96e-773a627a1058)

## Design Sets
Design Sets are the equivalent of a complete Tailwind config file and can completely alter the appearance of your website. Only one design set can be active at a time, meaning you can build new concept designs and easily swap back and forth to see which you prefer.

![designsets](https://github.com/user-attachments/assets/882fcb15-2f22-479d-95cd-89b479b9b54d)

## Actions
Actions create interactivity and reactivity for your application for all atomic blocks. Including functionality such as opening/closing dialogs/popovers, toggling dark mode, converting stateful values to data attributes, or just submitting a form.

![actions](https://github.com/user-attachments/assets/109a6f47-3f35-4a3d-af7f-f340bfdfb23d)

> [!NOTE]
> Actions utilize a block structure so you can extend them by adding a new action block.

## Custom Forms With SVR
All of the above functionality meshes with the additional Sanitation, Validation and Rate Limiting for forms and their inputs. Allowing you to build fully customizable forms.

![forms](https://github.com/user-attachments/assets/61a4fd29-0d0b-40ab-a2f0-1cfa698b5997)

> [!NOTE]
> SVR's utilize a block structure so you can extend them by adding a new SVR block.

## Feature List
### Implemented
- UnoCSS Tailwind Classes Processor
- Forms (Sanitation/Validation/Rate Limiting)
- Actions
- Design Sets & Tokens
- UnoCSS Shortcuts
- Image Upload & Display
- Mux Video Integration For Upload & Display
- Next.JS Local Fonts
- Custom SVG Icon Upload & Optimization
- Icon Sets
- Tracking (Vercel/Google/PostHog)
- Persistent Zustand Store
- Zod Schema Registry
- Zod Schema To Payload Types

### Planned
- Tailwind Styled Emails
- Version Routes
- Component Library
- UnoCSS Autocomplete
- Convert To Plugin(s)

---

# Initial Setup

1. **Get Required Connections**
   - Obtain a `MONGODB_URI` (Set up through Vercel to get a free tier cluster(`Storage → Create Database → MongoDB Atlas`)).
   - Create a Blob store in Vercel (`Storage → Create Database → Blob`) and copy the `BLOB_READ_WRITE_TOKEN` from .env.local.

2. **Clone and configure**
   - Clone the repository locally.
   - Copy `.env.example` to `.env`.
   - Add the MongoDB URI and Blob token.
   - Generate and add the Payload and Preview secrets.
    ```bash
    # Mongo DB connection string
    MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/my_database?retryWrites=true&w=majority"
    # Vercel Blob Read Write Secret
    BLOB_READ_WRITE_TOKEN="vercel_blob_rw_laogivGHAOSNeoFS_KJAGsjmeHSkaLQUVhUSHmfPGIXCbHe"
    
    # Used to encrypt JWT tokens
    PAYLOAD_SECRET=524AFEAC8E77853C6AC1C2EBCB266
    # Used to validate preview requests
    PREVIEW_SECRET=77E41879964C5D1C251661663DCD3
    ```

3. **Install and run**
   - Paste and run the code below into your terminal. Which installs dependencies, runs the font download script to generate a blank definition file (even if it says it failed, it generates the file as blank), and then starts the dev server.
   ```bash
   pnpm i
   pnpm download:fonts
   pnpm dev
   ```
   - Open `http://localhost:3000/admin` and create the first admin user.

4. **Update environment variables**
   - Add the created admin email and password to `.env` as:
   ```bash
   # Script User Login
   SCRIPT_USER_EMAIL="chad@atomicpayload.com"
   SCRIPT_USER_PASSWORD="Password123"
   ```

5. **Deploy to Vercel**
   - Create a new project in Vercel by importing your repo. But before hitting create:
   - In your local `.env`, update:
   ```bash
   LIVE_SITE_URL='https://<project-name>.vercel.app'
   ```
   - Copy all environment variables above and including LIVE_SITE_URL to the Vercel project settings.
   - In the Vercel environment variables edit NEXT_PUBLIC_SERVER_URL to the LIVE_SITE_URL
   - Trigger a deploy and wait for the build to complete.

\
\
You now have a working version of Atomic Payload. It is recommended to go to the main admin dashboard on the site and seed the database with some data. Just keep in mind this will override existing data, and therefore you should comment out the beforeDashboard custom component from `src/payload.config.ts` once seeded.


> [!IMPORTANT]
> Our [Discord](https://discord.gg/54cEtwCVTk) is the best place to get quick answers to questions. We are also looking for contributors!

# Additional Setup

### Vercel Rebuild Webhook
Trigger a rebuild of your deployment using a vercel webhook. Mainly used when updating fonts.

1. Get Hook URL
   - Go to your projects dashboard then (`Settings → Git → Deploy Hooks`).
   - Add a name and select the branch to rebuild (usually `main`).
   - Copy the hook URL and add it to your Vercel env. Example:
   ```bash
   VERCEL_DEPLOY_WEBHOOK_URL=https://api.vercel.com/v1/integrations/deploy/prj_55B6CE7961E311671658DBFD8B59C
   ```

### Mux Setup
Upload and serve video all through the Payload admin dashboard.

1. Account Setup
   - Create a Mux Account
   - Create a new environment
   - Set it to **Production** and configure access controls

2. Setup Mux Token
   - In Mux, go to (`Settings → Access Tokens`).
   - Create a new token.
   - Select **Payload Admin** and enable all permissions.
   - Copy the **Token ID** to `MUX_TOKEN_ID`.
   - Copy the **Secret Key** to `MUX_TOKEN_SECRET`.

3. Setup Mux Webhook
   - In Mux, go to (`Settings → Webhooks`):
   - Add a webhook for your live site with the route `/api/mux/webhook`. e.g: `<live-site-url>/api/mux/webhook`
   - Copy the generated secret to `MUX_WEBHOOK_SIGNING_SECRET`

    #### Example:
    ```bash
    #Mux Secrets. For mux video block component.
    MUX_TOKEN_ID=bd47f2c1e-5a8b-4f92-9b3e-2c1d7a6f4e91
    MUX_TOKEN_SECRET=K9ZpY1cE8M7R0xBqW3uT4nD2JH6OaLwFhVQ5S/ImsPjGkUoXyAetCzNrbf0d+8lH
    MUX_WEBHOOK_SIGNING_SECRET=7k4qv9xrmhsj2p1d8zf6bwl0ntgy5cqe
    ```
### Resend Setup
Send emails programmatically upon form submissions using Resend.

1. Get An API Key
   - In the Resend Dashboard Go To API Keys
   - Create and name a new API key then copy to `RESEND_API_KEY`
   ```bash
   RESEND_API_KEY=qR8_LpWzNy_7vKDmHT2JXsFo9BbUyRcAeLQ
   ```
2. Handle For The Sender Domain
   - Go To Domains And Create a New Domain (Use a purchased domain, and preferably set as a subdomain such as `notifications.atomicpayload.com`)
   - Go Through Resend Setup Instructions
   - In your repo, at `src/payload.config.ts` uncomment all code related to the resendAdapter and modify to fit your implementation.
