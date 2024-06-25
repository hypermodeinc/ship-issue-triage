import { models } from "@hypermode/functions-as";
import { EmbeddingsModel } from "@hypermode/models-as/models/experimental/embeddings";

const modelName = "minilm";

export function embedIssue(text: string[]): f32[][] {
  const model = models.getModel<EmbeddingsModel>(modelName);

  const input = model.createInput(text);
  const output = model.invoke(input);

  return output.predictions;
}
