import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRoundPlus,
  User,
  Mail,
  Phone,
  MapPin,
  LockKeyhole,
  Eye,
  EyeOff
} from "lucide-react";

export default function WorkerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    centre: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const workers = JSON.parse(
      localStorage.getItem("workerUsers") || "[]"
    );

    const alreadyExists = workers.some(
      (worker) => worker.email === form.email
    );

    if (alreadyExists) {
      setError("A worker with this email already exists.");
      return;
    }

    const newWorker = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      centre: form.centre,
      password: form.password,

      // Important:
      // Worker cannot login until Admin approves.
      status: "pending"
    };

    workers.push(newWorker);

    localStorage.setItem(
      "workerUsers",
      JSON.stringify(workers)
    );

    alert(
      "Registration submitted successfully! Please wait for Admin approval."
    );

    navigate("/worker-login");
  };

  return (
    <div className="role-login-page">

      <button
        className="back-button role-back"
        onClick={() => navigate("/worker-login")}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <form
        className="role-login-card"
        onSubmit={handleRegister}
      >

        <div className="role-login-icon worker-icon">
          <UserRoundPlus size={32} />
        </div>

        <h1>Worker Registration</h1>

        <p>
          Register as an Anganwadi Worker
        </p>

        <div className="form-group">
          <label>Full Name</label>

          <div className="login-input">
            <User size={17} />

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>

          <div className="login-input">
            <Mail size={17} />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>

          <div className="login-input">
            <Phone size={17} />

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Anganwadi Centre</label>

          <div className="login-input">
            <MapPin size={17} />

            <input
              type="text"
              name="centre"
              placeholder="Enter Anganwadi centre"
              value={form.centre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="login-input">
            <LockKeyhole size={17} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Confirm Password</label>

          <div className="login-input">
            <LockKeyhole size={17} />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "#dc2626",
              fontSize: "13px",
              marginTop: "4px"
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="login-button"
        >
          Submit Registration
        </button>

        <small>
          Your account will remain pending until it is
          approved by an Admin.
        </small>

      </form>
    </div>
  );
}