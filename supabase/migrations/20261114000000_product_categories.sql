-- Replace the original broad category labels with the storefront categories.
insert into public.categories (name, description)
values
  ('earrings', 'Handmade earrings'),
  ('necklace', 'Handmade necklaces'),
  ('bracelet', 'Handmade bracelets'),
  ('ring', 'Handmade rings'),
  ('other', 'Other handmade pieces'),
  ('home goods', 'Handmade goods for your space')
on conflict (name) do nothing;

update public.products
set category_id = (select id from public.categories where name = 'home goods')
where category_id = (select id from public.categories where name = 'Home Goods');

update public.products
set category_id = (select id from public.categories where name = 'other')
where category_id = (select id from public.categories where name = 'Jewelry');

delete from public.categories
where name in ('Jewelry', 'Home Goods')
  and not exists (select 1 from public.products where products.category_id = categories.id);
