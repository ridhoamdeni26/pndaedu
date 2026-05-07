# =============================================================================
#  PandaEducation - Development Image
#  Laravel 13 + Inertia + React (Vite)
#  Base: PHP 8.3 (CLI) on Debian Bookworm
# =============================================================================

# --- Stage 1: ambil binary Node dari image official (lebih reliable
#              daripada NodeSource setup_22.x yang sering gagal di build) ---
FROM node:22-bookworm-slim AS nodebin

# --- Stage 2: image utama PHP ---
FROM php:8.3-cli-bookworm

LABEL maintainer="PandaEducation Team"
LABEL description="Laravel + Inertia React development image"

ENV DEBIAN_FRONTEND=noninteractive \
    COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_NO_INTERACTION=1 \
    TZ=Asia/Jakarta

# -----------------------------------------------------------------------------
# System dependencies
# -----------------------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
        git curl unzip zip ca-certificates gnupg netcat-openbsd \
        libpq-dev libzip-dev libicu-dev libonig-dev libpng-dev \
        libjpeg-dev libfreetype6-dev libxml2-dev procps \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# PHP extensions (Postgres, Redis, common Laravel deps)
# -----------------------------------------------------------------------------
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql pgsql bcmath intl mbstring pcntl zip exif gd opcache \
    && pecl install redis \
    && docker-php-ext-enable redis

# -----------------------------------------------------------------------------
# Composer
# -----------------------------------------------------------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# -----------------------------------------------------------------------------
# Node.js 22 LTS + npm  (copy dari image official node:22-bookworm-slim)
# -----------------------------------------------------------------------------
COPY --from=nodebin /usr/local/bin/node          /usr/local/bin/node
COPY --from=nodebin /usr/local/lib/node_modules  /usr/local/lib/node_modules
RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && ln -sf /usr/local/lib/node_modules/corepack/dist/corepack.js /usr/local/bin/corepack \
    && node --version && npm --version

# -----------------------------------------------------------------------------
# PHP runtime tweaks (dev-friendly)
# -----------------------------------------------------------------------------
RUN { \
        echo "memory_limit=512M"; \
        echo "upload_max_filesize=64M"; \
        echo "post_max_size=64M"; \
        echo "max_execution_time=300"; \
        echo "date.timezone=${TZ}"; \
    } > /usr/local/etc/php/conf.d/zz-pandaeducation.ini

# -----------------------------------------------------------------------------
# Working directory & entrypoint
# -----------------------------------------------------------------------------
WORKDIR /var/www/html

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000 5173

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["dev"]
