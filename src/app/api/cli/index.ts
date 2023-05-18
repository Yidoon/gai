export default function handler(req, res) {
  console.log(res.method, " ===");
  if (req.method === "POST") {
    // Process a POST request
  } else {
    // Handle any other HTTP method
    res.status(200).json({ name: "John Doe" });
    res.send();
  }
}
