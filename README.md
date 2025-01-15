# Swag Market

E-commerce-inspired marketplace for sellers to list items and buyers to 'buy' them. Used to teach authentication and reinforce relational database concepts.

Deployed at: [swagmarket.vercel.app](https://swagmarket.vercel.app)

## How To Use App

The home page is the marketplace. Click a listing to view its details.

After logging in, click Buy on a listing page to 'buy' it, or click Sell in the navbar to create a new listing.

When creating a new listing, use AI to generate a description for the listing after uploading a product photo.

## How To Run App Locally

### Set Up Environment Variables

1. Copy `.env.example` to new file `.env.local`. Env vars in `.env.local` will only be available server-side unless otherwise specified. `.env.local` is ignored by Git via `.gitignore`.
2. Replace Supabase and OpenAI secrets in `.env.local` with yours. If you do not have them, create them at Supabase's and OpenAI's platforms.

### Set Up Supabase Database

Once you have a Supabase project and have stored its URL and Anon Key in `.env.local`, use the following schema to set up database tables. These instructions will change once we add migrations to this repo, which we have not yet.

```sql
create table
  public.user_profiles (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    first_name character varying null,
    last_name character varying null,
    constraint user_profiles_pkey primary key (id),
    constraint user_profiles_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

create table
  public.listings (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    title character varying not null,
    description text null,
    price numeric not null,
    image_url character varying null,
    buyer_id uuid null,
    seller_id uuid null,
    constraint listings_pkey primary key (id),
    constraint listings_buyer_id_fkey foreign key (buyer_id) references user_profiles (id),
    constraint listings_seller_id_fkey foreign key (seller_id) references user_profiles (id)
  ) tablespace pg_default;
```

Once the tables are created, run the following command in the Supabase SQL Editor to prompt Supabase to create a new `user_profile` every time a new auth user is created. In this setup, `user_profiles` references `auth.users` from Supabase Auth. This script should also be part of version control, and added together with migrations.

```sql
-- inserts a row into public.user_profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_profiles (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Start Server

```zsh
npm i # Install dependencies
npm run dev # Start server
```

Open [http://localhost:3000](http://localhost:3000) in a browser to view the app.
