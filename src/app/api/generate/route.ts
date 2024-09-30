import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import fs from "fs";
import { NextResponse } from "next/server";

// Define the API handler function
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract user inputs from the request body
    const {
      modelImage,
      lowerBodyItem,
      bottomClothingImage,
      upperBodyItem,
      upperClothingImage,
      bottomPrompt,
      topPrompt,
    } = req.body;

    // Load the workflow JSON file
    const workflowData = fs.readFileSync("./workflow.json", "utf-8");
    const workflow = JSON.parse(workflowData);

    // Find and update "MODEL FULL BODY" node (for model image)
    const modelNode = workflow.nodes.find(
      (node: any) => node.title === "MODEL FULL BODY"
    );
    if (modelNode) {
      // Update the model image (e.g., "male-model.jpg" or "female-model.jpg")
      modelNode.widgets_values[0] = modelImage;
    }

    // UPPER BODY UPDATES BEGIN HERE
    const upperBodyNode = workflow.nodes.find(
      (node: any) => node.title === "TOP SEGMENT"
    );
    if (upperBodyNode) {
      // Update body part segmented (e.g., pants, skirt)
      upperBodyNode.widgets_values[0] = upperBodyItem;
    }
    const upperClothingNode = workflow.nodes.find(
      (node: any) => node.title === "TOP CLOTHING"
    );
    if (upperClothingNode) {
      // Update the bottom clothing image (e.g., "skirt.jpg")
      upperClothingNode.widgets_values[0] = upperClothingImage;
    }
    //Find and update upper IDM-VTON Prompt
    const upperIdmvton = workflow.nodes.find(
      (node: any) => node.title === "TOP IDM-VTON"
    );
    if (upperIdmvton) {
      // Update the description prompt (e.g., "a model wearing a skirt")
      upperIdmvton.widgets_values[0] = `a model is wearing a ${upperBodyItem}.`;
    }
    // Find and update upper body prompt
    const upperPromptNode = workflow.nodes.find(
      (node: any) => node.title === "TOP PROMPT"
    );
    if (upperPromptNode) {
      // Update the description prompt (e.g., "a model wearing a skirt")
      upperPromptNode.widgets_values[0] = topPrompt;
    }
    // UPPER BODY UPDATES END HERE

    // LOWER BODY UPDATES BEGIN HERE
    const lowerBodyNode = workflow.nodes.find(
      (node: any) => node.title === "BOTTOM SEGMENT"
    );
    if (lowerBodyNode) {
      // Update the lower body item (e.g., pants, skirt)
      lowerBodyNode.widgets_values[0] = lowerBodyItem;
    }
    const bottomClothingNode = workflow.nodes.find(
      (node: any) => node.title === "BOTTOM CLOTHING"
    );
    if (bottomClothingNode) {
      // Update the bottom clothing image (e.g., "skirt.jpg")
      bottomClothingNode.widgets_values[0] = bottomClothingImage;
    }
    //Find and update bottom IDM-VTON Prompt
    const bottomIdmvton = workflow.nodes.find(
      (node: any) => node.title === "BOTTOM IDM-VTON"
    );
    if (bottomIdmvton) {
      // Update the description prompt (e.g., "a model wearing a skirt")
      bottomIdmvton.widgets_values[0] = `a model is wearing ${lowerBodyItem}.`;
    }
    // Find and update lower body prompt
    const bottomPromptNode = workflow.nodes.find(
      (node: any) => node.title === "BOTTOM PROMPT"
    );
    if (bottomPromptNode) {
      // Update the description prompt (e.g., "a model wearing a skirt")
      bottomPromptNode.widgets_values[0] = bottomPrompt;
    }
    // LOWER BODY UPDATES END HERE

    // Send the modified workflow to the ComfyUI API
    const response = await fetch("https://http://69.30.85.101:22148/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`, // Use an API key for authentication
      },
      body: JSON.stringify({
        workflow: workflow, // Send the modified workflow
      }),
    });

    // Get the response from ComfyUI
    const result = await response.json();

    // Return the result back to the frontend
    return NextResponse.json({ output: "WORKS!" });
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: "Something went wrong" });
  }
}
