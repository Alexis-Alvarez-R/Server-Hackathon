import { supabase } from "../data-source.js";
import type { Request, Response } from "express";

export const getLugares = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("lugares").select("*");
  return res.send(data);
};

export const getImagenesLugar = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const { data, error } = await supabase
      .from("lugar_imagenes")
      .select("*")
      .eq("lugar_id", id);

    if (error) throw new Error("Error al obtener las imagenes");

    const arrayUrl = data.map((lugar) => lugar.url);
    return res.status(200).json(arrayUrl);
  } catch (error) {
    return res.status(500).json("Error");
  }
};

export async function descubreIA(req: Request, res: Response) {
  const { mensaje } = req.body;

  try {
    const { data: lugares, error } = await supabase
      .from("lugares")
      .select("nombre, descripcion, id, img");

    if (error) {
      console.error("Error al obtener lugares:", error.message);
      return res
        .status(500)
        .json({ error: "Error al obtener datos de lugares" });
    }

    if (!lugares || lugares.length === 0) {
      return res.status(404).json({ error: "No hay lugares registrados" });
    }

    const contexto = lugares
      .map((l) => `${l.nombre}: ${l.descripcion} (id: ${l.id})`)
      .join("\n");

    const prompt = `
Eres un asistente turístico de Nicaragua.
Solo puedes sugerir lugares de esta lista:
${contexto}

Responde en español de forma breve en formato JSON con esta estructura:
{
  "respuesta": "texto breve de recomendación",
  "id": <id del lugar recomendado o null si no hay coincidencia>
}

Usuario: ${mensaje}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Asistente Turístico Nicaragua",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Eres un asistente turístico nicaragüense, muy conciso.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 100,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Respuesta de OpenRouter:", JSON.stringify(data, null, 2));

    const contenido = data?.choices?.[0]?.message?.content;
    if (!contenido) throw new Error("La IA no devolvió contenido.");

    let resultado;
    try {
      resultado = JSON.parse(contenido);
    } catch {
      resultado = { respuesta: contenido, id: null };
    }

    console.log(resultado);
    const id = resultado.id;

    const lugarRecomendado = lugares.find((lugar) => lugar.id == id);
    if (lugarRecomendado) {
      const img = lugarRecomendado.img;
      const repuesta = { ...resultado, img };
      console.log(" la repuesta essss");
      console.log(repuesta);

      return res.status(200).json(repuesta);
    }
    throw new Error("Error al encontrar el lugar");
  } catch (error) {
    console.error("Error en descubreIA:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener respuesta de la IA" });
  }
}
