import { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = ({ token, logout }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");

  const API = "http://localhost:5000";
  const headers = { Authorization: token };

  const getProjects = async () => {
    const res = await axios.get(`${API}/projects`, { headers });
    setProjects(res.data);
  };

  const getTasks = async () => {
    const res = await axios.get(`${API}/tasks`, { headers });
    setTasks(res.data.filter(t => t.projectId?._id === selectedProject._id));
  };

  const createTask = async () => {
    await axios.post(`${API}/task`, {
      title: taskTitle,
      description,
      projectId: selectedProject._id
    }, { headers });

    setTaskTitle("");
    setDescription("");
    getTasks();
  };

  useEffect(() => { getProjects(); }, []);
  useEffect(() => { if (selectedProject) getTasks(); }, [selectedProject]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      <div style={{ width: "25%", padding: "20px" }}>
        <h3>Projects</h3>
        {projects.map(p => (
          <div key={p._id} onClick={() => setSelectedProject(p)}>
            {p.name}
          </div>
        ))}
      </div>

      <div style={{ width: "75%", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>{selectedProject?.name || "Dashboard"}</h2>
          <button onClick={logout}>Logout</button>
        </div>

        {selectedProject && (
          <>
            <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
            <input value={description} onChange={e => setDescription(e.target.value)} />
            <button onClick={createTask}>Add Task</button>

            {tasks.map(t => (
              <div key={t._id}>{t.title}</div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;