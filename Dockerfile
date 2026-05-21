# =============================================================================
#  PandaEducation - Development Image
#  Laravel 13 + Inertia + React (Vite) + Octane FrankenPHP
# =============================================================================

# --- Stage 1: ambil binary Node dari image official ---
FROM node:22-bookworm-slim AS nodebin

# --- Stage 2: FrankenPHP (PHP 8.3 + install-php-extensions sudah built-in) ---
FROM dunglas/frankenphp:1-php8.3

LABEL maintainer="PandaEducation Team"
LABEL description="Laravel + Inertia React + Octane FrankenPHP dev image"

ENV DEBIAN_FRONTEND=noninteractive \
    COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_NO_INTERACTION=1 \
    TZ=Asia/Jakarta \
    # Paksa FrankenPHP listen HTTP biasa di port 8000 (bukan auto-HTTPS)
    SERVER_NAME=":8000"

# -----------------------------------------------------------------------------
# System dependencies
# -----------------------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
        git curl unzip zip ca-certificates netcat-openbsd procps \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# PHP extensions
# install-php-extensions (IPC) sudah tersedia di base image dunglas/frankenphp.
# IPC otomatis handle native deps (libpq, libzip, dll) — tidak perlu apt manual.
# -----------------------------------------------------------------------------
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    bcmath \
    intl \
    mbstring \
    pcntl \
    zip \
    exif \
    gd \
    opcache \
    redis

# -----------------------------------------------------------------------------
# Composer
# -----------------------------------------------------------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# -----------------------------------------------------------------------------
# Node.js 22 LTS + npm  (copy dari official node image, tanpa NodeSource)
# -----------------------------------------------------------------------------
COPY --from=nodebin /usr/local/bin/node          /usr/local/bin/node
COPY --from=nodebin /usr/local/lib/node_modules  /usr/local/lib/node_modules
RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && ln -sf /usr/local/lib/node_modules/corepack/dist/corepack.js /usr/local/bin/corepack \
    && node --version && npm --version

# -----------------------------------------------------------------------------
# PHP runtime tweaks
# -----------------------------------------------------------------------------
RUN { \
        echo "memory_limit=512M"; \
        echo "upload_max_filesize=64M"; \
        echo "post_max_size=64M"; \
        echo "max_execution_time=0"; \
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
