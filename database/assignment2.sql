INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) VALUES
('Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

SELECT * FROM public.account;

UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
RETURNING *;

SELECT * FROM public.account;

DELETE FROM public.account WHERE account_firstname = 'Tony';

SELECT * FROM public.account;

---------

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer'
RETURNING *;

SELECT b.inv_make, b.inv_model, a.classification_name
FROM public.inventory AS b
INNER JOIN public.classification AS a
	ON b.classification_id = a.classification_id AND a.classification_name = 'Sport';

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
RETURNING *;