import { baseGetRoute } from "../baseGetroute";

export async function GET() {

  return baseGetRoute("sessions", "*, games (categories)"); 
}
