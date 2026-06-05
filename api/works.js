export default async function handler(req, res) {
  try {
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || "Table 1";

    if (!token || !baseId) {
      return res.status(500).json({
        error: "Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID",
      });
    }

    const url =
  `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?view=Grid%20view`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Airtable API error",
        detail: data,
      });
    }

    const records = data.records || [];

    const works = records.map((record) => {
      const f = record.fields || {};
      console.log(f);

      return {
  title: f.Title || "",
  artist: f.Artist || "",
  role: Array.isArray(f.Role)
    ? f.Role.join(" • ")
    : String(f.Role || ""),
  note: f.Note || "",
  link: f.Link || "#",
  cover: f.Cover?.[0]?.url || "",
};
    });

    return res.status(200).json(works);
  } catch (error) {
    return res.status(500).json({
      error: "Server crashed",
      message: error.message,
    });
  }
}