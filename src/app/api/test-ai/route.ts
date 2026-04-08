import { NextResponse } from "next/server";
import { buildRoadmapPrompt } from "@/lib/ai/promptBuilder";
import { generateRoadmapFromAI } from "@/lib/ai/aiClient";

export async function GET() {
  const samplePDS = `
Build an AI powered habit tracking app that helps users stay consistent.

Users define goals.
System breaks goals into tasks.
Gamification encourages daily usage.

Target users:
solo builders
students
early founders

Goal:
help users build strong habits.
`;

  const prompt = buildRoadmapPrompt({
    productStrategy: samplePDS,
    productStage: "MVP",
  });

  const roadmap = await generateRoadmapFromAI({
    systemPrompt: prompt.system,
    userPrompt: prompt.user,
  });

  console.log("ROADMAP RESULT:");
  console.log(JSON.stringify(roadmap, null, 2));

  return NextResponse.json(roadmap);
}
