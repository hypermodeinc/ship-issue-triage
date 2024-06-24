import { models } from "@hypermode/functions-as";
import {
  ClassificationModel,ClassifierResult
} from "@hypermode/models-as/models/experimental/classification";

const ISSUE_CLASSIFIER_MODEL_NAME = "issue-classifier";

// Define the structure we expect for the output of the classification function.
@json
export class IssueLabel {
  label!: string;
  confidence!: f32;
}

export function classifyIssueText(text: string): IssueLabel {
  
  const model = models.getModel<ClassificationModel>(ISSUE_CLASSIFIER_MODEL_NAME);
  // we submit only one text line
  const input = model.createInput([text]);
  // we get the prediction for the first text line
  const output = model.invoke(input).predictions[0];

  // return only the label and confidence
  return <IssueLabel>{
    label: output.label,
    confidence: output.confidence,
  };
  
  
}
