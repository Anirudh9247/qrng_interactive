# QRNG Project

## Backend Dependencies

### Production Deployment Requirements

The backend uses `psycopg2` for PostgreSQL connectivity. For production deployments, ensure the following system packages are installed:

- **Ubuntu/Debian**: `sudo apt-get install libpq-dev python3-dev`
- **CentOS/RHEL**: `sudo yum install postgresql-devel python3-devel`
- **macOS**: `brew install postgresql`
- **Docker**: Add to your Dockerfile:

  ```dockerfile
  RUN apt-get update && apt-get install -y libpq-dev python3-dev
  ```

These packages provide the necessary headers for compiling `psycopg2`. Without them, installation will fail.

For development, you can use `psycopg2-binary` if compilation is not feasible, but it's not recommended for production due to potential compatibility issues.

## Getting Started

[Add your setup instructions here]
