import { z } from 'zod';


export const name = "getCommentsForPost";
export const title = "Get Comments for Post";
export const description = "Handles the GET request.";

export const inputSchema = ({});
export const outputSchema = z.any().describe('The successful response from the API.');

export const handler = async  (input) => {
  let url = `https://jsonplaceholder.typicode.com/posts/1/comments`;
  
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add other necessary headers from your collection here, e.g., from process.env
      // 'Authorization': `Bearer ${process.env.API_KEY}`
    },
    
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
    console.error(`Error in getCommentsForPost tool:`, error);
    return { content: [{ type: "text", text: `Error executing tool getCommentsForPost: ${error.message}` }], isError: true };
  }
}
