# Supabase setup for JemsCreations

This project is prepared for Supabase, but it does not contain any Supabase credentials. Keep those credentials in `.env.local` and never commit that file.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Choose **New project**.
3. Create or select an organization.
4. Name the project `jemscreations`.
5. Create a strong database password and save it somewhere secure.
6. Choose a region close to the business/customers.
7. Select **Create new project** and wait for the project to finish provisioning.

## 2. Create the database tables

1. Open the project dashboard.
2. Choose **SQL Editor**.
3. Run every SQL file in `supabase/migrations/` in filename order, including the product-category and product-image-storage migrations.

The migrations create the tables for products, categories, images, orders, order items, wishlists, discounts, messages, and customer/admin profiles. They also create the `product-images` Storage bucket and its policies, and enable Row Level Security so public visitors can see active products while only the administrator can manage catalog data.

## 3. Add the project keys locally

1. In Supabase, open **Project Settings → API** or the project's **Connect** dialog.
2. Copy the **Project URL**.
3. Copy the **Publishable key**. This is safe to use in browser code when Row Level Security is configured correctly. Do not use or expose a secret/service-role key in this app.
4. In the project root, create a file named `.env.local`.
5. Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Replace both values with the values from your Supabase project. Restart the Next.js development server after changing environment variables.

## 4. Create the first administrator

1. In Supabase, open **Authentication → Users**.
2. Choose **Add user** and create the business owner's email/password account.
3. Copy the new user's UUID.
4. In **SQL Editor**, run:

```sql
update public.profiles
set role = 'admin'
where id = 'PASTE_THE_USER_UUID_HERE';
```

Do not make an administrator account by changing the role in the browser. The role is stored and checked in Supabase policies.

## 5. Start the app and test the connection

From the project folder:

```powershell
pnpm dev
```

Open `http://localhost:3000`. The app's Supabase browser/server utilities are located in `src/lib/supabase`, and the Next.js `proxy.ts` keeps Supabase Auth sessions refreshed when credentials are present.

## What we will connect next

The next implementation step is replacing the sample product data in `src/data/products.ts` with a server-side query to `public.products`, then wiring the admin forms and checkout submission to Supabase. We should do that after the project is created and the migration has run successfully.
