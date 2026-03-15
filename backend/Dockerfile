FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3001
ENV PORT 3001

CMD ["node", "dist/index.js"]
