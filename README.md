# Vom Prater aus

A bilingual (English/German) storytelling platform dedicated to the [Berliner Prater](<https://de.wikipedia.org/wiki/Prater_(Berlin)>), one of Berlin's most iconic cultural and historical landmarks. This project allows users to create, share, and explore stories about the historic Berliner Prater through an interactive web application.

## 🌟 Features

- **Interactive Story Creation**: Create multi-page stories with rich text and image content
- **Story Explorer**: Browse stories in both list and interactive 3D explorer modes
- **Bilingual Support**: Full English and German localization
- **Admin Dashboard**: Content moderation and management system
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Updates**: Live content updates with Supabase realtime
- **Image Management**: Integrated image upload and transformation
- **Search & Filter**: Advanced search with keyword filtering and year ranges

## 🏗️ Tech Stack

### Frontend

- [**Nuxt**](https://nuxt.com) - Vue.js based meta-framework
- [**TypeScript**](https://www.typescriptlang.org) - Type-safe development
- [**Pinia**](https://pinia.vuejs.org) - State management for Vue
- [**VueUse**](https://vueuse.org) - Composition utilities for Vue
- [**Three.js**](https://threejs.org) - 3D graphics for story explorer

### Backend & Database

- [**Supabase**](https://supabase.com) - Backend-as-a-Service, running as a self-hosted service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Storage (images)
  - Edge Functions
- [**PostgREST**](https://postgrest.org) - REST API for PostgreSQL
- [**GoTrue**](https://github.com/supabase/auth) - Authentication service

### Infrastructure

- [**Docker**](https://www.docker.com) - Containerization
- [**Docker Compose**](https://docs.docker.com/compose) - Multi-container orchestration
- [**Nginx**](https://nginx.org) - Reverse proxy and SSL termination
- [**Let's Encrypt**](https://letsencrypt.org) - SSL certificates

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for development)
- Git

### Development Setup

1. **Clone the repository**

   ```bash
   git clone git@github.com:pratergalerie/vom-prater-aus.git
   cd vom-prater-aus
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development environment**

   ```bash
   # Start all services (Supabase + Nuxt app)
   docker-compose --profile dev up -d

   # IMPORTANT: If you have installed a new npm package,
   # you need to rebuild the Nuxt app image
   docker-compose --profile dev up --build -d

   # Alternatively, you can start only the Supabase services
   docker-compose up -d kong auth rest db storage studio

   # And then start the Nuxt app locally
   cd nuxt-app
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Supabase Studio: http://localhost:8000
   - API: http://localhost:54321

### Production Deployment

1. **Set up your server** (see [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md))

2. **Deploy with Docker Compose**

   ```bash
   docker-compose --profile prod up -d
   ```

3. **Set up SSL certificates**
   ```bash
   ./renew-ssl.sh
   ```

## 📁 Project Structure

```
vom-prater-aus/
├── nuxt-app/                 # Frontend application
│   ├── app/
│   │   ├── components/       # Vue components
│   │   ├── pages/           # Application pages
│   │   ├── composables/     # Reusable logic
│   │   ├── stores/          # Pinia stores
│   │   └── assets/          # Static assets
│   ├── i18n/               # Internationalization
│   └── server/             # API routes
├── supabase/               # Backend configuration
│   ├── volumes/           # Database and storage
│   ├── scripts/           # Database setup scripts
│   └── initial-data/      # Initial example content data
├── nginx/                 # Web server configuration
└── docker-compose.yml     # Container orchestration
```

## 🎨 Key Components

### Story Creation

- Multi-page story editor with rich text support
- Image upload and management
- Keyword tagging system
- Draft and submission workflow

### Story Explorer

- Interactive 3D environment built with Three.js
- Story elements positioned in 3D space
- Mouse and touch navigation
- Responsive design for all devices

### Admin Dashboard

- Content moderation interface
- User management
- Story approval workflow
- Analytics and reporting

## 🌐 Internationalization

The application supports English and German with:

- Dynamic language switching
- Localized content management
- RTL-ready design
- Cultural adaptations

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

### Database Management

```bash
# Generate initial data SQL
cd supabase/scripts
npm run generate-data

# Backup database
./backup-supabase.sh

# Reset database
docker-compose down -v
docker-compose up -d db
```

## 🚀 Deployment

### Automatic Deployment

The project includes GitHub Actions for automatic deployment:

1. Push to `main` branch
2. GitHub Actions builds and deploys
3. SSL certificates auto-renew

### Manual Deployment

```bash
# Deploy to production
./deploy-auto.sh

# Renew SSL certificates
./renew-ssl.sh
```

## 📊 Environment Variables

Required environment variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
ANON_KEY=your_anon_key
SERVICE_ROLE_KEY=your_service_role_key

# Database
POSTGRES_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret

# Email (optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password

# Domain
SITE_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [**Prater Gallery**](https://pratergalerie.de) - Project conception and production

## 📞 Support

For support and questions:

- Create an issue in this repository
- Contact the development team
- Check the [documentation](./docs/) for detailed guides
