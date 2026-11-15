-- Make the Storage policies explicit about authenticated administrators.
-- This is safe to run after either product-image storage migration.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'::public.user_role
  );
$$;

drop policy if exists "Admins can upload product image files" on storage.objects;
drop policy if exists "Admins can update product image files" on storage.objects;
drop policy if exists "Admins can delete product image files" on storage.objects;

create policy "Admins can upload product image files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can update product image files"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can delete product image files"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());
