# Cursor Rules Directory

A community-driven directory for AI rules and prompts for Cursor IDE. Browse, share, and discover configurations to enhance your development workflow.

## Features

- **Browse Rules**: Discover community-created Cursor rules
- **Categories**: Organized by development areas (React, TypeScript, Testing, etc.)
- **Submit Rules**: Share your own rules with the community
- **Copy & Use**: One-click copy to use in your Cursor configuration
- **Popular Rules**: Find the most used and viewed rules
- **Search & Filter**: Find exactly what you need

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: None (fully anonymous)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (for PostgreSQL database)
- Your database password from Supabase

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cursor-rules.git
cd cursor-rules
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file with your Supabase database connection:

```env
# Database URLs for Prisma with Supabase
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.yupcziwcupnnbpbrsrur:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.yupcziwcupnnbpbrsrur:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual Supabase database password, and update the connection string with your specific Supabase project details.

4. Set up the database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main models:

- **Category**: Rule categories (React, TypeScript, Testing, etc.)
- **Rule**: The actual Cursor rules with content, metadata, and vote counts
- **Tag**: Tags for better rule organization
- **RuleTag**: Junction table for many-to-many relationship between rules and tags

No user accounts or authentication - everything is anonymous!

## API Routes

- `GET /api/rules` - Fetch rules with pagination and filtering
- `POST /api/rules` - Create a new rule (anonymous)
- `GET /api/rules/[id]` - Get a specific rule
- `POST /api/rules/[id]/copy` - Increment copy count
- `POST /api/rules/[id]/vote` - Vote on a rule (upvote/downvote)
- `GET /api/categories` - Get all categories

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database Setup (Supabase)

1. Create a new Supabase project
2. Go to Settings → Database → Connection pooling
3. Copy the connection string (with pgbouncer=true for DATABASE_URL)
4. Copy the direct connection string (port 5432 for DIRECT_URL)
5. Update your `.env.local` file with the correct credentials
6. Run migrations: `npm run db:push`
7. Seed initial data: `npm run db:seed`

## Features

✅ **Anonymous rule submissions** - No sign-up required
✅ **Upvote/downvote system** - Community-driven quality control
✅ **Category browsing** - Organized by technology/framework
✅ **Search and filtering** - Find exactly what you need
✅ **One-click copying** - Easy integration with Cursor
✅ **Responsive design** - Works on all devices
✅ **Real-time vote counts** - See popularity instantly

## Future Enhancements

- Comments and discussions
- Rule versioning
- API for Cursor IDE integration
- Rule collections/playlists
- Export/import functionality
- Advanced tagging system