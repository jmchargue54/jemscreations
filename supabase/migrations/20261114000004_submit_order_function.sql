-- Submit an order atomically and reserve one-of-a-kind products.
create or replace function public.submit_order(
  p_items jsonb,
  p_guest_name text,
  p_guest_email text,
  p_shipping_name text,
  p_shipping_address text,
  p_shipping_city text,
  p_shipping_state text,
  p_shipping_postal_code text,
  p_shipping_country text,
  p_customer_notes text,
  p_discount_code text,
  p_venmo_paid boolean
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  item record;
  product_row record;
  new_order_id bigint;
  subtotal_amount numeric(10,2) := 0;
  discount_amount numeric(10,2) := 0;
  discount_row record;
begin
  if current_user_id is null then
    raise exception 'You must be signed in to submit an order';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty';
  end if;

  for item in select * from jsonb_to_recordset(p_items) as entries(product_id bigint, quantity integer)
  loop
    if item.quantity is null or item.quantity < 1 then
      raise exception 'Invalid product quantity';
    end if;

    select id, name, price, status, inventory_tracking, inventory_quantity
    into product_row
    from public.products
    where id = item.product_id
    for update;

    if not found or product_row.status <> 'active' then
      raise exception 'One of the products in your cart is no longer available';
    end if;
    if product_row.inventory_tracking and coalesce(product_row.inventory_quantity, 0) < item.quantity then
      raise exception 'One of the products in your cart no longer has enough inventory';
    end if;

    subtotal_amount := subtotal_amount + (product_row.price * item.quantity);
  end loop;

  if nullif(trim(p_discount_code), '') is not null then
    select * into discount_row
    from public.discounts
    where code = upper(trim(p_discount_code))
      and active = true
      and (expires_at is null or expires_at > now())
      and (usage_limit is null or usage_limit > 0);
    if found then
      discount_amount := case
        when discount_row.type = 'percentage' then least(subtotal_amount, subtotal_amount * discount_row.value / 100)
        else least(subtotal_amount, discount_row.value)
      end;
    end if;
  end if;

  insert into public.orders (user_id, guest_name, guest_email, status, subtotal, discount_amount, total, venmo_paid, shipping_name, shipping_address, shipping_city, shipping_state, shipping_postal_code, shipping_country, customer_notes)
  values (current_user_id, p_guest_name, p_guest_email, 'submitted', subtotal_amount, discount_amount, greatest(0, subtotal_amount - discount_amount), p_venmo_paid, p_shipping_name, p_shipping_address, p_shipping_city, p_shipping_state, p_shipping_postal_code, coalesce(p_shipping_country, 'United States'), p_customer_notes)
  returning id into new_order_id;

  for item in select * from jsonb_to_recordset(p_items) as entries(product_id bigint, quantity integer)
  loop
    select id, name, price, inventory_tracking, inventory_quantity
    into product_row
    from public.products
    where id = item.product_id
    for update;

    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price)
    values (new_order_id, product_row.id, product_row.name, item.quantity, product_row.price);

    update public.products
    set status = 'sold',
        inventory_quantity = case when inventory_tracking then greatest(0, coalesce(inventory_quantity, 0) - item.quantity) else inventory_quantity end,
        updated_at = now()
    where id = product_row.id;

    delete from public.wishlist_items where product_id = product_row.id;
  end loop;

  return new_order_id;
end;
$$;

grant execute on function public.submit_order(jsonb, text, text, text, text, text, text, text, text, text, text, boolean) to authenticated;

notify pgrst, 'reload schema';
