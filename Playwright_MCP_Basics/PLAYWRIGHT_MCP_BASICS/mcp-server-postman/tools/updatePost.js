import { z } from 'zod';


export const name = "updatePost";
export const title = "Update Post";
export const description = "Handles the PUT request.";

export const inputSchema = ({
  "body": z.object({
    "id": z.number(),
    "title": z.string(),
    "body": z.string(),
    "userId": z.number()
  }).optional()
});
export const outputSchema = z.any().describe('The successful response from the API.');

export const handler = async  (input) => {
  let url = `https://jsonplaceholder.typicode.com/posts/1`;
  
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Add other necessary headers from your collection here, e.g., from process.env
      // 'Authorization': `Bearer ${process.env.API_KEY}`
    },
    body: JSON.stringify(input.body),
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API call failed with status ${response.status}: ${errorBody}`);
    }
    const data = await response.json();
    // Validate the output and wrap it in the MCP content format
    const validatedData = outputSchema.parse(data);
     const jsonString = JSON.stringify(validatedData, null, 2);
       return { content: [{ type: "text", text: jsonString, }] };
  } catch (error) {
    console.error(`Error in updatePost tool:`, error);
    return { content: [{ type: "text", text: `Error executing tool updatePost: ${error.message}` }], isError: true };
  }
}
