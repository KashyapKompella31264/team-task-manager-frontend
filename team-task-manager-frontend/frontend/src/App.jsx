import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [token, setToken] = useState("");
  const [page, setPage] = useState("login");

  const API = "https://team-task-manager-production-b233.up.railway.app";

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setPage(savedRole === "admin" ? "dashboard" : "user");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setPage("login");
  };

  // ================= LOGIN =================
  const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
      try {
        const res = await axios.post(`${API}/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        localStorage.setItem("role", res.data.role); // 🔥 ADD THIS
        setPage(res.data.role === "admin" ? "dashboard" : "user");
      } catch {
        alert("Login failed");
      }
    };

    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f9",
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          width: "100%",
          maxWidth: "400px"
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ margin: "0 0 8px", color: "#1e293b", fontSize: "24px" }}>Welcome Back</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Log in to manage your projects</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#475569", marginBottom: "6px" }}>Email Address</label>
              <input 
                type="email"
                placeholder="name@company.com"
                onChange={e => setEmail(e.target.value)} 
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#475569", marginBottom: "6px" }}>Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)} 
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>

            <button 
              onClick={login}
              style={{
                width: "100%",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                marginTop: "8px",
                transition: "background-color 0.2s"
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  };

  const UserPage = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    const headers = { Authorization: token };

    // GET PROJECTS
    const getProjects = async () => {
      const res = await axios.get(`${API}/projects`, { headers });
      setProjects(res.data);
    };

    // GET TASKS FOR USER
    const getTasks = async () => {
      const res = await axios.get(`${API}/tasks`, { headers });

      const userId = JSON.parse(atob(token.split(".")[1])).id;

      const filtered = res.data.filter(t =>
        t.projectId?._id === selectedProject._id &&
        t.assignedTo?.some(u => u._id === userId)
      );

      setTasks(filtered);
    };

    // UPDATE STATUS
    const updateStatus = async (id, status) => {
      await axios.put(`${API}/task/${id}`, { status }, { headers });
      getTasks();
    };

    useEffect(() => {
      getProjects();
    }, []);

    useEffect(() => {
      if (selectedProject) getTasks();
    }, [selectedProject]);

    return (
      <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
        {/* LEFT: PROJECTS */}
        <div style={{ width: "280px", padding: "24px", borderRight: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ margin: 0, color: "#0f172a", fontSize: "16px", fontWeight: "600" }}>Projects</h3>
          </div>

          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {projects.map(p => (
              <li
                key={p._id}
                style={{
                  cursor: "pointer",
                  padding: "10px 12px",
                  margin: "6px 0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: selectedProject?._id === p._id ? "#f1f5f9" : "transparent",
                  color: selectedProject?._id === p._id ? "#4f46e5" : "#334155",
                  fontWeight: selectedProject?._id === p._id ? "500" : "400",
                  transition: "all 0.2s"
                }}
                onClick={() => setSelectedProject(p)}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: TASKS */}
        <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div>
              <h2 style={{ margin: 0, color: "#0f172a", fontSize: "24px", fontWeight: "700" }}>
                {selectedProject ? selectedProject.name : "My Tasks"}
              </h2>
              {selectedProject && <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "14px" }}>Project Tasks Assigned to You</p>}
            </div>
            <button 
              onClick={logout}
              style={{
                backgroundColor: "#f1f5f9",
                color: "#475569",
                border: "1px solid #cbd5e1",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
            >
              Logout
            </button>
          </div>

          {selectedProject ? (
            <div>
              {tasks.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "48px 20px",
                  background: "#ffffff",
                  borderRadius: "8px",
                  border: "1px dashed #cbd5e1",
                  color: "#64748b"
                }}>
                  <p style={{ margin: 0, fontSize: "14px" }}>No tasks assigned in this project</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {tasks.map(t => (
  <div key={t._id} style={{ padding: "12px", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
    
    <h4>{t.title}</h4>

    <span>Status: {t.status}</span>

    {t.status !== "done" ? (
      <button onClick={() => updateStatus(t._id, "done")}>
        Mark as Done
      </button>
    ) : (
      <span>✔ Completed</span>
    )}
    
  </div>
))}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e2e8f0"
            }}>
              <p style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>Select a project from the sidebar to view your tasks</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ================= DASHBOARD =================
  const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    const [taskTitle, setTaskTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [assignedUser, setAssignedUser] = useState("");

    const [selectedTask, setSelectedTask] = useState(null);

    const headers = { Authorization: token };

    // FETCH DATA
    const getProjects = async () => {
      const res = await axios.get(`${API}/projects`, { headers });
      setProjects(res.data);
    };

    const getUsers = async () => {
      const res = await axios.get(`${API}/users`, { headers });
      setUsers(res.data);
    };

    const getTasks = async () => {
      const res = await axios.get(`${API}/tasks`, { headers });

      const filtered = selectedProject
        ? res.data.filter(t => t.projectId?._id === selectedProject._id)
        : [];

      // 🔥 normalize assignedTo
      const fixed = filtered.map(t => ({
        ...t,
        assignedTo: t.assignedTo || []
      }));

      setTasks(fixed);
    };

    useEffect(() => {
      getProjects();
      getUsers();
    }, []);

    useEffect(() => {
      if (selectedProject) getTasks();
    }, [selectedProject]);

    // CREATE TASK
    const createTask = async () => {
      if (!selectedProject) return alert("Select project");

      await axios.post(
        `${API}/task`,
        {
          title: taskTitle,
          description,
          projectId: selectedProject._id,
          dueDate,
          assignedTo: assignedUser ? [assignedUser] : []
        },
        { headers }
      );

      setTaskTitle("");
      setDescription("");
      setDueDate("");
      setAssignedUser("");
      getTasks();
    };

    // SAVE TASK
    const saveTask = async () => {
      try {
        const cleanedAssignedTo = (selectedTask.assignedTo || []).map(u =>
          typeof u === "object" ? u._id : u
        );

        console.log("PUT DATA:", {
          id: selectedTask._id,
          assignedTo: cleanedAssignedTo
        });

        const res = await axios.put(
          `${API}/task/${selectedTask._id}`,
          {
            title: selectedTask.title,
            description: selectedTask.description,
            status: selectedTask.status,
            assignedTo: cleanedAssignedTo
          },
          { headers }
        );

        console.log("SUCCESS:", res.data);

        setSelectedTask(null);
        getTasks();
      } catch (err) {
        console.log("FULL ERROR:", err);
        console.log("SERVER ERROR:", err.response?.data);
        alert("Update failed ❌");
      }
    };

    // FILTERS
    const now = new Date();
    const todo = tasks.filter(t => t.status !== "done");
    const completed = tasks.filter(t => t.status === "done");
    const overdue = tasks.filter(
      t => t.dueDate && new Date(t.dueDate) < now && t.status !== "done"
    );

    return (
      <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
        {/* PROJECTS */}
        <div style={{ width: "280px", padding: "24px", borderRight: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ margin: 0, color: "#0f172a", fontSize: "16px", fontWeight: "600" }}>Projects</h3>
          </div>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {projects.map(p => (
              <li 
                key={p._id} 
                onClick={() => setSelectedProject(p)} 
                style={{ 
                  cursor: "pointer",
                  padding: "10px 12px",
                  margin: "6px 0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: selectedProject?._id === p._id ? "#f1f5f9" : "transparent",
                  color: selectedProject?._id === p._id ? "#4f46e5" : "#334155",
                  fontWeight: selectedProject?._id === p._id ? "500" : "400",
                  transition: "all 0.2s"
                }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {selectedProject ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ margin: 0, color: "#0f172a", fontSize: "24px", fontWeight: "700" }}>{selectedProject.name} Dashboard</h2>
                </div>
                <button 
                  onClick={logout}
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  Logout
                </button>
              </div>

              {/* ADD TASK FORM */}
              <div style={{ 
                backgroundColor: "#ffffff", 
                padding: "20px", 
                borderRadius: "8px", 
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                border: "1px solid #e2e8f0",
                display: "flex", 
                gap: "12px", 
                flexWrap: "wrap",
                marginBottom: "28px"
              }}>
                <input 
                  placeholder="Task Title" 
                  value={taskTitle} 
                  onChange={e => setTaskTitle(e.target.value)} 
                  style={{ flex: "1 1 200px", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "13px" }}
                />
                <input 
                  placeholder="Description" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  style={{ flex: "1 1 200px", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "13px" }}
                />
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={e => setDueDate(e.target.value)} 
                  style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "13px", color: "#475569" }}
                />

                <select 
                  value={assignedUser} 
                  onChange={e => setAssignedUser(e.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "13px", color: "#475569" }}
                >
                  <option value="">Assign User</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.email}</option>
                  ))}
                </select>

                <button 
                  onClick={createTask}
                  style={{
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontWeight: "500",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  Add Task
                </button>
              </div>

              <hr style={{ border: 0, height: "1px", backgroundColor: "#e2e8f0", margin: "24px 0" }} />

              {/* TASKS COLUMNS */}
              <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                {/* Column 1: Todo */}
                <div style={{ flex: 1, backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", minHeight: "350px" }}>
                  <h3 style={{ margin: "0 0 16px", color: "#0f172a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Todo</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {todo.map(t => (
                      <div 
                        key={t._id} 
                        onClick={() => {
                          let assigned = t.assignedTo;
                          if (!assigned) assigned = [];
                          else if (!Array.isArray(assigned)) assigned = [assigned];
                          setSelectedTask({ ...t, assignedTo: assigned });
                        }} 
                        style={{ 
                          padding: "12px", 
                          backgroundColor: "#f8fafc", 
                          border: "1px solid #e2e8f0", 
                          borderRadius: "6px", 
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#334155",
                          transition: "border 0.15s"
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Completed */}
                <div style={{ flex: 1, backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", minHeight: "350px" }}>
                  <h3 style={{ margin: "0 0 16px", color: "#0f172a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Completed</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {completed.map(t => (
                      <div 
                        key={t._id} 
                        onClick={() => {
                          let assigned = t.assignedTo;
                          if (!assigned) assigned = [];
                          else if (!Array.isArray(assigned)) assigned = [assigned];
                          setSelectedTask({ ...t, assignedTo: assigned });
                        }} 
                        style={{ 
                          padding: "12px", 
                          backgroundColor: "#f8fafc", 
                          border: "1px solid #e2e8f0", 
                          borderRadius: "6px", 
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#334155"
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Overdue */}
                <div style={{ flex: 1, backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", minHeight: "350px" }}>
                  <h3 style={{ margin: "0 0 16px", color: "#0f172a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Overdue</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {overdue.map(t => (
                      <div 
                        key={t._id} 
                        onClick={() => {
                          let assigned = t.assignedTo;
                          if (!assigned) assigned = [];
                          else if (!Array.isArray(assigned)) assigned = [assigned];
                          setSelectedTask({ ...t, assignedTo: assigned });
                        }} 
                        style={{ 
                          padding: "12px", 
                          backgroundColor: "#f8fafc", 
                          border: "1px solid #e2e8f0", 
                          borderRadius: "6px", 
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#b45309"
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MODAL */}
              {selectedTask && (
                <div style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 100
                }}>
                  <div style={{
                    background: "#ffffff",
                    padding: "28px",
                    width: "420px",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                  }}>
                    <h3 style={{ margin: "0 0 20px", color: "#0f172a", fontSize: "18px", fontWeight: "600" }}>Edit Task</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" }}>Title</label>
                        <input
                          value={selectedTask.title}
                          onChange={e => setSelectedTask({ ...selectedTask, title: e.target.value })}
                          style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "13px" }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" }}>Description</label>
                        <textarea
                          value={selectedTask.description || ""}
                          onChange={e => setSelectedTask({ ...selectedTask, description: e.target.value })}
                          style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "13px", height: "60px", resize: "none" }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" }}>Status</label>
                        <select
                          value={selectedTask.status}
                          onChange={e => setSelectedTask({ ...selectedTask, status: e.target.value })}
                          style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "13px", color: "#334155" }}
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>

                      {/* ASSIGNED USERS */}
                      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
                        <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "600", color: "#475569" }}>Assigned Users:</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                          {(selectedTask.assignedTo || []).map(u => (
                            <div key={u._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", backgroundColor: "#f1f5f9", borderRadius: "6px", fontSize: "13px" }}>
                              {u.email}
                              <button 
                                onClick={() => {
                                  setSelectedTask({
                                    ...selectedTask,
                                    assignedTo: selectedTask.assignedTo.filter(x => x._id !== u._id)
                                  });
                                }}
                                style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "10px" }}
                              >
                                ❌
                              </button>
                            </div>
                          ))}
                        </div>

                        <select 
                          onChange={(e) => {
                            const user = users.find(u => u._id === e.target.value);
                            if (!user) return;
                            if (selectedTask.assignedTo?.some(x => x._id === user._id)) return;
                            setSelectedTask({
                              ...selectedTask,
                              assignedTo: [...(selectedTask.assignedTo || []), user]
                            });
                          }}
                          style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "13px", color: "#475569" }}
                        >
                          <option>Add User</option>
                          {users.map(u => (
                            <option key={u._id} value={u._id}>{u.email}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "24px" }}>
                      <button 
                        onClick={saveTask}
                        style={{
                          backgroundColor: "#4f46e5",
                          color: "#ffffff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: "500",
                          fontSize: "13px",
                          cursor: "pointer"
                        }}
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setSelectedTask(null)}
                        style={{
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          border: "1px solid #cbd5e1",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: "500",
                          fontSize: "13px",
                          cursor: "pointer"
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              background: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              color: "#94a3b8"
            }}>
              <p style={{ fontSize: "16px", margin: 0 }}>Select a project from the sidebar to begin managing tasks</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {page === "login" && <LoginPage />}
      {page === "dashboard" && <Dashboard />}
      {page === "user" && <UserPage />} {/* 🔥 NEW */}
    </>
  );
}

export default App;