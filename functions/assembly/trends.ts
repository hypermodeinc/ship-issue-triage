import { models } from "@hypermode/functions-as";
import { User } from "./github";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/models-as/models/openai/chat";

import { getGithubIssues } from "./github";

export function trendSummary(
  owner: string,
  repo: string,
  since: string,
): string {
  const modelName: string = "text-generator";

  const issues = getGithubIssues(owner, repo, since);

  const context = issues
    .map<string>(
      (issue) =>
        `${issue.created_at} ${issue.user != null ? "From " + (<User>issue.user).login : ""} : ${issue.title}`,
    )
    .join("\n");

  const model = models.getModel<OpenAIChatModel>(modelName);
  const input = model.createInput([
    new SystemMessage(
      "Provide a summary of the trends in the repository based on the issues created.",
    ),
    new UserMessage(context),
  ]);

  input.temperature = 0.7;

  const output = model.invoke(input);

  const trend = output.choices[0].message.content.trim();

  return trend;
}
