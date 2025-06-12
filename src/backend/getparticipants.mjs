// import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

// const client = new DynamoDBClient({ region: "eu-central-1" });

// export const handler = async () => {
//   try {
//     const command = new ScanCommand({ TableName: "Participants" });
//     const response = await client.send(command);

//     const items =
//       response.Items?.map((item) => ({
//         id: item.id.S,
//         name: item.name.S,
//         status: item.status.S,
//       })) || [];

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ items }),
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Methods": "GET,OPTIONS",
//       },
//     };
//   } catch (error) {
//     console.error("Błąd Lambdy GET:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Błąd serwera", error: error.message }),
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Methods": "GET,OPTIONS",
//       },
//     };
//   }
// };
