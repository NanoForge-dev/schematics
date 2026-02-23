<% if (options.packageManager === 'bun') { %>
FROM oven/bun:1.3
<% } else { %>
FROM node:25-alpine
<% } %>

<% if (options.packageManager === 'pnpm') { %>
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm
<% } %>

<% if (options.packageManager === 'yarn') { %>
RUN npm install -g yarn
<% } %>

WORKDIR /app
COPY package.json ./
<% if (options.packageManager === 'npm') { %>
COPY package-lock.json ./
<% } else if (options.packageManager === 'yarn') { %>
COPY yarn.lock ./
<% } else if (options.packageManager === 'pnpm') { %>
COPY pnpm-lock.yaml ./
<% } else if (options.packageManager === 'bun') { %>
COPY bun.lock ./
<% } %>

RUN <% if (options.packageManager === 'npm') { %>npm<% } else if (options.packageManager === 'yarn') { %>yarn<% } else if (options.packageManager === 'pnpm') { %>pnpm install --prod<% } else if (options.packageManager === 'bun') { %>bun<% } %> install --production
COPY . .

RUN <% if (options.packageManager === 'npm') { %>npm<% } else if (options.packageManager === 'yarn') { %>yarn<% } else if (options.packageManager === 'pnpm') { %>pnpm<% } else if (options.packageManager === 'bun') { %>bun<% } %> run build

CMD [<% if (options.packageManager === 'npm') { %>"npm"<% } else if (options.packageManager === 'yarn') { %>"yarn"<% } else if (options.packageManager === 'pnpm') { %>"pnpm"<% } else if (options.packageManager === 'bun') { %>"bun"<% } %>, "run" ,"start" ]
