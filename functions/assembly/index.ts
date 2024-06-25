import { models } from "@hypermode/functions-as";
import {generateTrendSummary} from "./genai";

import {
  ClassificationModel,ClassifierResult
} from "@hypermode/models-as/models/experimental/classification";
import {getGithubIssues, User} from "./github";

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

export function trendSummary(    
  owner: string,
  repo: string,
  since: string): string {
    const issues = getGithubIssues(owner, repo, since);
  
    const context = issues.map<string>(issue => `${issue.created_at} ${(issue.user != null)? "From "+(<User>issue.user).login: ""} : ${issue.title}`).join("\n");
    const trend = generateTrendSummary(context);
    return trend;
}
