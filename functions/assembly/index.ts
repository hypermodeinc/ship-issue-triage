import { models } from "@hypermode/functions-as";
import {
  ClassificationModel,ClassifierResult
} from "@hypermode/models-as/models/experimental/classification";

const ISSUE_CLASSIFIER_MODEL_NAME = "issue-classifier";

export function classifyIssueText(text: string): ClassifierResult {
  
  const model = models.getModel<ClassificationModel>(ISSUE_CLASSIFIER_MODEL_NAME);
  const input = model.createInput([text]);
  const output = model.invoke(input);

  return output.predictions[0];
  
  
}
