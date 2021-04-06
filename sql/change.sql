WITH UNIQUE AS (
  SELECT
    *,
    row_number() OVER (PARTITION BY '1' ORDER BY listingid) AS rownum,
    row_number() OVER (PARTITION BY 'vendor' ORDER BY vendor,
      listingid) AS vendornum
  FROM (
    SELECT
      *,
      row_number() OVER (PARTITION BY vendor, listingid,
        modified ORDER BY vendor, listingid,
        modified DESC) AS seqnum
    FROM
      "liveby--guido-data"."liveby__guido_data") source
  WHERE
    seqnum = 1
)
SELECT
  *
FROM
  UNIQUE uni
  JOIN (
    SELECT
      *
    FROM (
      SELECT
        vendor,
        listingid,
        count(1) vendor_listingid_count
      FROM
        UNIQUE
      GROUP BY
        vendor,
        listingid) unq_vendor_listingid
    WHERE
      vendor_listingid_count > 1) chg ON chg.listingid = uni.listingid
