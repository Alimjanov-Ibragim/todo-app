This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Settings

### 1. Clone the repository:

- git clone https://github.com/Alimjanov-Ibragim/todo-app.git
- cd https://github.com/Alimjanov-Ibragim/todo-app.git

### 2. Setting environment variables:

Create a .env file in the root of the project.
Example content (for local running):

```bash
DATABASE_URL="mysql://root:MyPassword@localhost:3306/todos"
```

### 3. Running MySQL in Docker:

Make sure Docker and docker-compose are installed.
In the root of the project (where docker-compose.yml is located), run:

- Docker Compose v2:

```bash
docker compose up -d
```

- Docker Compose v1:

```bash
docker-compose up -d
```

Check that the container is running:

```bash
docker ps
```

### 4. Setting up Prisma:

Generate Prisma Client:

```bash
npx prisma generate
```

Apply migrations:

```bash
npx prisma migrate dev --name init
```

### 5. Add next.js auth secret:

```bash
NEXTAUTH_SECRET="your_secret_key"
```

### 6. Launching Next.js application:

If the application is not containerized, run:

```bash
npm install
npm run dev
```

The application will be available at http://localhost:3000
