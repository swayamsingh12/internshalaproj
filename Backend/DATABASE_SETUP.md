# Database Setup Instructions

## Error: ConnectionRefusedError - PostgreSQL Not Running

The backend cannot connect to PostgreSQL. Follow these steps to fix:

## Option 1: Install and Start PostgreSQL (Recommended)

### Step 1: Install PostgreSQL
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Remember the password you set for the `postgres` user
   - Default port is 5432 (keep this)
   - Install pgAdmin (optional but helpful)

### Step 2: Start PostgreSQL Service
After installation, PostgreSQL should start automatically. If not:

**Windows Service:**
```powershell
# Start PostgreSQL service
Start-Service postgresql-x64-<version>
# Or find the service name:
Get-Service | Where-Object {$_.DisplayName -like "*postgres*"}
```

**Or manually:**
- Open Services (Win + R, type `services.msc`)
- Find "postgresql" service
- Right-click → Start

### Step 3: Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE rating_db;

# Exit
\q
```

### Step 4: Update .env File
Make sure your `.env` file has the correct password:
```
DB_PASS=your_postgres_password_here
```

## Option 2: Use Docker (Alternative)

If you have Docker installed:

```bash
docker run --name postgres-rating -e POSTGRES_PASSWORD=admin123 -e POSTGRES_DB=rating_db -p 5432:5432 -d postgres
```

## Option 3: Check PostgreSQL Installation

1. Check if PostgreSQL is installed:
   ```powershell
   Get-Command psql
   ```

2. If installed, try connecting:
   ```bash
   psql -U postgres -h localhost
   ```

3. If connection works, create the database:
   ```sql
   CREATE DATABASE rating_db;
   ```

## After Setup

Once PostgreSQL is running:

1. Verify connection:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 5432
   ```

2. Start the backend:
   ```bash
   cd Backend
   npm start
   ```

3. The backend will automatically create tables using Sequelize sync.

## Troubleshooting

- **Port 5432 already in use**: Another PostgreSQL instance might be running
- **Authentication failed**: Check your `.env` file password matches PostgreSQL password
- **Database doesn't exist**: Create it manually using `CREATE DATABASE rating_db;`

