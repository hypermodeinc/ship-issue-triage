import { models } from "@hypermode/functions-as";
import { EmbeddingsModel } from "@hypermode/models-as/models/experimental/embeddings";

export function minilmEmbedder(text: string[]): f32[][] {
  const model = models.getModel<EmbeddingsModel>("minilm");
  const input = model.createInput(text);
  const output = model.invoke(input);

  return output.predictions;
}
