export default async function handler(req, res) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Table 1";

  const url =
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}` +
    `?filterByFormula={Featured}=TRUE()`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  const works = data.records.map((record) => {
    const f = record.fields;

    return {
      title: f.Title || "",
      artist: f.Artist || "",
      role: f.Role || "",
      link: f.Link || "#",
      cover: f.Cover?.[0]?.url || "",
    };
  });

  res.status(200).json(works);
}