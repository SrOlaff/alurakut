import { SiteClient } from "datocms-client";

export default async function recebedorDeRequests(req, res) {
  if (req.method === "POST") {
    const token = "1fe8fce603f470292b49eadb7457ae";
    const client = new SiteClient(token);
    const registroCriado = await client.items.create({
      itemType: "967683",
      ...req.body,
      // title: "SrOlaff",
      // imageUrl: "https://github.com/srolaff.png",
      // creatorSlug: "SrOlaff",
    });
    console.log(token);
    res.json({
      dados: "Algum Dado",
      registroCriado: registroCriado,
    });
  }

  req.status(404).json({
    message: "Ainda não temos nada no GET, mas no POST tem!!",
  });
}
