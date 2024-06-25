import { models, collections } from "@hypermode/functions-as";
import {generateTrendSummary} from "./genai";

import {
  ClassificationModel,ClassifierResult
} from "@hypermode/models-as/models/experimental/classification";
import {getGithubIssues, User} from "./github";
import { EmbeddingsModel } from "@hypermode/models-as/models/experimental/embeddings";



const ISSUE_CLASSIFIER_MODEL_NAME = "issue-classifier";
const EMBEDDING_MODEL = "minilm"
const ISSUES_COLLECTION = "issuesCollection";

// Define the structure we expect for the output of the classification function.
@json
export class IssueLabel {
  label!: string;
  confidence!: f32;
}

export function classifyIssueText(id: string, title: string): IssueLabel {
  
  const model = models.getModel<ClassificationModel>(ISSUE_CLASSIFIER_MODEL_NAME);
  // we submit only one text line
  const input = model.createInput([title]);
  // we get the prediction for the first text line
  const output = model.invoke(input).predictions[0];
  // we are also storing the issue in the collection for similarity search
  addIssue(id, title)
  // return only the label and confidence
  return <IssueLabel>{
    label: output.label,
    confidence: output.confidence,
  };
  
}

// Define the structure we expect for the output of the similarity search function.
@json
export class SimilarIssue {
  id!: string;
  title!: string;
  similarity!: f64;
}

export function similarIssue(title: string): SimilarIssue {
  const response = collections.search(
    ISSUES_COLLECTION,
    "titleEmbedding",
    title,
    1,
    true,
  );
  const result = <SimilarIssue> {
    id: response.objects[0].key,
    title: response.objects[0].text,
    similarity: response.objects[0].score
  }
  return result;
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



// In this example, we will create embedding vectors from input text strings.
// For comparison, we'll do this with two different models.

export function embedIssue(text: string): f32[] {
  const model = models.getModel<EmbeddingsModel>("minilm");
  const input = model.createInput([text]);
  const output = model.invoke(input);
  return output.predictions[0];
}

export function addIssue(id: string, title: string): string {
  
  collections.upsert(ISSUES_COLLECTION , id, title);

  return "success"
}
