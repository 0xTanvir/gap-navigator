# Gap Navigator

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder structure
- `/app`: Only contains structure of each route.
- `/lib`: The lib folder contains reuseable functions that used in application, such as reuseable utility functions and data fetching functions.
- `/components/ui`: Contains all the UI components for the application, such as cards, tables, and forms.
- `/components`: The rest of the components such as `<PageHeader />` and `<MainNav />` are placed in the components folder.
- `/public`: Contains all the static assets for your application, such as images.
- `/styles`: The styles folder contains the global CSS.
- `/config`: Contains different config file for different service