SELECT
  *
FROM (
  SELECT
    *,
    row_number() OVER (PARTITION BY vendor, listingid, modified ORDER BY vendor, listingid, modified DESC) AS seqnum
  FROM
    "liveby--guido-data"."liveby__guido_data") src
WHERE
  seqnum = 1
