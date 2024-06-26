import { models } from "@hypermode/functions-as";
import { getGithubIssues } from "./github";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/models-as/models/openai/chat";

export function trendSummary(owner: string, repo: string, since: Date): string {
  const issues = getGithubIssues(owner, repo, since);

  const summary = issues
    .map<string>(
      (issue) =>
        `${issue.createdAt} ${issue.user ? "From " + issue.user!.login : ""} : ${issue.title}`,
    )
    .join("\n");

  const model = models.getModel<OpenAIChatModel>("text-generator");
  const prompt =
    "Provide a summary of the trends in the repository based on the issues created.";

  const input = model.createInput([
    new SystemMessage(prompt),
    new UserMessage(summary),
  ]);

  input.temperature = 0.7;

  const output = model.invoke(input);

  return output.choices[0].message.content.trim();
}
