import { models } from "@hypermode/functions-as";
import { ClassificationModel } from "@hypermode/models-as/models/experimental/classification";

export function classifyIssue(id: string, title: string): string {
  const model = models.getModel<ClassificationModel>("issue-classifier");
  const input = model.createInput([title]);
  const output = model.invoke(input).predictions[0];

  return output.label;
}
