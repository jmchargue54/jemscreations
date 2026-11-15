-- Storage for product images uploaded by administrators.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

create policy "Public can view product image files"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Admins can upload product image files"
on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can update product image files"
on storage.objects for update
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can delete product image files"
on storage.objects for delete
using (bucket_id = 'product-images' and public.is_admin());
