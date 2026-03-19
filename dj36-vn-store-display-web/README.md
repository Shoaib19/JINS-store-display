# US Store Display Web #

### Installing Docker

Install according to your environment

- https://docs.docker.jp/toolbox/overview.html

#### For Windows

After enabling WSL2 and starting Ubuntu, install Docker
- https://docs.docker.jp/v1.12/engine/installation/index.html

#### For Mac

- https://orbstack.dev/

## How to do it

All operations are assumed to be performed from the root directory of this repository.

* (For Windows) Console operations must be performed while logged in to WSL.
```
> wsl
```

## Getting Started

 1. **Clone the repository:**

    ```markdown
    git clone git@bitbucket.org:jinssales/us-store-display-web.git
    ```

 2. **Navigate into the project directory:**

    ```markdown
    cd us-store-display-web
    ```

## Running in Development Mode (Docker)

 1. **Build and start the dev server:**

    ```markdown
    VITE_BFF_ENDPOINT=https://api.example.com  VITE_SERVER_PORT=5173  docker compose up dev
    ```
    - Runs Vite dev server on http://localhost:5173

## Running in Production Mode (Docker)

 1. **Build the production Docker image:**
    ```markdown
    docker build --target prod \
      --build-arg VITE_BFF_ENDPOINT=https://api.example.com \
      --build-arg VITE_SERVER_PORT=5173 \
      -t us-store-display-web .
    ```

 2. **Build the production Docker image:**
    ```markdown
    docker run -d \
      --name us-store-display-web-container \
      -p 5173:5173 \
      us-store-display-web
    ``` 
    - Runs Vite prod server on http://localhost:5173
    - Serves the optimized static files using Nginx


## Technologies Used

 *  React
 *  TypeScript
 *  Tailwind CSS
 *  Vite
 * Docker / Docker Compose
 * Nginx (for production serving)