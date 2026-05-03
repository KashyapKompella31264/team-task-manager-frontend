import { useState, useEffect } from "react";
import axios from "axios";

const UserPage = ({ token, logout }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const API = "http://localhost:5000";
  const headers = { Authorization: token };

  const getProjects = async () => {
    const res = await axios.get(`${API}/projects`, { headers });
    setProjects(res.data);
  };

  const getTasks = async () => {
    const res = await axios.get(`${API}/tasks`, { headers });

    const userId = JSON.parse(atob(token.split(".")[1])).id;

    const filtered = res.data.filter(t =>
      t.projectId?._id === selectedProject._id &&
      t.assignedTo?.some(u => u._id === userId)
    );

    setTasks(filtered);
  };

  const markDone = async (id) => {
    await axios.put(`${API}/task/${id}`, { status: "done" }, { headers });
    getTasks();
  };

  useEffect(() => { getProjects(); }, []);
  useEffect(() => { if (selectedProject) getTasks(); }, [selectedProject]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      <div style={{ width: "30%", padding: "20px", borderRight: "1px solid gray" }}>
        <h3>Projects</h3>
        {projects.map(p => (
          <div key={p._id} onClick={() => setSelectedProject(p)}>
            {p.name}
          </div>
        ))}
      </div>

      <div style={{ width: "70%", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>{selectedProject ? selectedProject.name : "My Tasks"}</h2>
          <button onClick={logout}>Logout</button>
        </div>

        {selectedProject && tasks.map(t => (
          <div key={t._id}>
            <h4>{t.title}</h4>
            <p>{t.description}</p>

            {t.status !== "done" ? (
              <button onClick={() => markDone(t._id)}>Done</button>
            ) : (
              <span>✔ Done</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;