import { GoogleGenAI } from "@google/genai";

const API_KEY = atob(
  "QVEuQWI4Uk42S2ZsWExQN3hWNE9wbnRGX3UxN1d5YUpEVm5ONUNmTDdsLWlQdnNxTWE3TXc=",
);

const questiontab = Array.from(document.querySelector(".col").children);
const question = questiontab.flatMap((q) => {
  switch (q.tagName) {
    case "P":
      return [{
        type: "text",
        text: q.textContent,
      }];
    case "IMG":
      return [{
        type: "image",
        uri: q.src,
        mime_type: "image/png",
      }];
    default:
      return [];
  }
});
console.log(question);
const textField = document.querySelector("#text-answer");

const subject = document.querySelector(".question-progress-subject");

const context = {
  type: "text",
  text: `Giving short answers without explanation just straight up answer the subject it scottish ${subject} make sure the question is appropriate for SQA and uses appropriate terms for SQA ${subject}, meaning if an SQA marker were to mark your answer you would be correct also do not include any unnecessary symbols like fullstops and explanation marks, just state the answer. The question is: `,
};

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

const generationConfig = {
  temperature: 1,
  max_output_tokens: 65536,
  top_p: 0.95,
  thinking_level: "medium",
};

async function main() {
  const interaction = await ai.interactions.create({
    model: "models/gemini-3.5-flash-lite",
    input: [context, ...question],
    generation_config: generationConfig,
  });

  if (interaction.output_text) {
    console.log(interaction.output_text);
    textField.value = interaction.output_text;
  }
}

main();

// First test: Higher Periodicity 4/5 Note: Model used wrong terms (Atomic radius and not Covalent radius)
// Second test: Higher Structure and Bonding 5/5 Note: Now supports images, works perfectly
