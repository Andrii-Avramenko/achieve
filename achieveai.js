import { GoogleGenAI } from "@google/genai";

const API_KEY = atob(
  "QVEuQWI4Uk42S2ZsWExQN3hWNE9wbnRGX3UxN1d5YUpEVm5ONUNmTDdsLWlQdnNxTWE3TXc=",
);

const questiontab = Array.from(document.querySelector(".col").children);
const question = questiontab.flatMap((q) => {
  switch (q.tagName) {
    case "P":
      return [
        {
          type: "text",
          text: q.textContent,
        },
      ];
    case "IMG":
      return [
        {
          type: "image",
          uri: q.src,
          mime_type: "image/png",
        },
      ];
    default:
      return [];
  }
});
const mc = [];
const textField = document.querySelector("#text-answer");
if (!textField) {
  const mcRows = Array.from(
    document.querySelector(".card-body").children,
  ).filter((i) => i.nodeName === "DIV");
  const mcOptions = mcRows.flatMap((i) => [...i.children]);
  const mcInput = mcOptions
    .map((o, i) => {
      return `${i + 1}: ${o.children[0].textContent.trim()}`;
    })
    .join(", ");
  mc.push({
    type: "text",
    text: `(This is a multiple choice question so pick the correct option and return just a single number representing the option) Options: ${mcInput}`,
  });
}

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
    input: [context, ...question, ...mc],
    generation_config: generationConfig,
  });

  if (interaction.output_text) {
    console.log(interaction.output_text);
    if (textField) {
      textField.value = interaction.output_text;
      document.querySelector(`#submit-answer-button`).click()
      return;
    } else if (mc) {
      document.querySelector(`button[value='${interaction.output_text}']`).click();
    } else {
      console.log('error! no input found')
      return
    }
  }
}

main();

// First test: Higher Periodicity 4/5 Note: Model used wrong terms (Atomic radius and not Covalent radius)
// Second test: Higher Structure and Bonding 5/5 Note: Now supports images, works perfectly
