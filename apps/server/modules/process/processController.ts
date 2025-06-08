import pidusage from "pidusage";
import psList from "ps-list";

class ProcessController {
  async getProcesses(req, res) {
    console.log(">>> getProcesses CALLED");

    try {
      return res.json(await psList());
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error fetching processes" });
    }
  }
}

export default new ProcessController();
