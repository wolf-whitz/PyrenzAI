# Deployment

Wanna run **PyrenzAI**? Whether you're just checking it out locally or wanna fork it and make it your own, here's how to get it up and running.

## What’s Under the Hood?

The PyrenzAI frontend is built using **React** + **Vite** super damn fast, modern, and optimized for dev and prod builds.

---

## Option 1: Running Locally with Docker!

Easiest way to get started is using Docker. We’ve already set it up so you don’t have to worry about Node versions or local dependencies.

### Step-by-Step:

1. Make sure you have **Docker** and **Docker Compose** installed.
2. In the project root, run this command:

   ```
   docker-compose up --build
   ```

3. This will:

   * Build the Docker image
   * Run `npm install`
   * Run `npm run build` to bundle the app
   * Start the production server using `npm run prod`

4. Once it's up, the app will be live at:
   👉 [http://localhost:8080](http://localhost:8080)

If you make any changes to the code, just stop the container and re-run:

```
docker-compose up --build
```

---

## Option 2: Manual Setup (for devs who hate containers or low on resources)

If you wanna run PyrenzAI straight on your machine without Docker maybe your device's low on storage or RAM no worries, here’s how to run the app without docker:

1. Make sure you have **Node.js 18 or higher** installed. You can check with:

   ```
   node -v
   ```

2. Clone the repo and get into the project folder:

   ```
   git clone https://github.com/Whitzzscott/PyrenzAI.git
   cd PyrenzAI
   ```

3. Install all the dependencies:

   ```
   npm install
   ```

4. Build the app for production:

   ```
   npm run build
   ```

5. Start the production server:

   ```
   npm run prod
   ```

   This runs the built app so you can access it locally, on [http://localhost:8080](http://localhost:8080).

---

## Easiest Build Step

If you just wanna build the app without dealing with Docker, npm commands, or all that annoying stuff, here’s the fastest way to get it done on Windows.

### Steps:

1. Open **PowerShell** or **Command Prompt**

2. Clone the GitHub repo by running:

   ```
   git clone https://github.com/Whitzzscott/PyrenzAI.git
   ```

3. Change directory into the project folder:

   ```
   cd PyrenzAI
   ```

4. Run the startup script:

   ```
   ./startup.bat

   Or if your in linux or mac you can run:

   ./startup.sh
   ```

This batch file automatically runs all the build steps for you like installing dependencies, building the app, and starting the production server so you don’t have to remember any commands like a caveman haha.

Once it’s done, PyrenzAI should be live locally, usually at [http://localhost:8080](http://localhost:8080).



### © 2025 Pyrenz AI. All rights reserved. Under GPL 3.0 License

All changes must comply with our Terms of Service and Privacy Policy. You must also agree to keep the app's source code public.
